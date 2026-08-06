# Swara — Code Review Cheat Sheet (5-Minute Prep)

> Open this during your review. It tells you exactly which file to open and what to say.

---

## THE 5 FILES THAT MATTER MOST

Open these in VS Code tabs before the review starts:

| # | File | What it is | Open it for |
|---|------|-----------|-------------|
| 1 | `backend/app/services/agent_service.py` | THE BRAIN — LLM + function calling | When she asks "how does the AI work?" |
| 2 | `backend/app/services/reservation_service.py` | Booking logic — availability, CRUD | When she asks "how do reservations work?" |
| 3 | `backend/app/routers/agents.py` | All API endpoints | When she asks "where are the APIs?" |
| 4 | `frontend/src/pages/Chat.jsx` | Chat + voice call UI | When she asks "how does voice work?" |
| 5 | `backend/app/models/agent.py` | Database schema | When she asks "what's the schema?" |

---

## DEMO FLOW — BUTTON BY BUTTON

### Step 1: Login
- **You click:** "Log in" on navbar
- **Frontend file:** `pages/Login.jsx` (line 22)
- **API called:** `POST /api/auth/login` with `{email, password}`
- **Backend file:** `routers/auth.py` (line 17)
- **What happens:** Checks email/password against `.env` values. Returns `{ok: true}`.
- **Storage:** `localStorage.setItem("swara_logged_in", "true")`

### Step 2: Create Agent
- **You click:** "Get Started" → fill 4 steps → "Launch Agent"
- **Frontend file:** `pages/GetStarted.jsx` (line 49 — `handleCreate()`)
- **API called:** `POST /api/agents` with all form data
- **Backend file:** `routers/agents.py` (line 15) → `agent_service.create_agent()`
- **What happens:** Creates Agent object with UUID, stores in SQLite (`agents` table)
- **Database file:** `db/database.py` — the INSERT happens in `agent_service.py` line ~200
- **Returns:** Full agent JSON with `id` → frontend shows embed code

### Step 3: Paste embed in restaurant
- **You do:** Copy the full `<script>` line → paste into `demo-restaurant/index.html`
- **How it works:** The backup inline script reads `data-agent` and `data-host` from your pasted line, creates a blue button, opens a popup to `/chat/{agentId}?embed=true`

### Step 4: Customer chats (the reservation flow)
- **Customer says:** "Book a table for 4 tomorrow at 7pm, name Mohit"
- **Frontend file:** `pages/Chat.jsx` — `sendMessage()` (line 48) or `doSendAndSpeak()` (line 140)
- **API called:** `POST /api/agents/{id}/chat` with `{message: "Book a table..."}`
- **Backend file:** `routers/agents.py` (line 34) → `agent_service.generate_reply()`

**Inside `generate_reply()` (agent_service.py line ~240):**
```
1. User message added to _history
2. System prompt built (_build_system_prompt) with:
   - Current date/time
   - Business info (hours, menu, prices)
   - Capacity (30 seats, 75min meals)
   - Booking rules
3. Sent to Groq API with 5 tool definitions
4. Groq returns: "I want to call check_availability"
5. We execute check_availability() in reservation_service.py
   → Checks time window overlaps → "26 seats available"
6. Result sent back to Groq
7. Groq returns: "I want to call create_reservation"
8. We execute create_reservation() in reservation_service.py
   → Validates name not empty
   → Deduplication check
   → INSERT into SQLite reservations table
9. Result sent back to Groq
10. Groq returns: "Your table is booked, Mohit!"
11. That text goes back to frontend → displayed in chat
```

### Step 5: Voice call
- **Customer clicks:** Green phone button
- **Frontend file:** `Chat.jsx` — `toggleCall()` (line 55) → `startCallRecognition()` (line 72)
- **How STT works:** `window.SpeechRecognition` (line 73) — browser built-in, no external API
- **How TTS works:** `window.speechSynthesis.speak()` (line 168) — browser built-in
- **Voice selected:** Microsoft Zira (female, US English) — preloaded in `voiceRef` (line 35)

### Step 6: Admin sees reservations
- **You open:** `/admin/{agentId}`
- **Frontend file:** `pages/Admin.jsx` (line 20 — `fetchReservations()`)
- **API called:** `GET /api/agents/{id}/reservations`
- **Backend file:** `routers/agents.py` (line 53) → `reservation_service.list_reservations()`
- **What happens:** SQL query: `SELECT * FROM reservations WHERE agent_id=? AND status='confirmed'`

---

## WHEN SEATS ARE FULL (Conflict Handling)

**Code location:** `reservation_service.py` → `check_availability()` (around line 95)

**How it works:**
```python
# 1. Parse requested time window
req_start = 19:00
req_end = 19:00 + 75min = 20:15

# 2. Query all confirmed reservations on that date from SQLite
SELECT party_size, time FROM reservations WHERE agent_id=? AND date=? AND status='confirmed'

# 3. For each existing reservation, check if time windows overlap
# Overlap formula: request_start < existing_end AND existing_start < request_end

# 4. Sum overlapping party sizes
seats_in_use = 20 (from previous booking)

# 5. Compare
available = 30 - 20 = 10
requested = 4
10 >= 4 → OK! (or if 25 requested → FAIL)

# 6. If full → suggest next slot (_find_next_available)
# Checks every 30 min for next 3.5 hours
```

**What the customer hears:** "Sorry, only 10 seats available at 7pm. Next available slot for 25 people: 8:30pm."

---

## DATABASE SCHEMA

**File:** `backend/app/models/agent.py` (line 21 and line 36)
**Actual DB:** `backend/swara.db` (SQLite file)
**Table creation:** `backend/app/db/database.py` (line 22)

### agents table
| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT | **PRIMARY KEY** (UUID) |
| `business_name` | TEXT | |
| `business_type` | TEXT | |
| `greeting` | TEXT | First thing agent says |
| `instructions` | TEXT | Everything the AI knows |
| `total_seats` | INTEGER | For availability calc |
| `avg_eating_minutes` | INTEGER | Time window per booking |
| `max_party_size` | INTEGER | Largest group allowed |
| `reservations_enabled` | INTEGER | 1=on, 0=off |
| `created_at` | TEXT | ISO timestamp |

### reservations table
| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT | **PRIMARY KEY** (UUID) |
| `agent_id` | TEXT | **FOREIGN KEY** → agents.id |
| `guest_name` | TEXT | Cannot be empty |
| `party_size` | INTEGER | |
| `date` | TEXT | "2026-08-10" |
| `time` | TEXT | "19:00" |
| `phone` | TEXT | Optional |
| `notes` | TEXT | Optional |
| `status` | TEXT | "confirmed" or "cancelled" |
| `created_at` | TEXT | ISO timestamp |

**Deduplication constraint (in code):** Same agent + guest_name + date + time → returns existing instead of creating duplicate.

**How to find this in code:**
- Schema definition: `backend/app/models/agent.py` (Pydantic classes)
- Table creation SQL: `backend/app/db/database.py` (line 22 — CREATE TABLE IF NOT EXISTS)
- Data stored: `backend/swara.db` (the actual SQLite file)

---

## ALL 10 API ENDPOINTS (quick reference)

| Method | URL | Purpose | File:Line |
|--------|-----|---------|-----------|
| POST | `/api/auth/login` | Login | `auth.py:17` |
| POST | `/api/agents` | Create agent | `agents.py:15` |
| GET | `/api/agents` | List agents | `agents.py:20` |
| GET | `/api/agents/{id}` | Get one | `agents.py:26` |
| POST | `/api/agents/{id}/chat` | Chat with AI | `agents.py:34` |
| POST | `/api/agents/{id}/reset` | Clear history | `agents.py:43` |
| GET | `/api/agents/{id}/reservations` | List bookings | `agents.py:53` |
| PATCH | `/api/agents/{id}/reservations/{rid}` | Update booking | `agents.py:62` |
| DELETE | `/api/agents/{id}/reservations/{rid}` | Cancel booking | `agents.py:71` |
| GET | `/api/health` | Server alive | `health.py:7` |

---

## LLM SETTINGS (agent_service.py line 21-24)

```python
TEMPERATURE = 0.7       # 0=robotic, 0.7=natural conversation, 1.5=random
TOP_P = 0.9             # Only use top 90% likely words (ignores weird stuff)
MAX_TOKENS = 200        # ~150 words max reply (phone-call brief)
FREQUENCY_PENALTY = 0.3 # Don't repeat same phrases
```

**Why these?** Voice agent needs to sound natural (0.7), stay focused (0.9), be brief (200 tokens), and not be repetitive (0.3).

---

## QUICK ANSWERS TO LIKELY QUESTIONS

**"Where's the database?"**
→ `backend/swara.db` (SQLite file). Schema in `backend/app/db/database.py`. Models in `backend/app/models/agent.py`.

**"How does the AI know about the restaurant?"**
→ The `instructions` field. Whatever the owner typed in step 2 gets injected into the system prompt every time. See `_build_system_prompt()` in `agent_service.py`.

**"What if two people book the same slot?"**
→ `check_availability()` in `reservation_service.py` calculates time window overlaps and sums party sizes. If seats_in_use + new_request > total_seats → rejected with suggestion.

**"What's function calling?"**
→ The LLM doesn't just generate text. We give it 5 tool definitions (check_availability, create_reservation, etc.). It autonomously decides WHEN to call them based on the conversation. See `TOOLS` array in `agent_service.py` line 27.

**"How does voice work?"**
→ All browser-native. `window.SpeechRecognition` for mic→text (STT), `window.speechSynthesis` for text→speaker (TTS). Both in `Chat.jsx`. No external APIs.

**"Why SQLite not Postgres?"**
→ Zero setup for prototype. Same SQL, same schema. Upgrade = change one connection string.

**"Why popup not iframe for the widget?"**
→ Chrome blocks microphone access in cross-origin iframes. Popup gets its own permissions.

**"What happens if the server restarts?"**
→ Agents and reservations persist (SQLite). Conversation history resets (in-memory — that's fine, each call is independent).
