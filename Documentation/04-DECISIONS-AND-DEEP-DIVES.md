# Swara — Technical Decisions, Edge Cases & Deep Dives

## Why These Technologies?

### Why Groq (not OpenAI, not local LLM)?
- **Speed**: Groq serves LLMs on custom hardware (LPU). Response times are 100-300ms — feels instant in a voice call.
- **Free tier**: Good enough for a prototype with thousands of messages.
- **Function calling**: Groq supports structured tool use — the AI can programmatically call our reservation functions.
- **No GPU needed**: It's a cloud API, so this runs on any laptop.

### Why llama-3.3-70b-versatile (not 8b)?
- We tried `llama-3.1-8b-instant` first — it dumped raw `<function=...>` text to the user instead of using the tool API properly.
- The 70b model correctly uses Groq's function calling format and never leaks technical details.
- Trade-off: slightly slower (400ms vs 150ms) but far more reliable.

### Why FastAPI (not Express/Node)?
- **Async-native**: handles WebSocket, API calls, and multiple requests without blocking.
- **Pydantic models**: auto-validates request/response shapes — if the frontend sends wrong data, it gets a clear error.
- **Auto-docs**: visit `http://localhost:8001/docs` to see all endpoints with interactive testing (Swagger UI).
- **Python ecosystem**: Groq SDK, ML libraries, etc. are all Python-first.

### Why in-memory storage (not a database)?
- **Prototype speed**: zero setup, zero configuration, instant.
- **Trade-off**: data resets when the server restarts.
- **Upgrade path**: swap `_agents` dict to SQLAlchemy/Postgres by adding 1 file. The service functions stay the same — they just read/write from a different source.

### Why popup widget (not iframe)?
- **Microphone access**: Chrome blocks mic in cross-origin iframes. Period.
- **Popups** get their own origin context → full permissions.
- **In production**: you'd use your own domain + HTTPS, then iframes would work fine.

---

## Edge Cases Handled

### 1. Duplicate Reservations
**Problem**: LLM sometimes calls `create_reservation` twice in one turn.
**Solution**: `reservation_service.create_reservation()` checks if an identical booking (same guest + date + time + agent) already exists. If so, returns the existing one instead of creating a duplicate.

### 2. Model Outputs Raw Function Text
**Problem**: Some models output `<function=check_availability>{"date":"..."}` as plain text instead of using the tool API.
**Solution**: `_parse_raw_function_call()` in `agent_service.py` catches this pattern, executes the function, and re-prompts the model with the result.

### 3. party_size Type Mismatch
**Problem**: The LLM sends `"party_size": "4"` (string) but the schema expects integer. Groq rejects it.
**Solution**: Tool schema defines `party_size` as `"type": "string"`, and `_execute_tool()` coerces it to `int` before passing to the reservation service.

### 4. Chrome TTS onend Not Firing
**Problem**: `SpeechSynthesisUtterance.onend` doesn't fire reliably in Chrome.
**Solution**: We set BOTH `onend` callback AND a `setTimeout` fallback based on text length (~80ms per character). Whichever fires first wins (guarded by a `done` flag).

### 5. SpeechRecognition Dying Mid-Call
**Problem**: Chrome's SpeechRecognition with `continuous=true` sometimes fires `onend` randomly.
**Solution**: The `onend` handler auto-restarts recognition if `inCallRef.current` is still true.

### 6. Stale Closures in React + setTimeout
**Problem**: When `setTimeout` fires inside a speech recognition callback, it captures old state values.
**Solution**: Use `useRef` for values that need to be current inside callbacks (`sendingRef`, `inCallRef`). Refs always point to the latest value.

### 7. Conversation Memory Bleed
**Problem**: Different callers on the same agent see previous caller's conversation.
**Solution**: `POST /api/agents/{id}/reset` clears history. A new page load starts fresh (conversation only lives in memory per-session anyway).

### 8. Relative Date/Time Handling
**Problem**: User says "in 1 hour" or "next Sunday" — LLM needs to know current time.
**Solution**: System prompt includes `RIGHT NOW: 2026-08-05, 14:30` — the model calculates absolute dates from this.

---

## LLM Configuration Explained

```python
TEMPERATURE = 0.7    # Randomness (0=robotic, 1=creative, 0.7=natural conversation)
TOP_P = 0.9          # Only consider top 90% of likely words (cuts weird outputs)
MAX_TOKENS = 200     # Max reply length (~150 words) — keeps it phone-call-brief
FREQUENCY_PENALTY = 0.3  # Mild penalty for repeating same phrases
```

**Why these values?**
- A voice agent needs to sound **natural** (not robotic = temp 0) but also **focused** (not rambling = temp < 1).
- Short replies (max 200 tokens) because on a phone call, nobody wants a 3-paragraph answer.
- Frequency penalty stops the AI from saying "I'd be happy to help you" in every single message.

---

## The System Prompt (What Makes the AI Smart)

Every message sent to the LLM starts with a "system prompt" — instructions the user never sees. Ours includes:

1. **Identity**: "You are the AI phone receptionist for {business_name}"
2. **Current time**: So it can handle "in 1 hour", "tomorrow", "tonight"
3. **Business knowledge**: All the instructions the owner typed (hours, menu, prices, etc.)
4. **Capacity info**: Total seats, avg meal time, max party size
5. **Booking rules**: Step-by-step how to handle reservations (ask for name, size, date, time)
6. **General rules**: Keep replies short, don't make up info, never show function names

The system prompt is rebuilt on EVERY message (because current time changes).

---

## Data Models (Schemas)

### Agent
```
id: string (UUID, auto-generated)
owner_id: string (unused in prototype)
business_name: string
business_type: string ("Restaurant", "Salon", etc.)
greeting: string (first thing the agent says)
instructions: string (everything the agent knows about the business)
total_seats: int (default 20)
avg_eating_minutes: int (default 60)
max_party_size: int (default 20)
reservations_enabled: bool (default true)
created_at: datetime (auto-set)
```

### Reservation
```
id: string (UUID, auto-generated)
agent_id: string (which agent this belongs to)
guest_name: string
party_size: int
date: string ("2026-08-10")
time: string ("19:00")
phone: string (optional)
notes: string (optional)
status: string ("confirmed" | "cancelled")
created_at: datetime (auto-set)
```

### ChatRequest / ChatResponse
```
Request:  { message: string }
Response: { reply: string }
```

---

## Availability Algorithm (Deep Dive)

The `check_availability()` function in `reservation_service.py`:

```
Input: date="2026-08-10", time="19:00", party_size=4
Agent: total_seats=30, avg_eating_minutes=75

Step 1: Calculate requested window
  → Start: 19:00
  → End: 19:00 + 75min = 20:15

Step 2: Find all confirmed reservations on 2026-08-10 for this agent

Step 3: For each reservation, check if it overlaps with [19:00, 20:15]
  Example: Reservation at 18:30 for 6 people
    → Its window: 18:30 to 19:45
    → Does [19:00, 20:15] overlap with [18:30, 19:45]?
    → Yes! (19:00 < 19:45 AND 18:30 < 20:15) → 6 seats in use

Step 4: Sum all overlapping seats
  → seats_in_use = 6

Step 5: Check if enough space
  → available = 30 - 6 = 24
  → 4 <= 24? Yes! → Return (True, "24 seats available")
```

Two time windows overlap if: `start_A < end_B AND start_B < end_A`

---

## Security Notes (Prototype Limitations)

| What | Current State | Production Fix |
|------|--------------|----------------|
| Auth | Plain email/password in .env, stored in localStorage | JWT tokens, bcrypt password hashing, refresh tokens |
| API key | In .env file | Environment variables on the server, never in code |
| CORS | Allow all origins (`*`) | Whitelist specific domains |
| Input validation | Pydantic validates types | Add sanitization, rate limiting |
| Storage | In-memory (lost on restart) | PostgreSQL or MongoDB |
| HTTPS | Not used (localhost) | Required in production for mic access |

---

## What "One-Line Integration" Means

The entire promise of Swara is that any website can add an AI voice agent with:

```html
<script src="https://swara.app/widget.js" data-agent="YOUR_AGENT_ID"></script>
```

What this does:
1. Browser downloads and runs `widget.js`
2. Script reads `data-agent` attribute (the agent's UUID)
3. Creates a floating blue button (bottom-right of page)
4. On click → opens popup to `https://swara.app/chat/{agentId}?embed=true`
5. Customer talks to the AI in the popup
6. Reservations appear in the admin panel

The restaurant owner doesn't need to know anything about React, Python, APIs, or AI. One line. Done.

---

## Common Interview Questions & Answers

**Q: "Why not use WebRTC for voice?"**
A: WebRTC is production-grade but needs STUN/TURN servers, SDP negotiation, ICE candidates. The Web Speech API gives us working voice in 40 lines. We'd switch to WebRTC + Deepgram + ElevenLabs for production quality.

**Q: "How do you handle concurrent users?"**
A: Each agent has its own conversation history. Multiple customers chatting simultaneously work fine — they each get their own history array. FastAPI is async, handles many connections.

**Q: "What if the AI makes up a reservation?"**
A: It can't. The AI doesn't write to the database directly. It calls our `create_reservation` function which validates availability first. If seats aren't available, it returns an error and the AI tells the customer.

**Q: "How would you scale this?"**
A: 1) Replace in-memory dicts with Postgres. 2) Deploy backend to a cloud server. 3) Put frontend on a CDN. 4) Add Redis for session management. The architecture doesn't change — just the storage layer.

**Q: "Why is the data lost on restart?"**
A: Intentional for the prototype. In-memory storage means zero database setup. The service functions (`create_agent`, `list_reservations`, etc.) are the same interface — swapping to a DB is one file of changes.
