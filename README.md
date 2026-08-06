# Swara

**AI Voice Agent for Every Business** — Create an agent, teach it your business, embed it on your website. Customers talk to it (text or voice), it answers questions, takes reservations, handles changes. You see everything in the admin panel.

---

## 🚀 Quick Start (3 commands, 3 terminals)

```bash
# Terminal 1 — Backend (API server)
npm run backend

# Terminal 2 — Frontend (React app)
npm run frontend

# Terminal 3 — Demo restaurant (optional)
npm run restaurant
```

| Command | What it starts | URL |
|---------|---------------|-----|
| `npm run backend` | FastAPI Python server | http://localhost:8001 |
| `npm run frontend` | React dev server | http://localhost:3000 |
| `npm run restaurant` | Demo restaurant site | http://localhost:5500 |

> **Bonus:** Visit http://localhost:8001/docs for interactive API documentation (Swagger UI, auto-generated).

### First-time setup

```bash
# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && pip install -r requirements.txt && cd ..
```

### Login credentials
```
Email:    admin@swara.com
Password: swara123
```

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19 + Tailwind CSS + shadcn/ui | UI and styling |
| Backend | FastAPI (Python) | API server, async |
| AI | Groq API (llama-3.3-70b-versatile) | LLM with function calling |
| Voice STT | Web Speech API (Chrome) | Mic → text |
| Voice TTS | SpeechSynthesis API (Chrome) | Text → spoken audio |
| Storage | In-memory (Python dicts) | Prototype — swap to Postgres later |
| Widget | Vanilla JS (swara-widget.js) | One-line embed on any website |

---

## 📁 Project Structure

```
Swara/
├── package.json                 ← npm run backend / frontend / restaurant
│
├── backend/                     ← FastAPI server (port 8001)
│   ├── .env                     ← API keys, admin credentials
│   ├── app/
│   │   ├── main.py              ← Entry point, CORS, router mounting
│   │   ├── core/config.py       ← Settings from .env
│   │   ├── models/agent.py      ← Data schemas (Agent, Reservation)
│   │   ├── routers/
│   │   │   ├── agents.py        ← All API endpoints
│   │   │   ├── auth.py          ← Login endpoint
│   │   │   └── health.py        ← Health check
│   │   └── services/
│   │       ├── agent_service.py      ← LLM + function calling logic
│   │       └── reservation_service.py ← Booking CRUD + availability
│   └── requirements.txt
│
├── frontend/                    ← React app (port 3000)
│   ├── .env                     ← REACT_APP_BACKEND_URL
│   ├── src/
│   │   ├── App.js               ← Routes
│   │   ├── pages/
│   │   │   ├── Landing.jsx      ← Marketing page
│   │   │   ├── Login.jsx        ← Auth
│   │   │   ├── Dashboard.jsx    ← Your agents
│   │   │   ├── GetStarted.jsx   ← Agent creation wizard
│   │   │   ├── Chat.jsx         ← Chat + voice call
│   │   │   └── Admin.jsx        ← Reservations panel
│   │   └── components/Swara/    ← Shared UI components
│   └── public/swara-widget.js   ← Widget script
│
├── widget/swara-widget.js       ← Embeddable widget source
├── demo-restaurant/             ← Example site with widget
└── Documentation/               ← Deep-dive docs for code review
```

---

## 🔌 API Endpoints

All endpoints are at `http://localhost:8001/api/...`

| Method | Endpoint | Purpose | File |
|--------|----------|---------|------|
| `POST` | `/api/auth/login` | Admin login | `routers/auth.py` |
| `POST` | `/api/agents` | Create agent | `routers/agents.py` |
| `GET` | `/api/agents` | List all agents | `routers/agents.py` |
| `GET` | `/api/agents/{id}` | Get one agent | `routers/agents.py` |
| `POST` | `/api/agents/{id}/chat` | Chat with AI | `routers/agents.py` |
| `POST` | `/api/agents/{id}/reset` | Clear conversation | `routers/agents.py` |
| `GET` | `/api/agents/{id}/reservations` | List bookings | `routers/agents.py` |
| `PATCH` | `/api/agents/{id}/reservations/{rid}` | Update booking | `routers/agents.py` |
| `DELETE` | `/api/agents/{id}/reservations/{rid}` | Cancel booking | `routers/agents.py` |
| `GET` | `/api/health` | Server status | `routers/health.py` |

---

## 🎯 Core Features

### 1. Agent Creation (4-step wizard)
Business name → Instructions → Capacity config → Greeting → **Get embed code**

### 2. AI Chat with Function Calling
The LLM has 5 tools it can call autonomously:
- `check_availability` — are seats free?
- `create_reservation` — book a table
- `find_reservation` — look up by guest name
- `update_reservation` — change date/time
- `cancel_reservation` — cancel a booking

### 3. Voice Call
Green phone button → mic listens continuously → 2.5s silence auto-sends → AI replies with speech → loop

### 4. One-Line Widget
```html
<script src="http://localhost:3000/swara-widget.js" data-agent="AGENT_ID" data-host="http://localhost:3000"></script>
```
Any website adds this → blue chat bubble appears → opens Swara in a popup.

### 5. Admin Dashboard
See all reservations in a table. Filter by date. Cancel bookings.

---

## 🔐 Environment Variables

### `backend/.env`
```env
GROQ_API_KEY=gsk_...                    # Groq API key
GROQ_MODEL=llama-3.3-70b-versatile      # LLM model
ADMIN_EMAIL=admin@swara.com             # Login email
ADMIN_PASSWORD=swara123                 # Login password
```

### `frontend/.env`
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

---

## 📖 Documentation

Detailed docs for code review in `/Documentation/`:

| File | What it covers |
|------|---------------|
| `01-ARCHITECTURE.md` | File map, tech stack, data flow, how to run |
| `02-API-REFERENCE.md` | Every endpoint with request/response examples |
| `03-FRONTEND-FLOWS.md` | Page-by-page breakdown, React state, voice architecture |
| `04-DECISIONS-AND-DEEP-DIVES.md` | Why these techs, edge cases, LLM config, interview Q&A |
| `05-COMPLETE-WORKFLOW-REFERENCE.md` | **THE ONE DOC** — every process traced click-to-database |

---

## 🔄 How It Works (High Level)

```
Customer visits restaurant website
    → Clicks blue chat bubble (widget)
        → Popup opens with Swara chat
            → Customer speaks: "Book for 4 tomorrow 7pm"
                → Browser converts speech to text (Web Speech API)
                    → POST /api/agents/{id}/chat
                        → Groq LLM processes with function calling
                            → check_availability() → seats free? ✓
                            → create_reservation() → saved in memory
                        → Returns: "Your table is booked, Mohit!"
                    → Browser speaks reply aloud (SpeechSynthesis)
            → Admin opens /admin/{id} → sees reservation in table
```

---

## 🛣️ Roadmap

- [x] Landing page
- [x] Agent creation wizard
- [x] Groq LLM integration with function calling
- [x] Reservation system (book/edit/cancel + availability)
- [x] Voice call (STT + TTS, continuous mode)
- [x] Embeddable widget
- [x] Simple auth + dashboard
- [ ] Database persistence (Postgres)
- [ ] Production deployment
- [ ] Multi-language support
- [ ] WebRTC for better voice quality
- [ ] ElevenLabs TTS integration
