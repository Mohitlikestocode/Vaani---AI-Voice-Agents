# Swara — Complete Workflow Reference (The Only Doc You Need)

> Read this before your code review. Every process, every API call, every file — traced from the user's click to the database and back.

---

## TABLE OF CONTENTS
1. [Process 1: Login](#process-1-login)
2. [Process 2: Creating an Agent (Get Started)](#process-2-creating-an-agent)
3. [Process 3: Customer Sends a Chat Message](#process-3-customer-sends-a-chat-message)
4. [Process 4: Making a Reservation via Chat](#process-4-making-a-reservation-via-chat)
5. [Process 5: Changing a Reservation via Chat](#process-5-changing-a-reservation-via-chat)
6. [Process 6: Cancelling a Reservation via Chat](#process-6-cancelling-a-reservation-via-chat)
7. [Process 7: Voice Call Flow](#process-7-voice-call-flow)
8. [Process 8: Admin Viewing Reservations](#process-8-admin-viewing-reservations)
9. [Process 9: Admin Cancelling a Reservation](#process-9-admin-cancelling-a-reservation)
10. [Process 10: Widget on Restaurant Website](#process-10-widget-on-restaurant-website)
11. [Complete API Map](#complete-api-map)
12. [Database Schema](#database-schema)
13. [Where Every API is Defined and Called](#where-every-api-is-defined-and-called)

---

## PROCESS 1: LOGIN

### What the user sees
Email + password form at `/login`.

### Step-by-step trace

```
1. User opens http://localhost:3001/login
   → React Router (App.js line 14) maps "/login" to Login.jsx

2. User types email: admin@swara.com, password: swara123

3. User clicks "Log in"
   → Login.jsx → handleSubmit() (line 18)
   → Calls: fetch("http://localhost:8001/api/auth/login", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ email: "admin@swara.com", password: "swara123" })
     })

4. Network request travels to backend
   → FastAPI receives POST /api/auth/login
   → Routed to: backend/app/routers/auth.py → login() function (line 17)
   → Checks: data.email == settings.admin_email AND data.password == settings.admin_password
   → settings loaded from: backend/app/core/config.py (line 16-17)
   → Which reads from: backend/.env (ADMIN_EMAIL, ADMIN_PASSWORD)

5a. If match → returns { "ok": true, "email": "admin@swara.com" } with status 200
5b. If no match → raises HTTPException(status_code=401, detail="Wrong email or password")

6. Back in frontend Login.jsx (line 30):
   → If success: saves to localStorage:
     - localStorage.setItem("swara_logged_in", "true")
     - localStorage.setItem("swara_email", "admin@swara.com")
   → Calls navigate("/dashboard") → page changes to Dashboard

7. If error: setError(data.detail) → red error box appears on screen
```

### Files involved
| File | What it does |
|------|-------------|
| `frontend/src/pages/Login.jsx` | The form UI + fetch call |
| `backend/app/routers/auth.py` | The API endpoint |
| `backend/app/core/config.py` | Loads admin credentials from .env |
| `backend/.env` | Stores ADMIN_EMAIL and ADMIN_PASSWORD |

---

## PROCESS 2: CREATING AN AGENT

### What the user sees
4-step wizard at `/get-started`.

### Step-by-step trace

```
1. User clicks "Get Started" on landing page
   → Navbar.jsx has: <a href="/get-started">
   → React Router maps to GetStarted.jsx

2. GUARD CHECK (GetStarted.jsx line 23):
   → useEffect checks localStorage.getItem("swara_logged_in")
   → If not "true" → navigate("/login") → kicked to login page
   → If "true" → continue showing the form

3. User fills 4 steps:
   Step 1: business_name + business_type → stored in form state
   Step 2: instructions (what the agent knows) → stored in form.instructions
   Step 3: total_seats, avg_eating_minutes, max_party_size → stored in form state
   Step 4: greeting message → stored in form.greeting

4. User clicks "Launch Agent"
   → GetStarted.jsx → handleCreate() (line 47)
   → Calls: fetch("http://localhost:8001/api/agents", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         business_name: "My Odyssey",
         business_type: "Restaurant",
         greeting: "Hello! Welcome to My Odyssey.",
         instructions: "Open Mon-Sat 12-11pm...",
         total_seats: 30,
         avg_eating_minutes: 75,
         max_party_size: 20,
         reservations_enabled: true
       })
     })

5. Network request travels to backend
   → FastAPI receives POST /api/agents
   → Routed to: backend/app/routers/agents.py → create_new_agent() (line 15)
   → Calls: agent_service.create_agent(data)
   → In backend/app/services/agent_service.py → create_agent() (line 196):
     a. Creates Agent Pydantic object (schema from backend/app/models/agent.py line 21)
     b. UUID auto-generated: id = str(uuid.uuid4()) → e.g. "7688505d-192e-470a-..."
     c. Stored in memory: _agents["7688505d-..."] = agent  (the Python dict IS our database)
     d. Empty history initialized: _history["7688505d-..."] = []
     e. Returns the Agent object as JSON

6. Response arrives back at frontend (GetStarted.jsx line 53):
   → const agent = await res.json()
   → setCreatedAgent(agent) → triggers re-render
   → All 4 step forms hide (because !createdAgent becomes false)
   → Success screen shows with:
     - Embed code: <script src=".../swara-widget.js" data-agent="7688505d-...">
     - Copy button (uses navigator.clipboard.writeText)
     - "Test your agent" link → /chat/7688505d-...?admin=true
     - "View admin dashboard" link → /admin/7688505d-...
```

### Files involved
| File | What it does |
|------|-------------|
| `frontend/src/pages/GetStarted.jsx` | 4-step form + success screen |
| `frontend/src/components/Swara/Navbar.jsx` | "Get Started" button link |
| `backend/app/routers/agents.py` | POST /api/agents endpoint (line 15) |
| `backend/app/services/agent_service.py` | create_agent() function (line 196) |
| `backend/app/models/agent.py` | AgentCreate schema (line 8) + Agent schema (line 21) |

---

## PROCESS 3: CUSTOMER SENDS A CHAT MESSAGE

### What the user sees
Chat interface at `/chat/:agentId`. Types a message, gets a reply.

### Step-by-step trace

```
1. Page loads → Chat.jsx useEffect (line 27):
   → fetch("http://localhost:8001/api/agents/7688505d-...")
   → API: GET /api/agents/{agent_id}
   → Backend: routers/agents.py → get_one_agent() (line 26)
   → Returns agent JSON (business_name, greeting, etc.)
   → Frontend sets: messages = [{ role: "agent", text: "Hello! Welcome..." }]

2. User types "What are your hours?" and clicks Send
   → Chat.jsx → sendMessage() (line 44) → calls doSend(text) internally
   
   BUT WAIT — for voice calls, it goes through doSendAndSpeak() (line 139).
   For typed messages, it's the simpler sendMessage() → which also calls the same API.

3. Frontend sends:
   → fetch("http://localhost:8001/api/agents/7688505d-.../chat", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ message: "What are your hours?" })
     })

4. Backend receives POST /api/agents/{agent_id}/chat
   → routers/agents.py → chat_with_agent() (line 34)
   → Calls: agent_service.generate_reply(agent, "What are your hours?")

5. Inside generate_reply() (agent_service.py line 222):
   a. Adds user message to _history[agent_id]
   b. Builds system prompt with _build_system_prompt(agent):
      - Current date and time (for relative date handling)
      - Business info (from agent.instructions)
      - Capacity info
      - Booking rules
      - General behavior rules
   c. Assembles messages = [system_prompt, ...history]
   d. Calls Groq API:
      groq.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        tools=TOOLS,           ← 5 function definitions
        temperature=0.7,       ← natural conversation
        top_p=0.9,             ← focused word choices
        max_tokens=200,        ← short replies
        frequency_penalty=0.3  ← no repetition
      )

6. Groq processes and returns a response:
   → For a simple question like "hours?" → returns plain text
   → choice.message.content = "We're open Monday to Saturday, 12pm to 11pm."

7. Reply saved to _history[agent_id] (for conversation memory)
   → History capped at 30 messages (old ones dropped)

8. Response sent back to frontend: { "reply": "We're open Monday to Saturday..." }

9. Frontend Chat.jsx receives response:
   → setMessages(prev => [...prev, { role: "agent", text: data.reply }])
   → Chat bubble appears in UI
   → Auto-scrolls to bottom (via bottomRef)
```

---

## PROCESS 4: MAKING A RESERVATION VIA CHAT

### What the user sees
Customer says "Book a table for 4, tomorrow 7pm, name Mohit" → Agent confirms booking.

### Step-by-step trace (this is where function calling happens)

```
1. Customer message sent to backend (same as Process 3, steps 1-5d)

2. Groq API receives the message + TOOL DEFINITIONS.
   The 5 tools defined in agent_service.py (line 27-109):
   
   Tool 1: check_availability(date, time, party_size)
   Tool 2: create_reservation(guest_name, party_size, date, time, phone?, notes?)
   Tool 3: find_reservation(guest_name)
   Tool 4: update_reservation(reservation_id, date?, time?, party_size?, ...)
   Tool 5: cancel_reservation(reservation_id)

3. Groq decides: "This person wants to book. I need to:
   a. First check if seats are available → call check_availability
   b. Then create the reservation → call create_reservation"

4. Groq returns: finish_reason = "tool_calls"
   → choice.message.tool_calls = [
       { function: { name: "check_availability", arguments: '{"date":"2026-08-07","time":"19:00","party_size":"4"}' } }
     ]

5. Backend detects tool_calls (agent_service.py line 250):
   → Loops through each tool call
   → Parses arguments: fn_args = json.loads(tool_call.function.arguments)
   → Calls _execute_tool(agent, "check_availability", {date, time, party_size})

6. _execute_tool() (agent_service.py line 153):
   → Coerces party_size from string "4" to int 4 (line 156)
   → Calls reservation_service.check_availability(agent, "2026-08-07", "19:00", 4)

7. check_availability() (reservation_service.py line 87):
   a. Validates party_size <= max_party_size (30) ✓
   b. Validates party_size >= 1 ✓
   c. Parses requested time: 2026-08-07 19:00
   d. Calculates end time: 19:00 + 75min = 20:15
   e. Scans ALL confirmed reservations for this agent on 2026-08-07
   f. For each: checks if time windows overlap
      → Overlap formula: request_start < existing_end AND existing_start < request_end
   g. Sums up seats_in_use from overlapping reservations
   h. available_seats = total_seats (30) - seats_in_use
   i. Returns (True, "26 seats available") or (False, "Only 2 seats available...")

8. Result sent back to Groq as a tool response:
   → messages.append({ role: "tool", content: '{"available": true, "message": "30 seats available"}' })

9. LOOP CONTINUES (agent_service.py line 263: "continue")
   → Groq now sees the availability result
   → Decides to call create_reservation next

10. Groq returns another tool_call: create_reservation(guest_name="Mohit", party_size="4", date="2026-08-07", time="19:00")

11. _execute_tool runs create_reservation:
    → Calls reservation_service.create_reservation() (line 15)
    
    FIRST: Deduplication check (line 21-26):
    → Scans all reservations for same agent + guest_name + date + time
    → If found: returns existing reservation (no duplicate)
    
    THEN: Availability check again (line 28)
    → Same algorithm as step 7
    
    THEN: Creates Reservation object (line 30-40):
    → id = uuid.uuid4() → "abc123-..."  (PRIMARY KEY)
    → agent_id = "7688505d-..."          (FOREIGN KEY)
    → guest_name = "Mohit"
    → party_size = 4
    → date = "2026-08-07"
    → time = "19:00"
    → status = "confirmed"
    → created_at = now()
    
    STORED: _reservations["abc123-..."] = reservation  (Python dict = our database)

12. Tool result sent back to Groq:
    → '{"ok": true, "id": "abc123-...", "guest": "Mohit", "party_size": 4, "date": "2026-08-07", "time": "19:00"}'

13. LOOP CONTINUES again → Groq now generates a human-readable response:
    → "Your table for 4 at 7pm tomorrow is booked, Mohit!"

14. This text reply is returned to frontend → displayed in chat + spoken aloud
```

### Edge case: Model outputs raw function text
Sometimes the LLM outputs `<function=check_availability>{"date":"..."}` as plain text instead of using the tool API. This is caught by `_parse_raw_function_call()` (agent_service.py line 215), which parses it, executes the tool, and re-prompts the model.

---

## PROCESS 5: CHANGING A RESERVATION VIA CHAT

### What the user sees
"I'm Mohit, change my reservation to day after tomorrow same time"

```
1. Message sent to Groq (same as Process 3)

2. Groq decides: "Need to find Mohit's reservation first"
   → Calls tool: find_reservation(guest_name="Mohit")

3. _execute_tool runs find_reservation:
   → Calls reservation_service.find_reservations(agent_id, "Mohit") (line 47)
   → Scans _reservations dict for:
     - Same agent_id
     - status == "confirmed"  
     - "mohit" is in guest_name.lower() (case-insensitive PARTIAL match)
   → Returns list of matches WITH their UUIDs:
     [{"id": "abc123-...", "guest": "Mohit", "party_size": 4, "date": "2026-08-07", "time": "19:00"}]

4. EDGE CASE: If multiple Mohits found:
   → System prompt (agent_service.py line 132) tells AI:
     "If multiple reservations found for the same name, ask the customer
      to confirm their party size and booking time to identify the correct one."
   → AI asks: "I found 2 reservations under Mohit — 4 people at 7pm and 2 at 8pm. Which one?"

5. Groq now has the UUID → calls: update_reservation(reservation_id="abc123-...", date="2026-08-09")

6. _execute_tool runs update_reservation:
   → Calls reservation_service.update_reservation("abc123-...", {date: "2026-08-09"}) (line 63)
   → Looks up reservation by UUID (PRIMARY KEY lookup): _reservations.get("abc123-...")
   → Checks status != "cancelled"
   → Updates only the fields provided: setattr(res, "date", "2026-08-09")
   → Returns updated reservation

7. Groq generates: "Done! Your reservation is now for August 9th at 7pm."
```

### Key insight for the reviewer
The customer provides their NAME (human-friendly). The system looks up the UUID (machine-friendly) using find_reservation. Then it uses the UUID to update. The customer never sees the UUID.

---

## PROCESS 6: CANCELLING A RESERVATION VIA CHAT

Same as Process 5, but instead of `update_reservation`, the LLM calls `cancel_reservation(reservation_id)`.

```
→ reservation_service.cancel_reservation() (line 79)
→ Looks up by UUID
→ Sets res.status = "cancelled"
→ Does NOT delete — just changes status (soft delete)
→ Cancelled reservations are excluded from availability checks and listing
```

---

## PROCESS 7: VOICE CALL FLOW

### What the user sees
Tap green 📞 → speak → agent replies with voice → loop continues.

```
1. User taps green phone button
   → Chat.jsx → toggleCall() (line 52)
   → Sets inCallRef.current = true, setInCall(true)
   → Calls startCallRecognition()

2. startCallRecognition() (line 70):
   → Creates ONE SpeechRecognition instance (stays alive entire call)
   → rec.lang = "en-IN"
   → rec.interimResults = true (shows words as you speak)
   → rec.continuous = true (doesn't stop after one sentence)
   → rec.start() → browser starts listening via microphone

3. User speaks: "Book a table for tomorrow"
   → rec.onresult fires (line 90):
     - Builds transcript from all results
     - Shows it in the input box: setInput(currentText)
     - Shows in status: "🎤 Book a table for tomorrow"
     - Starts 2.5-second silence timer

4. User pauses (2.5s of silence)
   → Silence timer fires (line 100):
     - Sets isSending = true (mic results now IGNORED)
     - Calls doSendAndSpeak(text, callback)

5. doSendAndSpeak() (line 139):
   → Shows "⏳ Thinking..."
   → POST /api/agents/{id}/chat → gets AI reply
   → Shows "🔊 Speaking..."
   → Creates SpeechSynthesisUtterance(reply)
   → Browser speaks it aloud
   → When done speaking (onend or timeout fallback):
     → Sets isSending = false
     → Mic results captured again
     → Shows "🎤 Listening..."
     → User speaks next message → loop continues

6. User taps red phone button
   → toggleCall() → inCallRef = false
   → recognition.stop()
   → speechSynthesis.cancel()
   → Call ends
```

### Why one persistent recognition instance?
Chrome CANNOT reliably restart SpeechRecognition after TTS playback. It requires a fresh user gesture. By keeping ONE instance alive the whole call with `continuous=true`, we avoid this entirely. We just use an `isSending` flag to ignore mic input while the AI is talking.

---

## PROCESS 8: ADMIN VIEWING RESERVATIONS

```
1. Admin opens /admin/7688505d-...
   → React Router maps to Admin.jsx

2. Admin.jsx → useEffect (line 33):
   → fetch("http://localhost:8001/api/agents/7688505d-...")
   → API: GET /api/agents/{agent_id}
   → Shows agent name in header

3. Admin.jsx → useEffect (line 37):
   → fetch("http://localhost:8001/api/agents/7688505d-.../reservations")
   → API: GET /api/agents/{agent_id}/reservations
   → Backend: routers/agents.py → get_reservations() (line 53)
   → Calls: reservation_service.list_reservations(agent_id)
   → reservation_service.py (line 119):
     - Filters _reservations dict: agent_id matches AND status == "confirmed"
     - Sorts by (date, time)
     - Returns list

4. Frontend renders:
   → 3 stat cards: total seats, seats booked (sum of party_size), reservation count
   → Table: guest name, date, time, party size, notes, cancel button
   → Date filter: adds ?date=2026-08-10 to API call

5. Optional date filter:
   → User picks a date → setFilterDate("2026-08-10")
   → useEffect re-fires → fetch with ?date=2026-08-10
   → Backend: Query parameter parsed (routers/agents.py line 53)
   → reservation_service filters by date too
```

---

## PROCESS 9: ADMIN CANCELLING A RESERVATION

```
1. Admin clicks trash icon on a reservation row
   → Admin.jsx → cancelReservation(resId) (line 41)
   → window.confirm("Cancel this reservation?") → user confirms

2. Frontend sends:
   → fetch("http://localhost:8001/api/agents/7688505d-.../reservations/abc123-...", {
       method: "DELETE"
     })

3. Backend receives DELETE /api/agents/{agent_id}/reservations/{reservation_id}
   → routers/agents.py → admin_cancel_reservation() (line 71)
   → Calls: reservation_service.cancel_reservation("abc123-...")
   → reservation_service.py (line 79):
     - Looks up by UUID
     - Sets status = "cancelled" (soft delete — record stays, just hidden)
   → Returns { ok: true, message: "Reservation for Mohit cancelled" }

4. Frontend re-fetches reservation list → cancelled one disappears from table
```

---

## PROCESS 10: WIDGET ON RESTAURANT WEBSITE

```
1. Restaurant adds to their HTML:
   <script src="swara-widget.js" data-agent="7688505d-..." data-host="http://localhost:3001">

2. Browser loads swara-widget.js (widget/swara-widget.js):
   → Reads data-agent and data-host from the script tag
   → Injects CSS for floating button (position: fixed, bottom: 24px, right: 24px)
   → Creates blue 💬 button, appends to document.body

3. Customer clicks the button:
   → widget.js opens a POPUP WINDOW (not iframe):
     window.open("http://localhost:3001/chat/7688505d-...?embed=true", "swara-chat", "width=400,height=620")
   → Why popup not iframe? Chrome blocks microphone in cross-origin iframes.

4. Popup loads Chat.jsx with ?embed=true:
   → isEmbed = true → header is hidden (clean look)
   → Everything else works identically to Process 3/4/5/7
```

---

## COMPLETE API MAP

### All 9 Endpoints

| # | Method | URL | Defined in | Called from frontend | Purpose |
|---|--------|-----|-----------|---------------------|---------|
| 1 | `GET` | `/api/health` | `routers/health.py` line 7 | nowhere (for monitoring) | Server alive check |
| 2 | `POST` | `/api/auth/login` | `routers/auth.py` line 17 | `Login.jsx` line 22 | Check email/password |
| 3 | `POST` | `/api/agents` | `routers/agents.py` line 15 | `GetStarted.jsx` line 49 | Create new agent |
| 4 | `GET` | `/api/agents` | `routers/agents.py` line 20 | `Dashboard.jsx` line 21 | List all agents |
| 5 | `GET` | `/api/agents/{id}` | `routers/agents.py` line 26 | `Chat.jsx` line 28, `Admin.jsx` line 15 | Get one agent |
| 6 | `POST` | `/api/agents/{id}/chat` | `routers/agents.py` line 34 | `Chat.jsx` line 147 | Send message, get AI reply |
| 7 | `POST` | `/api/agents/{id}/reset` | `routers/agents.py` line 43 | `Chat.jsx` line 63 | Clear conversation history |
| 8 | `GET` | `/api/agents/{id}/reservations` | `routers/agents.py` line 53 | `Admin.jsx` line 20 | List reservations |
| 9 | `PATCH` | `/api/agents/{id}/reservations/{rid}` | `routers/agents.py` line 62 | not used in UI (API only) | Update reservation |
| 10 | `DELETE` | `/api/agents/{id}/reservations/{rid}` | `routers/agents.py` line 71 | `Admin.jsx` line 43 | Cancel reservation |

### HTTP Methods explained
- **GET** = "give me data" — never changes anything. Like reading a menu.
- **POST** = "create something new" — creates an agent, sends a chat message, resets history.
- **PATCH** = "change part of something" — update one field of a reservation (not the whole thing).
- **DELETE** = "remove something" — cancel a reservation (soft delete: sets status="cancelled").

### How the frontend calls them
Every API call uses JavaScript's `fetch()`:
```javascript
const res = await fetch(`${API}/api/agents/${agentId}/chat`, {
  method: "POST",                                    // which HTTP method
  headers: { "Content-Type": "application/json" },   // "I'm sending JSON"
  body: JSON.stringify({ message: text }),            // the data
});
const data = await res.json();  // parse response body as JSON
```
- `await` = "pause here until the server responds"
- `res.json()` = convert the response from a JSON string to a JavaScript object
- `API` comes from `process.env.REACT_APP_BACKEND_URL` (set in `frontend/.env`)

---

## DATABASE SCHEMA

We use Python dictionaries as our database. Here's what they'd look like as SQL tables:

### agents table
```sql
CREATE TABLE agents (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id    TEXT DEFAULT '',
    business_name    TEXT NOT NULL,
    business_type    TEXT NOT NULL,
    greeting         TEXT DEFAULT 'Hi! How can I help you today?',
    instructions     TEXT DEFAULT '',
    total_seats      INTEGER DEFAULT 20,
    avg_eating_minutes INTEGER DEFAULT 60,
    max_party_size   INTEGER DEFAULT 20,
    reservations_enabled BOOLEAN DEFAULT TRUE,
    created_at       TIMESTAMP DEFAULT NOW()
);
```

**Actual storage in code** (agent_service.py line 17):
```python
_agents: dict[str, Agent] = {}
# key = agent.id (the primary key UUID)
# value = Agent pydantic object (all the columns above)
```

### reservations table
```sql
CREATE TABLE reservations (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id    UUID REFERENCES agents(id),    -- FOREIGN KEY
    guest_name  TEXT NOT NULL,
    party_size  INTEGER NOT NULL,
    date        TEXT NOT NULL,                  -- "2026-08-10"
    time        TEXT NOT NULL,                  -- "19:00"
    phone       TEXT DEFAULT '',
    notes       TEXT DEFAULT '',
    status      TEXT DEFAULT 'confirmed',       -- "confirmed" or "cancelled"
    created_at  TIMESTAMP DEFAULT NOW(),
    
    -- Deduplication: same person can't book same slot twice
    UNIQUE(agent_id, guest_name, date, time) WHERE status = 'confirmed'
);
```

**Actual storage in code** (reservation_service.py line 12):
```python
_reservations: dict[str, Reservation] = {}
# key = reservation.id (the primary key UUID)
# value = Reservation pydantic object
```

**Deduplication is enforced in code** (reservation_service.py line 21-26):
```python
for r in _reservations.values():
    if (r.agent_id == agent.id and r.status == "confirmed"
            and r.guest_name.lower() == guest_name.lower()
            and r.date == date and r.time == time):
        return {"ok": True, "reservation": r}  # return existing, don't duplicate
```

### conversation_history (not a table — just memory)
```python
_history: dict[str, list[dict]] = {}
# key = agent_id
# value = list of {"role": "user"|"assistant", "content": "..."}
# Capped at 30 messages. Lost on server restart.
```

---

## WHERE EVERY API IS DEFINED AND CALLED

### POST /api/auth/login
- **DEFINED:** `backend/app/routers/auth.py` → `login()` function, line 17
- **REGISTERED:** `backend/app/main.py` line 20: `app.include_router(auth_router, prefix="/api")`
- **CALLED FROM:** `frontend/src/pages/Login.jsx` → `handleSubmit()`, line 22
- **REQUEST:** `{ email: string, password: string }`
- **SUCCESS:** `{ ok: true, email: string }` — status 200
- **ERROR:** `{ detail: "Wrong email or password" }` — status 401

### POST /api/agents
- **DEFINED:** `backend/app/routers/agents.py` → `create_new_agent()`, line 15
- **CALLS:** `backend/app/services/agent_service.py` → `create_agent()`, line 196
- **WRITES TO:** `_agents` dict (agent_service.py line 17)
- **CALLED FROM:** `frontend/src/pages/GetStarted.jsx` → `handleCreate()`, line 49
- **REQUEST:** `{ business_name, business_type, greeting, instructions, total_seats, ... }`
- **RESPONSE:** Full Agent JSON with generated `id`

### GET /api/agents
- **DEFINED:** `backend/app/routers/agents.py` → `get_all_agents()`, line 20
- **CALLS:** `agent_service.list_agents()` → sorts by created_at descending
- **READS FROM:** `_agents` dict
- **CALLED FROM:** `frontend/src/pages/Dashboard.jsx` → useEffect, line 21

### GET /api/agents/{agent_id}
- **DEFINED:** `backend/app/routers/agents.py` → `get_one_agent()`, line 26
- **CALLS:** `agent_service.get_agent(agent_id)` → dict lookup by UUID
- **CALLED FROM:** `Chat.jsx` line 28 (load agent on mount), `Admin.jsx` line 15
- **ERROR:** 404 if agent_id not in dict

### POST /api/agents/{agent_id}/chat
- **DEFINED:** `backend/app/routers/agents.py` → `chat_with_agent()`, line 34
- **CALLS:** `agent_service.generate_reply()` — THE CORE FUNCTION (line 222)
- **INTERNALLY CALLS:** Groq API → may trigger tool calls → reservation_service functions
- **CALLED FROM:** `Chat.jsx` → `sendMessage()` line 44 and `doSendAndSpeak()` line 147
- **REQUEST:** `{ message: string }`
- **RESPONSE:** `{ reply: string }`
- **ERROR:** 404 (agent not found), 500 (Groq API failure)

### POST /api/agents/{agent_id}/reset
- **DEFINED:** `backend/app/routers/agents.py` → `reset_conversation()`, line 43
- **DOES:** `_history.pop(agent_id, None)` — clears conversation memory
- **CALLED FROM:** `Chat.jsx` → `toggleCall()` line 63 (when starting a new conversation)

### GET /api/agents/{agent_id}/reservations
- **DEFINED:** `backend/app/routers/agents.py` → `get_reservations()`, line 53
- **CALLS:** `reservation_service.list_reservations(agent_id, date?)`
- **QUERY PARAM:** `?date=2026-08-10` (optional filter)
- **CALLED FROM:** `Admin.jsx` → `fetchReservations()`, line 20

### PATCH /api/agents/{agent_id}/reservations/{reservation_id}
- **DEFINED:** `backend/app/routers/agents.py` → `admin_update_reservation()`, line 62
- **CALLS:** `reservation_service.update_reservation()`
- **CALLED FROM:** Not used in UI — available for API consumers
- **REQUEST:** `{ date?, time?, party_size?, guest_name?, notes? }` (partial update)

### DELETE /api/agents/{agent_id}/reservations/{reservation_id}
- **DEFINED:** `backend/app/routers/agents.py` → `admin_cancel_reservation()`, line 71
- **CALLS:** `reservation_service.cancel_reservation()` → sets status="cancelled"
- **CALLED FROM:** `Admin.jsx` → `cancelReservation()`, line 43

---

## STATUS CODES QUICK REFERENCE

| Code | When | Example |
|------|------|---------|
| **200** | Everything worked | Agent created, chat reply, reservations listed |
| **400** | Bad request / validation failed | Trying to update a cancelled reservation |
| **401** | Wrong credentials | Login with wrong password |
| **404** | Not found | Agent ID doesn't exist in memory |
| **422** | Invalid data shape | Missing required field in request body (Pydantic validation) |
| **500** | Server crash | Groq API down, code bug |
