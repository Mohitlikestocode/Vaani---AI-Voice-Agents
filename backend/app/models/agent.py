"""Data shapes for a Swara voice agent and reservations."""

from pydantic import BaseModel, Field
from datetime import datetime, timezone
import uuid


class AgentCreate(BaseModel):
    business_name: str
    business_type: str
    greeting: str = "Hi! How can I help you today?"
    instructions: str = ""
    # Optional restaurant/booking config
    total_seats: int = 20
    avg_eating_minutes: int = 60
    max_party_size: int = 20
    reservations_enabled: bool = True


class Agent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    owner_id: str = ""
    business_name: str
    business_type: str
    greeting: str
    instructions: str
    total_seats: int = 20
    avg_eating_minutes: int = 60
    max_party_size: int = 20
    reservations_enabled: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Reservation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    agent_id: str
    guest_name: str
    party_size: int
    date: str          # "2026-08-05"
    time: str          # "19:00"
    phone: str = ""
    notes: str = ""
    status: str = "confirmed"   # confirmed | cancelled
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ReservationUpdate(BaseModel):
    guest_name: str | None = None
    party_size: int | None = None
    date: str | None = None
    time: str | None = None
    phone: str | None = None
    notes: str | None = None


class ChatMessage(BaseModel):
    role: str
    text: str


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
