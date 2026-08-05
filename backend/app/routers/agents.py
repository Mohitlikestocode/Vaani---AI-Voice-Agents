"""API endpoints for agents, chat, and reservation management."""

from fastapi import APIRouter, HTTPException, Query

from app.models.agent import (
    AgentCreate, Agent, ChatRequest, ChatResponse,
    Reservation, ReservationUpdate,
)
from app.services.agent_service import create_agent, get_agent, list_agents, generate_reply
from app.services import reservation_service as rsv

router = APIRouter(tags=["agents"])


@router.post("/agents", response_model=Agent)
async def create_new_agent(data: AgentCreate):
    return create_agent(data)


@router.get("/agents", response_model=list[Agent])
async def get_all_agents():
    return list_agents()


@router.get("/agents/{agent_id}", response_model=Agent)
async def get_one_agent(agent_id: str):
    agent = get_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent


@router.post("/agents/{agent_id}/chat", response_model=ChatResponse)
async def chat_with_agent(agent_id: str, data: ChatRequest):
    agent = get_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    reply = generate_reply(agent, data.message)
    return ChatResponse(reply=reply)


@router.post("/agents/{agent_id}/reset")
async def reset_conversation(agent_id: str):
    """Clear conversation history for this agent (new caller)."""
    from app.services.agent_service import _history
    _history.pop(agent_id, None)
    return {"ok": True}


# ── Admin reservation endpoints ────────────────────────────────────

@router.get("/agents/{agent_id}/reservations", response_model=list[Reservation])
async def get_reservations(agent_id: str, date: str | None = Query(None)):
    """List all confirmed reservations, optionally filtered by date."""
    agent = get_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return rsv.list_reservations(agent_id, date)


@router.patch("/agents/{agent_id}/reservations/{reservation_id}", response_model=Reservation)
async def admin_update_reservation(agent_id: str, reservation_id: str, data: ReservationUpdate):
    """Admin: update a reservation directly."""
    result = rsv.update_reservation(reservation_id, data.model_dump(exclude_none=True))
    if not result["ok"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result["reservation"]


@router.delete("/agents/{agent_id}/reservations/{reservation_id}")
async def admin_cancel_reservation(agent_id: str, reservation_id: str):
    """Admin: cancel a reservation."""
    result = rsv.cancel_reservation(reservation_id)
    if not result["ok"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result
