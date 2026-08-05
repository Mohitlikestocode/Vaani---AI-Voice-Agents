# Swara — API Reference (Complete)

## Base URL
```
http://localhost:8001/api
```

All endpoints are prefixed with `/api`. This is set in `backend/app/core/config.py`.

---

## HTTP Methods Explained (for the beginner)

| Method | Meaning | Analogy |
|--------|---------|---------|
| `GET` | Read/fetch data | "Show me" — doesn't change anything |
| `POST` | Create something new | "Make this for me" — creates a new record |
| `PATCH` | Update part of something | "Change this one field" — partial update |
| `DELETE` | Remove something | "Cancel/remove this" |

---

## Authentication

### POST `/api/auth/login`

**What it does:** Checks if the email/password match the admin credentials in `.env`.

**File:** `backend/app/routers/auth.py`

**Request body:**
```json
{
  "email": "admin@swara.com",
  "password": "swara123"
}
```

**Success response (200):**
```json
{
  "ok": true,
  "email": "admin@swara.com"
}
```

**Error response (401):**
```json
{
  "detail": "Wrong email or password"
}
```

**Where is this called from frontend?**
- `frontend/src/pages/Login.jsx` — the login form's `handleSubmit` function
- Uses `fetch(API + "/api/auth/login", { method: "POST", ... })`
- On success: saves `swara_logged_in` and `swara_email` to `localStorage`, navigates to `/dashboard`

---

## Agent Endpoints

### POST `/api/agents`

**What it does:** Creates a new AI agent for a business.

**File:** `backend/app/routers/agents.py` → calls `agent_service.create_agent()`

**Request body (all fields):**
```json
{
  "business_name": "My Odyssey",
  "business_type": "Restaurant",
  "greeting": "Hello! Welcome to My Odyssey.",
  "instructions": "Open Mon-Sat 12-11pm. Risotto Rs 550...",
  "total_seats": 30,
  "avg_eating_minutes": 75,
  "max_party_size": 20,
  "reservations_enabled": true
}
```

**Response (200):**
```json
{
  "id": "7688505d-192e-470a-b8ca-14eb841e95b0",
  "owner_id": "",
  "business_name": "My Odyssey",
  "business_type": "Restaurant",
  "greeting": "Hello! Welcome to My Odyssey.",
  "instructions": "...",
  "total_seats": 30,
  "avg_eating_minutes": 75,
  "max_party_size": 20,
  "reservations_enabled": true,
  "created_at": "2026-08-05T10:30:00.000Z"
}
```

**Where called from frontend?**
- `frontend/src/pages/GetStarted.jsx` → `handleCreate()` function
- After success: shows embed code + links to chat/admin

**What happens in the backend?**
1. `create_agent()` in `agent_service.py` creates an `Agent` Pydantic model
2. Generates a UUID for the `id` field
3. Stores it in `_agents[agent.id]` (Python dictionary)
4. Initializes empty conversation history `_history[agent.id] = []`

---

### GET `/api/agents`

**What it does:** Returns all agents (used by the dashboard).

**File:** `backend/app/routers/agents.py` → calls `agent_service.list_agents()`

**Response:** Array of Agent objects, sorted newest first.

**Where called from frontend?**
- `frontend/src/pages/Dashboard.jsx` → `useEffect` on page load

---

### GET `/api/agents/{agent_id}`

**What it does:** Get one agent by ID.

**File:** `backend/app/routers/agents.py`

**Response:** Single Agent object.

**Error (404):**
```json
{ "detail": "Agent not found" }
```

**Where called from frontend?**
- `frontend/src/pages/Chat.jsx` → `useEffect` on mount (to get greeting + business name)
- `frontend/src/pages/Admin.jsx` → `fetchAgent()` on mount

---

### POST `/api/agents/{agent_id}/chat`

**What it does:** The core endpoint. Sends a user message to the AI and gets a reply. The AI may call tools (book reservations, check availability) behind the scenes.

**File:** `backend/app/routers/agents.py` → calls `agent_service.generate_reply()`

**Request body:**
```json
{
  "message": "Book a table for 4 people tomorrow at 7pm, name Mohit"
}
```

**Response:**
```json
{
  "reply": "Your table is booked for 4 people at 7pm tomorrow. See you then, Mohit!"
}
```

**Error (404):** Agent not found.
**Error (500):** Groq API failure or tool execution error.

**Where called from frontend?**
- `frontend/src/pages/Chat.jsx` → `sendMessage()` for typed messages
- `frontend/src/pages/Chat.jsx` → `doSendAndSpeak()` for voice call messages

**What happens internally (step by step):**
1. User message added to `_history[agent_id]`
2. System prompt built with current date/time + business info + booking rules
3. Full message list assembled: `[system_prompt, ...history]`
4. Sent to Groq API with tool definitions
5. If Groq returns `tool_calls`:
   - Execute each tool (e.g., `check_availability`, `create_reservation`)
   - Send results back to Groq
   - Loop (up to 5 times) until Groq returns plain text
6. If Groq returns text with raw `<function=...>` (model bug):
   - Parse it, execute the tool, re-prompt Groq with the result
7. Final text reply returned to frontend

---

### POST `/api/agents/{agent_id}/reset`

**What it does:** Clears conversation history for this agent. Used when starting a fresh call (new customer).

**File:** `backend/app/routers/agents.py`

**Response:**
```json
{ "ok": true }
```

**Where called from frontend?**
- `frontend/src/pages/Chat.jsx` → inside `toggleCall()` when starting a new conversation

---

## Reservation Endpoints (Admin)

### GET `/api/agents/{agent_id}/reservations`

**What it does:** Returns all confirmed reservations for an agent. Optionally filter by date.

**File:** `backend/app/routers/agents.py` → calls `reservation_service.list_reservations()`

**Query parameters:**
- `date` (optional) — filter by date, e.g. `?date=2026-08-10`

**Response:**
```json
[
  {
    "id": "abc123",
    "agent_id": "7688505d...",
    "guest_name": "Mohit",
    "party_size": 4,
    "date": "2026-08-10",
    "time": "19:00",
    "phone": "",
    "notes": "",
    "status": "confirmed",
    "created_at": "2026-08-05T10:35:00.000Z"
  }
]
```

**Where called from frontend?**
- `frontend/src/pages/Admin.jsx` → `fetchReservations()` on mount + when date filter changes

---

### PATCH `/api/agents/{agent_id}/reservations/{reservation_id}`

**What it does:** Admin manually updates a reservation (change date, time, party size, etc.).

**File:** `backend/app/routers/agents.py` → calls `reservation_service.update_reservation()`

**Request body (only send fields you want to change):**
```json
{
  "date": "2026-08-12",
  "time": "20:00"
}
```

**Response:** Updated Reservation object.

**Error (400):** `{ "detail": "Reservation not found." }` or `"already cancelled"`

---

### DELETE `/api/agents/{agent_id}/reservations/{reservation_id}`

**What it does:** Cancel a reservation (sets status to "cancelled").

**File:** `backend/app/routers/agents.py` → calls `reservation_service.cancel_reservation()`

**Response:**
```json
{
  "ok": true,
  "message": "Reservation for Mohit on 2026-08-10 at 19:00 has been cancelled."
}
```

**Where called from frontend?**
- `frontend/src/pages/Admin.jsx` → `cancelReservation(resId)` when admin clicks the delete button

---

## Health Check

### GET `/api/health`

**What it does:** Simple check that the server is running.

**File:** `backend/app/routers/health.py`

**Response:**
```json
{ "status": "ok" }
```

---

## Status Codes Summary

| Code | Meaning | When it happens |
|------|---------|-----------------|
| 200 | Success | Normal response |
| 400 | Bad Request | Invalid reservation update (already cancelled, etc.) |
| 401 | Unauthorized | Wrong login credentials |
| 404 | Not Found | Agent ID doesn't exist |
| 500 | Server Error | Groq API failure, tool execution crash |

---

## How Frontend Calls APIs

Every API call in the frontend uses the native `fetch()` function:

```javascript
// Pattern used everywhere:
const res = await fetch(`${API}/api/agents/${agentId}/chat`, {
  method: "POST",                              // HTTP method
  headers: { "Content-Type": "application/json" },  // tells backend it's JSON
  body: JSON.stringify({ message: text }),      // the data being sent
});
const data = await res.json();  // parse the JSON response
```

- `API` = `process.env.REACT_APP_BACKEND_URL` (from frontend `.env`) or defaults to `http://localhost:8001`
- `await` = wait for the network request to complete before continuing
- `res.json()` = parse the response body from JSON text to a JavaScript object

---

## Request/Response Lifecycle

```
Browser (React)                              Server (FastAPI)
     |                                            |
     |--- POST /api/agents/{id}/chat ------------>|
     |    Headers: Content-Type: application/json |
     |    Body: {"message": "Book for 4"}         |
     |                                            |
     |                                     [generate_reply() runs]
     |                                     [calls Groq API]
     |                                     [executes tools if needed]
     |                                            |
     |<--- 200 OK -------------------------------|
     |     Body: {"reply": "Booked!"}             |
     |                                            |
[display reply in chat]
[speak it aloud if voice enabled]
```
