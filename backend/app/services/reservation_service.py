"""
Reservation service — manages bookings in memory.

Handles create / find / update / cancel + time-based availability checks.
"""

from datetime import datetime, timedelta

from app.models.agent import Agent, Reservation

# This dict IS our database. Key = reservation UUID (primary key), value = Reservation object.
_reservations: dict[str, Reservation] = {}


# Create a new reservation. First checks for duplicates, then checks seat availability.
def create_reservation(
    agent: Agent, guest_name: str, party_size: int,
    date: str, time: str, phone: str = "", notes: str = "",
) -> dict:
    """Book a table. Returns the reservation or an error message."""
    # DEDUPLICATION: acts as UNIQUE constraint on (agent_id, guest_name, date, time)
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


# Look up reservations by guest name. Used when customer says "I'm Mohit, change my booking".
# Returns all matches — if multiple, the LLM asks the customer to clarify.
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


# Update specific fields of a reservation (found by UUID primary key).
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


# Soft-delete: sets status to "cancelled" (record stays, just hidden from listings).
def cancel_reservation(reservation_id: str) -> dict:
    res = _reservations.get(reservation_id)
    if not res:
        return {"ok": False, "error": "Reservation not found."}
    res.status = "cancelled"
    return {"ok": True, "message": f"Reservation for {res.guest_name} on {res.date} at {res.time} has been cancelled."}


# AVAILABILITY ALGORITHM: checks if enough seats are free at the requested time.
# Calculates time window (start + avg_eating_minutes), finds overlapping bookings,
# sums their party sizes, and compares against total_seats.
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
        # Suggest next available slot (check every 30 min for the next 3 hours)
        suggestion = _find_next_available(agent, date, req_start, party_size)
        msg = f"Only {available_seats} seats available at {time} on {date}."
        if suggestion:
            msg += f" Next available slot for {party_size}: {suggestion}."
        return False, msg

    return True, f"{available_seats} seats available."


def _find_next_available(agent: Agent, date: str, after: datetime, party_size: int) -> str | None:
    """Find the next 30-min slot on the same date that has enough seats."""
    for offset in range(30, 210, 30):  # check +30min to +3.5hrs
        candidate = after + timedelta(minutes=offset)
        candidate_end = candidate + timedelta(minutes=agent.avg_eating_minutes)

        seats_in_use = 0
        for r in _reservations.values():
            if r.agent_id != agent.id or r.status != "confirmed" or r.date != date:
                continue
            try:
                r_start = datetime.strptime(f"{r.date} {r.time}", "%Y-%m-%d %H:%M")
            except ValueError:
                continue
            r_end = r_start + timedelta(minutes=agent.avg_eating_minutes)
            if candidate < r_end and r_start < candidate_end:
                seats_in_use += r.party_size

        if party_size <= (agent.total_seats - seats_in_use):
            return candidate.strftime("%H:%M")
    return None


def list_reservations(agent_id: str, date: str | None = None) -> list[Reservation]:
    """List all confirmed reservations, optionally filtered by date."""
    results = [
        r for r in _reservations.values()
        if r.agent_id == agent_id and r.status == "confirmed"
    ]
    if date:
        results = [r for r in results if r.date == date]
    return sorted(results, key=lambda r: (r.date, r.time))
