"""
Reservation service — manages bookings in SQLite (persistent).
Handles create / find / update / cancel + time-based availability checks.
"""

from datetime import datetime, timedelta

from app.models.agent import Agent, Reservation
from app.db.database import _get_conn


def _row_to_reservation(row) -> Reservation:
    return Reservation(
        id=row["id"],
        agent_id=row["agent_id"],
        guest_name=row["guest_name"],
        party_size=row["party_size"],
        date=row["date"],
        time=row["time"],
        phone=row["phone"],
        notes=row["notes"],
        status=row["status"],
        created_at=datetime.fromisoformat(row["created_at"]),
    )


def create_reservation(
    agent: Agent, guest_name: str, party_size: int,
    date: str, time: str, phone: str = "", notes: str = "",
) -> dict:
    """Book a table. Returns the reservation or an error message."""
    if not guest_name or guest_name.lower() in ("none", "null", "unknown", ""):
        return {"ok": False, "error": "Guest name is required to make a reservation."}

    # Deduplication check
    conn = _get_conn()
    existing = conn.execute(
        "SELECT * FROM reservations WHERE agent_id=? AND status='confirmed' AND LOWER(guest_name)=LOWER(?) AND date=? AND time=?",
        (agent.id, guest_name, date, time)
    ).fetchone()
    if existing:
        conn.close()
        return {"ok": True, "reservation": _row_to_reservation(existing)}

    available, reason = check_availability(agent, date, time, party_size)
    if not available:
        conn.close()
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
    conn.execute(
        "INSERT INTO reservations (id, agent_id, guest_name, party_size, date, time, phone, notes, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (res.id, res.agent_id, res.guest_name, res.party_size, res.date, res.time, res.phone, res.notes, res.status, res.created_at.isoformat())
    )
    conn.commit()
    conn.close()
    return {"ok": True, "reservation": res}


def find_reservations(agent_id: str, guest_name: str) -> list[Reservation]:
    """Find reservations by guest name (case-insensitive partial match)."""
    conn = _get_conn()
    rows = conn.execute(
        "SELECT * FROM reservations WHERE agent_id=? AND status='confirmed' AND LOWER(guest_name) LIKE ?",
        (agent_id, f"%{guest_name.lower()}%")
    ).fetchall()
    conn.close()
    return [_row_to_reservation(r) for r in rows]


def get_reservation(reservation_id: str) -> Reservation | None:
    conn = _get_conn()
    row = conn.execute("SELECT * FROM reservations WHERE id=?", (reservation_id,)).fetchone()
    conn.close()
    return _row_to_reservation(row) if row else None


def update_reservation(reservation_id: str, updates: dict) -> dict:
    """Update a reservation's fields."""
    conn = _get_conn()
    row = conn.execute("SELECT * FROM reservations WHERE id=?", (reservation_id,)).fetchone()
    if not row:
        conn.close()
        return {"ok": False, "error": "Reservation not found."}
    if row["status"] == "cancelled":
        conn.close()
        return {"ok": False, "error": "This reservation was already cancelled."}

    # Build SET clause from provided updates
    valid_fields = ("guest_name", "party_size", "date", "time", "phone", "notes")
    sets = []
    values = []
    for key, value in updates.items():
        if key in valid_fields and value is not None:
            sets.append(f"{key}=?")
            values.append(value)
    if sets:
        values.append(reservation_id)
        conn.execute(f"UPDATE reservations SET {', '.join(sets)} WHERE id=?", values)
        conn.commit()

    # Re-fetch updated row
    updated = conn.execute("SELECT * FROM reservations WHERE id=?", (reservation_id,)).fetchone()
    conn.close()
    return {"ok": True, "reservation": _row_to_reservation(updated)}


def cancel_reservation(reservation_id: str) -> dict:
    conn = _get_conn()
    row = conn.execute("SELECT * FROM reservations WHERE id=?", (reservation_id,)).fetchone()
    if not row:
        conn.close()
        return {"ok": False, "error": "Reservation not found."}
    conn.execute("UPDATE reservations SET status='cancelled' WHERE id=?", (reservation_id,))
    conn.commit()
    conn.close()
    return {"ok": True, "message": f"Reservation for {row['guest_name']} on {row['date']} at {row['time']} has been cancelled."}


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

    conn = _get_conn()
    rows = conn.execute(
        "SELECT party_size, time FROM reservations WHERE agent_id=? AND status='confirmed' AND date=?",
        (agent.id, date)
    ).fetchall()
    conn.close()

    seats_in_use = 0
    for r in rows:
        try:
            r_start = datetime.strptime(f"{date} {r['time']}", "%Y-%m-%d %H:%M")
        except ValueError:
            continue
        r_end = r_start + timedelta(minutes=agent.avg_eating_minutes)
        if req_start < r_end and r_start < req_end:
            seats_in_use += r["party_size"]

    available_seats = agent.total_seats - seats_in_use
    if party_size > available_seats:
        suggestion = _find_next_available(agent, date, req_start, party_size)
        msg = f"Only {available_seats} seats available at {time} on {date}."
        if suggestion:
            msg += f" Next available slot for {party_size}: {suggestion}."
        return False, msg

    return True, f"{available_seats} seats available."


def _find_next_available(agent: Agent, date: str, after: datetime, party_size: int) -> str | None:
    """Find the next 30-min slot that has enough seats."""
    conn = _get_conn()
    rows = conn.execute(
        "SELECT party_size, time FROM reservations WHERE agent_id=? AND status='confirmed' AND date=?",
        (agent.id, date)
    ).fetchall()
    conn.close()

    for offset in range(30, 210, 30):
        candidate = after + timedelta(minutes=offset)
        candidate_end = candidate + timedelta(minutes=agent.avg_eating_minutes)
        seats_in_use = 0
        for r in rows:
            try:
                r_start = datetime.strptime(f"{date} {r['time']}", "%Y-%m-%d %H:%M")
            except ValueError:
                continue
            r_end = r_start + timedelta(minutes=agent.avg_eating_minutes)
            if candidate < r_end and r_start < candidate_end:
                seats_in_use += r["party_size"]
        if party_size <= (agent.total_seats - seats_in_use):
            return candidate.strftime("%H:%M")
    return None


def list_reservations(agent_id: str, date: str | None = None) -> list[Reservation]:
    """List all confirmed reservations, optionally filtered by date."""
    conn = _get_conn()
    if date:
        rows = conn.execute(
            "SELECT * FROM reservations WHERE agent_id=? AND status='confirmed' AND date=? ORDER BY date, time",
            (agent_id, date)
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT * FROM reservations WHERE agent_id=? AND status='confirmed' ORDER BY date, time",
            (agent_id,)
        ).fetchall()
    conn.close()
    return [_row_to_reservation(r) for r in rows]