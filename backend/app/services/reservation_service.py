"""
Reservation service — manages bookings in memory.

Handles create / find / update / cancel + time-based availability checks.
"""

from datetime import datetime, timedelta

from app.models.agent import Agent, Reservation

# In-memory store: reservation_id -> Reservation
_reservations: dict[str, Reservation] = {}


def create_reservation(
    agent: Agent, guest_name: str, party_size: int,
    date: str, time: str, phone: str = "", notes: str = "",
) -> dict:
    """Book a table. Returns the reservation or an error message."""
    # Prevent duplicates: same guest, date, time, agent
    for r in _reservations.values():
        if (r.agent_id == agent.id and r.status == "confirmed"
                and r.guest_name.lower() == guest_name.lower()
                and r.date == date and r.time == time):
            return {"ok": True, "reservation": r}

    available, reason = check_availability(agent, date, time, party_size)
    if not available:
        return {"ok": False, "error": reason}

    res = Reservation(
        agent_id=agent.id,
        guest_name=guest_name,
        party_size=party_size,
        date=date,
        time=time,
        phone=phone,
        notes=notes,
    )
    _reservations[res.id] = res
    return {"ok": True, "reservation": res}


def find_reservations(agent_id: str, guest_name: str) -> list[Reservation]:
    """Find all reservations for a guest by name (case-insensitive partial match)."""
    name_lower = guest_name.lower()
    return [
        r for r in _reservations.values()
        if r.agent_id == agent_id
        and r.status == "confirmed"
        and name_lower in r.guest_name.lower()
    ]


def get_reservation(reservation_id: str) -> Reservation | None:
    return _reservations.get(reservation_id)


def update_reservation(reservation_id: str, updates: dict) -> dict:
    """Update a reservation's fields. Returns the updated reservation or error."""
    res = _reservations.get(reservation_id)
    if not res:
        return {"ok": False, "error": "Reservation not found."}
    if res.status == "cancelled":
        return {"ok": False, "error": "This reservation was already cancelled."}

    for key, value in updates.items():
        if value is not None and hasattr(res, key):
            setattr(res, key, value)

    return {"ok": True, "reservation": res}


def cancel_reservation(reservation_id: str) -> dict:
    res = _reservations.get(reservation_id)
    if not res:
        return {"ok": False, "error": "Reservation not found."}
    res.status = "cancelled"
    return {"ok": True, "message": f"Reservation for {res.guest_name} on {res.date} at {res.time} has been cancelled."}


def check_availability(agent: Agent, date: str, time: str, party_size: int) -> tuple[bool, str]:
    """Check if enough seats are free at the requested date/time."""
    if party_size > agent.max_party_size:
        return False, f"Sorry, we can only accommodate groups up to {agent.max_party_size}."

    if party_size < 1:
        return False, "Party size must be at least 1."

    try:
        req_start = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
    except ValueError:
        return False, "Invalid date or time format. Use YYYY-MM-DD and HH:MM."

    req_end = req_start + timedelta(minutes=agent.avg_eating_minutes)

    # Count seats in use during the requested window
    seats_in_use = 0
    for r in _reservations.values():
        if r.agent_id != agent.id or r.status != "confirmed" or r.date != date:
            continue
        try:
            r_start = datetime.strptime(f"{r.date} {r.time}", "%Y-%m-%d %H:%M")
        except ValueError:
            continue
        r_end = r_start + timedelta(minutes=agent.avg_eating_minutes)

        # Two reservations overlap if one starts before the other ends
        if req_start < r_end and r_start < req_end:
            seats_in_use += r.party_size

    available_seats = agent.total_seats - seats_in_use
    if party_size > available_seats:
        return False, f"Only {available_seats} seats available at {time} on {date}. Need {party_size}."

    return True, f"{available_seats} seats available."


def list_reservations(agent_id: str, date: str | None = None) -> list[Reservation]:
    """List all confirmed reservations, optionally filtered by date."""
    results = [
        r for r in _reservations.values()
        if r.agent_id == agent_id and r.status == "confirmed"
    ]
    if date:
        results = [r for r in results if r.date == date]
    return sorted(results, key=lambda r: (r.date, r.time))
