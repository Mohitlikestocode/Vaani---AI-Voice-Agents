"""
Agent service — stores agents in memory, generates replies via Groq LLM.

The AI can manage reservations through function calling:
it decides when to book/edit/cancel/check, calls the right function,
and replies to the user with the result.
"""

import json
import re
from groq import Groq

from app.core import settings
from app.models.agent import Agent, AgentCreate
from app.services import reservation_service as rsv

_agents: dict[str, Agent] = {}
_history: dict[str, list[dict]] = {}
_groq = Groq(api_key=settings.groq_api_key)

TEMPERATURE = 0.7
TOP_P = 0.9
MAX_TOKENS = 200
FREQUENCY_PENALTY = 0.3

# ── Tools the AI can call ───────────────────────────────────────────
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "check_availability",
            "description": "Check if seats are available at a given date and time.",
            "parameters": {
                "type": "object",
                "properties": {
                    "date": {"type": "string", "description": "Date in YYYY-MM-DD format"},
                    "time": {"type": "string", "description": "Time in HH:MM 24-hour format"},
                    "party_size": {"type": "string", "description": "Number of guests"},
                },
                "required": ["date", "time", "party_size"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "create_reservation",
            "description": "Book a table for a guest. Only call this after you have all required details.",
            "parameters": {
                "type": "object",
                "properties": {
                    "guest_name": {"type": "string", "description": "Guest's name"},
                    "party_size": {"type": "string", "description": "Number of guests"},
                    "date": {"type": "string", "description": "Date in YYYY-MM-DD format"},
                    "time": {"type": "string", "description": "Time in HH:MM 24-hour format"},
                    "phone": {"type": "string", "description": "Phone number (optional)"},
                    "notes": {"type": "string", "description": "Any special requests"},
                },
                "required": ["guest_name", "party_size", "date", "time"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "find_reservation",
            "description": "Look up existing reservations by guest name.",
            "parameters": {
                "type": "object",
                "properties": {
                    "guest_name": {"type": "string", "description": "Guest name to search for"},
                },
                "required": ["guest_name"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "update_reservation",
            "description": "Change the date, time, party size, or other details of an existing reservation.",
            "parameters": {
                "type": "object",
                "properties": {
                    "reservation_id": {"type": "string", "description": "ID of the reservation to update"},
                    "date": {"type": "string", "description": "New date (YYYY-MM-DD)"},
                    "time": {"type": "string", "description": "New time (HH:MM)"},
                    "party_size": {"type": "string", "description": "New party size"},
                    "guest_name": {"type": "string", "description": "New guest name"},
                    "notes": {"type": "string", "description": "Updated notes"},
                },
                "required": ["reservation_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "cancel_reservation",
            "description": "Cancel an existing reservation by ID.",
            "parameters": {
                "type": "object",
                "properties": {
                    "reservation_id": {"type": "string", "description": "ID of the reservation to cancel"},
                },
                "required": ["reservation_id"],
            },
        },
    },
]


# Build the system prompt — the hidden instructions that tell the AI who it is,
# what it knows (business info), current date/time, and booking rules.
# This is rebuilt on EVERY message so the time is always current.
def _build_system_prompt(agent: Agent) -> str:
    from datetime import datetime
    now = datetime.now()
    today = now.strftime("%Y-%m-%d")
    current_time = now.strftime("%H:%M")
    return (
        f"You are the AI phone receptionist for {agent.business_name}, "
        f"a {agent.business_type.lower()}.\n"
        f"RIGHT NOW: {today}, {current_time} (24hr). Use this for relative times like 'in 1 hour', 'tonight', 'tomorrow'.\n\n"
        f"BUSINESS INFO:\n{agent.instructions}\n\n"
        f"CAPACITY: {agent.total_seats} seats, "
        f"avg meal {agent.avg_eating_minutes} min, "
        f"max group {agent.max_party_size}.\n\n"
        f"BOOKING FLOW:\n"
        f"1. When a customer wants to book, you MUST collect: name, party size, date, time.\n"
        f"   If any are missing, ASK for them. Do NOT guess.\n"
        f"2. Once you have all 4, call check_availability then create_reservation.\n"
        f"3. To change/cancel: call find_reservation by name, then update/cancel with the ID.\n"
        f"   If multiple reservations found for the same name, ask the customer to confirm\n"
        f"   their party size and booking time to identify the correct one.\n"
        f"4. Convert ALL relative times/dates to absolute:\n"
        f"   'in 1 hour' = {current_time} + 1hr. 'tomorrow' = day after {today}. 'tonight' = {today} evening.\n"
        f"   'this Sunday' = next Sunday from {today}. Always use YYYY-MM-DD and HH:MM.\n"
        f"5. Time must be in HH:MM 24-hour format.\n\n"
        f"RULES:\n"
        f"- Keep replies SHORT (1-2 sentences max).\n"
        f"- Be warm and helpful.\n"
        f"- Never make up info not in business info above.\n"
        f"- Never show function names or technical details to the customer.\n"
        f"- Greet with: \"{agent.greeting}\" only on the very first message.\n"
    )


# Execute a tool that the LLM decided to call.
# The LLM returns the tool name + arguments, we run the actual function here.
def _execute_tool(agent: Agent, name: str, args: dict) -> str:
    """Run a tool function and return the result as a string for the LLM."""
    # Coerce party_size to int (model sometimes passes strings)
    if "party_size" in args:
        try:
            args["party_size"] = int(args["party_size"])
        except (ValueError, TypeError):
            args["party_size"] = 1

    if name == "check_availability":
        ok, msg = rsv.check_availability(agent, args["date"], args["time"], args["party_size"])
        return json.dumps({"available": ok, "message": msg})

    if name == "create_reservation":
        result = rsv.create_reservation(
            agent, args["guest_name"], args["party_size"],
            args["date"], args["time"],
            args.get("phone", ""), args.get("notes", ""),
        )
        if result["ok"]:
            r = result["reservation"]
            return json.dumps({"ok": True, "id": r.id, "guest": r.guest_name,
                               "party_size": r.party_size, "date": r.date, "time": r.time})
        return json.dumps({"ok": False, "error": result["error"]})

    if name == "find_reservation":
        matches = rsv.find_reservations(agent.id, args["guest_name"])
        if not matches:
            return json.dumps({"found": 0, "message": f"No reservations found for '{args['guest_name']}'."})
        return json.dumps({"found": len(matches), "reservations": [
            {"id": r.id, "guest": r.guest_name, "party_size": r.party_size,
             "date": r.date, "time": r.time, "notes": r.notes}
            for r in matches
        ]})

    if name == "update_reservation":
        rid = args.pop("reservation_id")
        result = rsv.update_reservation(rid, args)
        if result["ok"]:
            r = result["reservation"]
            return json.dumps({"ok": True, "guest": r.guest_name, "date": r.date, "time": r.time})
        return json.dumps({"ok": False, "error": result["error"]})

    if name == "cancel_reservation":
        result = rsv.cancel_reservation(args["reservation_id"])
        return json.dumps(result)

    return json.dumps({"error": f"Unknown tool: {name}"})


# Create a new agent and store it in memory (our "database" for the prototype).
def create_agent(data: AgentCreate) -> Agent:
    agent = Agent(
        business_name=data.business_name,
        business_type=data.business_type,
        greeting=data.greeting,
        instructions=data.instructions,
        total_seats=data.total_seats,
        avg_eating_minutes=data.avg_eating_minutes,
        max_party_size=data.max_party_size,
        reservations_enabled=data.reservations_enabled,
    )
    _agents[agent.id] = agent
    _history[agent.id] = []
    return agent


def get_agent(agent_id: str) -> Agent | None:
    return _agents.get(agent_id)


def list_agents() -> list[Agent]:
    return sorted(_agents.values(), key=lambda a: a.created_at, reverse=True)


# Fallback parser: some LLM models output tool calls as raw text like
# <function=check_availability>{"date":"..."}. This catches and executes them.
def _parse_raw_function_call(text: str) -> tuple[str, dict] | None:
    """Parse <function=name>{...}</function> format that bad models output as text."""
    match = re.search(r'<function=(\w+)>\s*(\{[^}]+\})', text)
    if match:
        try:
            return match.group(1), json.loads(match.group(2))
        except json.JSONDecodeError:
            pass
    return None


# THE CORE FUNCTION: Send user message to Groq LLM, handle tool calls, return reply.
# Flow: user msg → add to history → call Groq → if tool call: execute, loop → return text.
# Loops up to 5 times (e.g. check_availability → create_reservation → final reply).
def generate_reply(agent: Agent, user_message: str) -> str:
    """Send the user's message to Groq. If the AI wants to call a tool, execute it and continue."""
    history = _history.setdefault(agent.id, [])
    history.append({"role": "user", "content": user_message})

    messages = [{"role": "system", "content": _build_system_prompt(agent)}, *history]

    for _ in range(5):
        response = _groq.chat.completions.create(
            model=settings.groq_model,
            messages=messages,
            tools=TOOLS if agent.reservations_enabled else None,
            temperature=TEMPERATURE,
            top_p=TOP_P,
            max_tokens=MAX_TOKENS,
            frequency_penalty=FREQUENCY_PENALTY,
        )

        choice = response.choices[0]

        # Proper tool call via API
        if choice.finish_reason == "tool_calls" and choice.message.tool_calls:
            messages.append(choice.message)

            for tool_call in choice.message.tool_calls:
                fn_name = tool_call.function.name
                fn_args = json.loads(tool_call.function.arguments)
                result = _execute_tool(agent, fn_name, fn_args)

                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": result,
                })
            continue

        # Text reply — check if it contains a raw function call (model bug)
        reply = (choice.message.content or "").strip()
        raw_call = _parse_raw_function_call(reply)
        if raw_call:
            fn_name, fn_args = raw_call
            result = _execute_tool(agent, fn_name, fn_args)
            # Remove the raw function text and add tool result as context
            clean_reply = re.sub(r'<function=\w+>\s*\{[^}]+\}\s*"?\s*</function>', '', reply).strip()
            messages.append({"role": "assistant", "content": clean_reply or "Let me check that for you."})
            messages.append({"role": "user", "content": f"[System: tool result for {fn_name}: {result}. Now respond naturally to the customer based on this result.]"})
            continue

        # Clean reply
        reply = re.sub(r'<function=.*?</function>', '', reply).strip()
        if not reply:
            reply = "How can I help you?"

        history.append({"role": "assistant", "content": reply})
        if len(history) > 30:
            _history[agent.id] = history[-30:]
        return reply

    return "Sorry, I ran into an issue processing that. Could you try again?"
