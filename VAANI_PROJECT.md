# Vaani — Project Documentation

> **Vaani** is an AI voice-agent SaaS for businesses: create an agent that knows your
> business, answers every call 24/7, set up in 60 seconds, no code.
> This repo currently contains the **marketing landing page** (frontend only).
> This document explains the frontend in full and lays out the backend work you can build next.

---

## 1. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 (CRA), React Router, Tailwind CSS, shadcn/ui |
| Animation | `framer-motion` (reveals, cycling, counters), `lenis` (smooth scroll) |
| Icons | `lucide-react` |
| Backend (scaffold only, unused so far) | FastAPI (Python), Motor/MongoDB |
| Env | Frontend `REACT_APP_BACKEND_URL`; Backend `MONGO_URL`, `DB_NAME` |

Run locally (managed by supervisor in this environment):
- Frontend: port 3000 · Backend: port 8001 (all API routes must be prefixed `/api`).
- Never hardcode URLs — frontend uses `process.env.REACT_APP_BACKEND_URL`.

---

## 2. Design System

Defined in `tailwind.config.js` (tokens under `theme.extend.colors.vaani`) and `src/index.css`.

**Palette (modern SaaS, light theme)**
| Token | Hex | Use |
|-------|-----|-----|
| `vaani-cream` | `#FAFAFA` | page background |
| `vaani-sand` | `#F4F4F5` | alternate section background |
| `vaani-white` | `#FFFFFF` | cards / surfaces |
| `vaani-ink` / `vaani-maroon` | `#09090B` | primary text + dark "inverted" bands |
| `vaani-muted` | `#71717A` | secondary text |
| `vaani-gold` (accent) | `#0055FF` | electric-azure accent: CTAs, highlights, waveforms |
| `vaani-gold-soft` | `#E4E4E7` | neutral zinc borders |

> Note: the token names `maroon`/`gold` are historical; they now hold **slate** and **azure**.
> Star ratings use `amber-400` (standard review convention).

**Type** — `font-display` / `font-serif` → **Outfit** (headings); `font-sans` → **DM Sans** (body);
`font-mono` → **JetBrains Mono** (labels, numbers). Loaded in `public/index.html`.

**Logo** — `src/components/vaani/Logo.jsx` renders the brand lotus mark (image asset) + "Vaani" wordmark.
Swap the `LOGO_SRC` constant to change the logo.

**Motifs** — `Mandala.jsx` is deprecated/unused. Current motifs: a subtle CSS grid
(`.vaani-grid` in index.css) and an animated soundwave (`SoundWave.jsx`).

---

## 3. Frontend Structure

```
src/
├── App.js                     # Router; wraps app in .vaani-grain
├── index.css                  # tokens, fonts, .vaani-grid, marquee & waveform keyframes
├── pages/
│   └── Landing.jsx            # composes all sections inside <SmoothScroll>
└── components/vaani/
    ├── SmoothScroll.jsx       # Lenis provider + anchor-link smooth scrolling
    ├── motion.jsx             # <Reveal> (scroll-in), <MaskLine> (masked reveal), <Eyebrow>
    ├── Logo.jsx               # <Logo>, <LogoMark>
    ├── SoundWave.jsx          # decorative animated equalizer motif
    ├── Navbar.jsx             # fixed nav, scroll-aware blur, azure CTA
    ├── Hero.jsx               # kinetic headline (MaskLine), parallax VoiceDemo, floating chips, grid+glow
    ├── VoiceDemo.jsx          # scripted, looping voice-chat mockup + <Waveform>
    ├── Marquee.jsx            # editorial logo marquee (CSS keyframe)
    ├── SeeItInAction.jsx      # dark band + 2nd VoiceDemo
    ├── Manifesto.jsx          # "How it works" — 3 auto-cycling step cards (5s)
    ├── UseCases.jsx           # pill tabs + product-window; image/copy/chat swap per category
    ├── Features.jsx           # bento feature grid (7 tiles)
    ├── ROICalculator.jsx      # 3 sliders → recovered revenue (₹), live
    ├── Pricing.jsx            # Monthly/6mo/Annual toggle + animated ₹ counter (AnimatedRupee)
    ├── SocialProof.jsx        # stats + 3 auto-cycling testimonials (5s)
    └── FinalCTA.jsx           # exports <FinalCTA> and <Footer>
```

### Key interactive pieces
- **ROI formula** (`ROICalculator.jsx`): `missedPerDay = calls × missed% ; revenue = missedPerDay × avgValue × 30`.
- **Pricing** (`Pricing.jsx`): `mult` = Monthly 1 / 6-mo 0.9 / Annual 0.8; `AnimatedRupee` tweens the number.
- **Auto-cycle** (`Manifesto.jsx`, `SocialProof.jsx`): `setInterval(…, 5000)` advances the highlighted card; hover does **not** interrupt it.
- **Use-cases** (`UseCases.jsx`): `active` index drives image (`usecase-image`), copy, stat and chat via `AnimatePresence`.

### Conventions
- Every interactive/important element has a `data-testid` (kebab-case).
- Named exports for components; default export for the page.
- To change content, edit the data arrays at the top of each component (e.g. `tiers`, `cases`, `testimonials`).

---

## 4. Backend Roadmap (build this next)

The FastAPI + MongoDB scaffold exists in `/app/backend` but is currently unused by the landing page.
Suggested phased build. **All routes must be prefixed with `/api`.**

### Phase 0 — Foundations
- MongoDB models via a `BaseDocument` (map `_id`→`id`, ObjectId→str). Use `datetime.now(timezone.utc)`.
- Health check `GET /api/health`.

### Phase 1 — Lead capture (fastest revenue lever)
- `POST /api/leads` — save name, business, phone/email, use-case, source. Wire the hero / final CTA / "Talk to sales" buttons to it.
- `GET /api/leads` (admin) — list/export leads.

### Phase 2 — Auth & accounts
- Choose: JWT email/password **or** Emergent-managed Google login (recommended for speed).
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`.
- User model: id, email, name, plan (free/pro/business), createdAt.

### Phase 3 — Agent builder (core product)
- `Agent` model: id, ownerId, name, personality, languages[], businessInfo (menu/FAQ/hours),
  integrations[], published(bool), embedToken.
- CRUD: `POST/GET/PATCH/DELETE /api/agents`.
- Knowledge ingestion: `POST /api/agents/:id/knowledge` (upload PDF/URL → chunk + store).

### Phase 4 — The voice/chat engine
- LLM answering constrained to the agent's knowledge base (RAG) — no hallucination.
- Text: `POST /api/agents/:id/chat`. Voice: STT (speech→text) + TTS (text→speech).
- Embeddable widget: serve `/embed/:token` (the `<script>` shown on the Features tile).

### Phase 5 — Analytics & billing
- `Conversation` logs (per agent): messages, duration, resolved/handoff.
- `GET /api/agents/:id/analytics` — volume, top questions, gaps.
- Billing: Stripe/Razorpay subscriptions mapped to the pricing tiers; usage limits (50/500/unlimited convos).

### Integrations to route through the integration playbook (do NOT hardcode)
- LLM (OpenAI/Claude/Gemini) via the Emergent Universal Key.
- STT/TTS (e.g. OpenAI Whisper / ElevenLabs).
- Payments (Stripe/Razorpay). File storage for uploaded knowledge.

---

## 5. Data-testid map (for automated testing)
`navbar`, `navbar-logo`, `navbar-cta`, `nav-link-*`, `hero`, `hero-primary-cta`, `voice-demo`,
`featured-medium-link`, `logo-marquee`, `see-it-in-action`, `how-it-works`, `step-card-0..2`,
`step-dot-0..2`, `use-cases`, `usecase-tab-0..4`, `usecase-panel`, `usecase-image`, `features`,
`roi-calculator`, `roi-slider-{calls,value,missed}`, `roi-revenue`, `pricing`, `billing-{monthly,sixmo,annual}`,
`price-{free,pro,business}`, `pricing-cta-*`, `social-proof`, `testimonial-card-0..2`,
`final-cta`, `final-cta-button`, `footer`, `footer-linkedin`.
