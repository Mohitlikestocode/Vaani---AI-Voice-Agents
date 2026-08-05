# Swara — Frontend Flows & UI Explained

## How React Works (30-second version)

React is a library for building UIs from components. Each page is a function that returns HTML-like code (JSX). When data changes (state), React re-renders just the parts that changed.

Key concepts used in this project:
- **useState** — stores data that can change (like form inputs, messages list)
- **useEffect** — runs code when the page loads (like fetching agent details from API)
- **useRef** — stores a value that persists across re-renders without triggering them
- **React Router** — maps URLs to components (pages)

---

## App.js — The Router

**File:** `frontend/src/App.js`

This is the entry point. It maps URLs to pages:

```
/               → Landing.jsx    (marketing site)
/login          → Login.jsx      (email/password form)
/dashboard      → Dashboard.jsx  (list of your agents)
/get-started    → GetStarted.jsx (4-step agent creation)
/chat/:agentId  → Chat.jsx       (chat + voice interface)
/admin/:agentId → Admin.jsx      (reservation dashboard)
```

---

## Page-by-Page Breakdown

### 1. Landing Page (`/`)
**File:** `frontend/src/pages/Landing.jsx`

Pure marketing page. No API calls. Shows:
- Hero section with animated text
- How it works
- Features grid
- Pricing
- "Get Started" button → links to `/get-started`
- "Log in" → links to `/login`

---

### 2. Login Page (`/login`)
**File:** `frontend/src/pages/Login.jsx`

**What it does:**
1. Shows email + password form
2. On submit → calls `POST /api/auth/login`
3. If success → saves to `localStorage` → navigates to `/dashboard`
4. If fail → shows error message

**State:**
- `email` — input value
- `password` — input value
- `error` — error message to display
- `loading` — disables button while waiting

**localStorage keys set:**
- `swara_logged_in` = "true"
- `swara_email` = the email

---

### 3. Dashboard (`/dashboard`)
**File:** `frontend/src/pages/Dashboard.jsx`

**What it does:**
1. On mount: checks `localStorage` for `swara_logged_in` — if not found, redirects to `/login`
2. Fetches `GET /api/agents` → shows list of all agents
3. Each agent has "Chat" and "Admin" buttons
4. "New Agent" button → links to `/get-started`
5. Logout button → clears localStorage → goes to `/login`

---

### 4. Get Started — Agent Creation (`/get-started`)
**File:** `frontend/src/pages/GetStarted.jsx`

**4-step wizard:**

| Step | What user fills in | State fields |
|------|-------------------|--------------|
| 1 | Business name + type | `business_name`, `business_type` |
| 2 | Instructions (teach the agent) | `instructions` |
| 3 | Capacity config (optional) | `total_seats`, `avg_eating_minutes`, `max_party_size`, `reservations_enabled` |
| 4 | Greeting message | `greeting` |

**On "Launch Agent" click:**
1. `handleCreate()` → `POST /api/agents` with all form data
2. Backend creates agent, returns it with an ID
3. Page shows success screen with:
   - The embed code (`<script src="..." data-agent="ID">`)
   - Copy button
   - Link to test agent (chat page)
   - Link to admin dashboard

**Autofill button:** "Fill with sample (My Odyssey restaurant)" pre-fills step 2 with a detailed restaurant description.

**Login guard:** `useEffect` checks `localStorage` — redirects to `/login` if not logged in.

---

### 5. Chat Page (`/chat/:agentId`)
**File:** `frontend/src/pages/Chat.jsx`

The most complex page. Handles text chat AND voice calls.

**URL params:**
- `agentId` — from the URL
- `?embed=true` — hides the header (used in widget popup)
- `?admin=true` — shows the "Admin" link in header

**On mount:**
1. `GET /api/agents/{agentId}` → load agent details
2. Display greeting as first message

**Text chat flow:**
1. User types in input → clicks send (or presses Enter)
2. `sendMessage()` → calls `doSend(text)` internally
3. Message appears in the chat immediately (optimistic)
4. `POST /api/agents/{id}/chat` → waits for AI reply
5. Reply appears in chat

**Voice call flow:**
1. User taps green 📞 button → `toggleCall()` starts the call
2. Creates ONE `SpeechRecognition` instance with `continuous=true`
3. Mic stays open — words appear in real-time in the input box
4. After 2.5 seconds of silence → auto-sends the accumulated text
5. AI processes → reply displayed in chat + spoken aloud via TTS
6. After TTS finishes → `isSending` flag resets → mic captures again
7. Loop continues until user taps red 📞 button

**Key design decisions:**
- ONE recognition instance for entire call (never destroyed/recreated)
- `isSending` flag = ignore mic input while AI is processing/speaking
- `onend` handler auto-restarts if Chrome kills the recognition
- `continuous=true` prevents Chrome from stopping after each sentence
- Silence timer (2.5s) determines when to send

**State variables:**
| State | Purpose |
|-------|---------|
| `agent` | Agent data from API |
| `messages` | Array of {role, text} — the chat history |
| `input` | Current text in the input box |
| `sending` | Is an API call in progress? |
| `listening` | Is the mic active? |
| `inCall` | Is the call mode on? (for UI rendering) |
| `callStatus` | Status text shown during call ("🎤 Listening...", "⏳ Thinking...", etc.) |
| `voiceEnabled` | Should replies be spoken aloud? |

**Refs (don't trigger re-renders):**
| Ref | Purpose |
|-----|---------|
| `sendingRef` | Avoids stale closure issues in async callbacks |
| `inCallRef` | Same — used inside recognition callbacks |
| `recognitionRef` | Reference to the SpeechRecognition instance |
| `bottomRef` | Auto-scroll to bottom of chat |

---

### 6. Admin Page (`/admin/:agentId`)
**File:** `frontend/src/pages/Admin.jsx`

**What it does:**
1. Fetches agent details + all reservations
2. Shows 3 stat cards: total seats, seats booked, reservation count
3. Date filter input → re-fetches with `?date=YYYY-MM-DD`
4. Reservation table: guest name, date, time, party size, notes, cancel button
5. Cancel button → `DELETE /api/agents/{id}/reservations/{resId}`
6. Refresh button → re-fetches

---

## The Widget

**Files:** `widget/swara-widget.js`, `frontend/public/swara-widget.js`, `demo-restaurant/swara-widget.js`

**How it works:**
1. Website adds: `<script src="swara-widget.js" data-agent="ID" data-host="http://...">`
2. Script reads `data-agent` and `data-host` from the script tag
3. Injects a blue floating button (fixed, bottom-right, z-index 99999)
4. On click → opens a popup window pointing to `{host}/chat/{agentId}?embed=true`
5. The popup IS the Swara chat page (just without the header)

**Why popup instead of iframe?**
- Iframes block microphone access cross-origin
- Popups get their own permissions → mic works
- Still looks like an integrated widget from the user's perspective

---

## State Management Pattern

This project uses **local component state** (no Redux, no global store). Each page manages its own data:

```
Login.jsx    → handles its own email/password/error
Dashboard    → fetches and stores agents list
GetStarted   → holds the 4-step form state
Chat         → messages, voice state, call state
Admin        → reservations list, filter
```

Cross-page persistence: `localStorage` for login status. That's it.

---

## How `fetch()` Works in This Project

Every API call follows this exact pattern:

```javascript
// 1. Make the request
const res = await fetch(`${API}/api/agents/${agentId}/chat`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: text }),
});

// 2. Parse the response
const data = await res.json();

// 3. Use the data
setMessages(prev => [...prev, { role: "agent", text: data.reply }]);
```

- `await` = pause this function until the network request finishes
- `fetch` returns a Response object
- `.json()` parses the body as JSON
- If the server returns an error status (4xx, 5xx), `res.ok` is `false`
