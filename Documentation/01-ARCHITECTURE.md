# Swara — Architecture & File Map

## What is Swara?
Swara is an AI voice agent SaaS. A business creates an agent, teaches it about their business, and embeds it on their website. Customers can then chat (text or voice) with the AI — it answers questions, takes reservations, and handles changes. The business owner sees all reservations in an admin panel.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 19 + Tailwind CSS | Fast UI, utility-first styling |
| Backend | FastAPI (Python) | Async, auto-generates API docs, type-safe |
| AI/LLM | Groq API (llama-3.3-70b-versatile) | Fastest inference, free tier, supports function calling |
| Voice STT | Web Speech API (browser built-in) | Zero dependencies, works in Chrome |
| Voice TTS | SpeechSynthesis API (browser built-in) | Zero dependencies, instant |
| Storage | In-memory Python dicts | Prototype speed — swap to Postgres later |
| Auth | Simple .env credentials | Minimal for prototype |

---

## Folder Structure

```
Swara/
├── backend/                    ← Python FastAPI server (port 8001)
│   ├── .env                    ← Secret config (API keys, admin password)
│   ├── app/
│   │   ├── main.py             ← Server entry point — creates FastAPI app, adds CORS, mounts routers
│   │   ├── core/
│   │   │   └── config.py       ← Loads .env file, exposes settings as a dataclass
│   │   ├── models/
│   │   │   └── agent.py        ← Pydantic data shapes (Agent, Reservation, ChatRequest, etc.)
│   │   ├── routers/
│   │   │   ├── agents.py       ← All API endpoints (CRUD agents, chat, reservations)
│   │   │   ├── auth.py         ← Login endpoint (checks against .env)
│   │   │   └── health.py       ← Health check endpoint (GET /api/health)
│   │   └── services/
│   │       ├── agent_service.py   ← Core brain — Groq LLM calls, function calling, tool execution
│   │       ├── reservation_service.py ← Booking logic — availability check, CRUD, time overlap math
│   │       └── interfaces.py   ← Abstract interfaces for STT/LLM/TTS (future swappability)
│   └── requirements.txt
│
├── frontend/                   ← React app (port 3000/3001)
│   ├── .env                    ← REACT_APP_BACKEND_URL=http://localhost:8001
│   ├── public/
│   │   ├── swaralogo.png       ← Brand logo
│   │   └── swara-widget.js     ← Widget script (served statically)
│   ├── src/
│   │   ├── App.js              ← React Router — maps URLs to pages
│   │   ├── pages/
│   │   │   ├── Landing.jsx     ← Marketing landing page (/)
│   │   │   ├── Login.jsx       ← Email/password login (/login)
│   │   │   ├── Dashboard.jsx   ← Lists your agents (/dashboard)
│   │   │   ├── GetStarted.jsx  ← 4-step agent creation wizard (/get-started)
│   │   │   ├── Chat.jsx        ← Chat + voice call interface (/chat/:agentId)
│   │   │   └── Admin.jsx       ← Reservation dashboard (/admin/:agentId)
│   │   └── components/Swara/   ← Reusable UI components (Navbar, Hero, Logo, etc.)
│   └── package.json
│
├── widget/                     ← Embeddable widget source
│   └── swara-widget.js         ← The "one-line integration" script
│
├── demo-restaurant/            ← Example website showing the widget
│   ├── index.html              ← Fake restaurant site with widget embedded
│   └── swara-widget.js         ← Copy of widget for same-origin serving
│
└── Documentation/              ← You are here
```

---

## How Data Flows (End to End)

### Creating an Agent
```
User fills form on /get-started
    → Frontend sends POST /api/agents with JSON body
        → Backend creates Agent object, stores in _agents dict
            → Returns Agent JSON (with generated UUID)
                → Frontend shows embed code + links
```

### Customer Chatting
```
Customer types message (or speaks via mic)
    → Frontend sends POST /api/agents/{id}/chat with { message: "..." }
        → Backend's generate_reply() builds system prompt + conversation history
            → Calls Groq API with tools defined
                → If Groq wants to call a tool (e.g. create_reservation):
                    → Backend executes the tool function locally
                    → Sends result back to Groq
                    → Groq generates final human-readable reply
                → Returns { reply: "Your table is booked!" }
            → Frontend displays the reply
                → If voice enabled: browser speaks it aloud
```

### Reservation Flow
```
Customer: "Book for 4 at 7pm tomorrow, name Mohit"
    → LLM decides to call check_availability(date, time, party_size)
        → reservation_service checks time overlaps
        → Returns: "26 seats available"
    → LLM then calls create_reservation(guest_name, party_size, date, time)
        → reservation_service creates Reservation object
        → Returns: { ok: true, id: "abc123" }
    → LLM responds: "Your table is booked, Mohit!"
    → Admin panel (GET /api/agents/{id}/reservations) shows it
```

---

## Key Concepts

### Function Calling (Tool Use)
The LLM doesn't just generate text — it can decide to "call" predefined functions. We define 5 tools:
1. `check_availability` — are seats free at this date/time?
2. `create_reservation` — book a table
3. `find_reservation` — search by guest name
4. `update_reservation` — change date/time/party size
5. `cancel_reservation` — cancel a booking

The LLM sees these tool definitions and autonomously decides when to use them based on the conversation.

### System Prompt
Every chat message is sent to Groq with a "system prompt" prepended. This tells the AI:
- Who it is (the restaurant's receptionist)
- What it knows (business hours, menu, prices from the instructions)
- Current date/time (for relative date handling)
- Rules (keep replies short, never make up info, collect name/size/date/time before booking)

### Conversation History
Each agent keeps a list of past messages in `_history[agent_id]`. This gives the AI "memory" within a conversation. Limited to last 30 messages to avoid token overflow.

### Availability Algorithm
When checking if seats are free:
1. Get the requested start time
2. Calculate end time = start + avg_eating_minutes
3. For all confirmed reservations on that date:
   - Check if they overlap with the requested window
   - Sum up their party sizes = seats_in_use
4. Available = total_seats - seats_in_use
5. If requested party_size > available → reject

---

## Environment Variables

### backend/.env
```
GROQ_API_KEY=gsk_...         ← Groq API key for LLM calls
GROQ_MODEL=llama-3.3-70b-versatile  ← Which model to use
ADMIN_EMAIL=admin@swara.com  ← Login email
ADMIN_PASSWORD=swara123      ← Login password
```

### frontend/.env
```
REACT_APP_BACKEND_URL=http://localhost:8001  ← Where the backend lives
```

---

## Running Locally

```bash
# Terminal 1: Backend
cd backend
python -m uvicorn app.main:app --port 8001 --reload

# Terminal 2: Frontend
cd frontend
npm start

# Terminal 3: Demo restaurant (optional)
cd demo-restaurant
python -m http.server 5500
```

---

## URL Map

| URL | Page | Auth Required? |
|-----|------|---------------|
| `/` | Landing page | No |
| `/login` | Login form | No |
| `/dashboard` | Your agents list | Yes |
| `/get-started` | Create new agent | Yes |
| `/chat/:agentId` | Customer chat interface | No |
| `/chat/:agentId?embed=true` | Embed mode (no header) | No |
| `/chat/:agentId?admin=true` | Shows admin link in header | No |
| `/admin/:agentId` | Reservation dashboard | No (direct URL) |
