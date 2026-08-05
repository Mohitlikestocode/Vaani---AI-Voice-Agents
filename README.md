# Swara

<p align="center">
	<a href="#quick-start-windows-powershell"><img src="https://img.shields.io/badge/Run-Local%20Dev-0B5FFF?style=for-the-badge" alt="Run Local Dev"></a>
	<a href="#architecture-diagram-complete-system"><img src="https://img.shields.io/badge/View-Architecture-111827?style=for-the-badge" alt="View Architecture"></a>
	<a href="#update-log-required"><img src="https://img.shields.io/badge/Track-Changes-16A34A?style=for-the-badge" alt="Track Changes"></a>
</p>

<p align="center">
	<img src="https://img.shields.io/badge/Frontend-React%2019-0ea5e9?style=flat-square">
	<img src="https://img.shields.io/badge/Backend-FastAPI-059669?style=flat-square">
	<img src="https://img.shields.io/badge/DB-MongoDB-22c55e?style=flat-square">
	<img src="https://img.shields.io/badge/Animation-Framer%20Motion%20%2B%20Lenis-8b5cf6?style=flat-square">
</p>

Swara is an AI voice-agent SaaS concept for businesses.

Today, this repository contains:
- A polished marketing landing page (production-quality frontend)
- A FastAPI + MongoDB backend scaffold for upcoming product APIs
- Product and design documentation for rapid iteration

## Quick Links

- [Quick Start](#quick-start-windows-powershell)
- [Architecture Diagram](#architecture-diagram-complete-system)
- [Tech Stack](#tech-stack)
- [Folder Map](#folder-map)
- [Update Log (Required)](#update-log-required)

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React 19, CRACO, Tailwind CSS, shadcn/ui |
| Motion | framer-motion, Lenis |
| Backend | FastAPI, Uvicorn, Motor |
| Database | MongoDB |
| Tooling | pytest-xdist, ESLint, PostCSS |

## Folder Map

```text
Swara/
	frontend/                # React app (landing page)
	backend/                 # FastAPI server scaffold
	memory/                  # PRD and product memory docs
	test_reports/            # Iteration test artifacts
	SWARA_PROJECT.md         # Deep architecture and roadmap doc
	design_guidelines.json   # Visual and UX design contract
	README.md
```

## Quick Start (Windows PowerShell)

Run frontend and backend in separate terminals.

### 1) Frontend setup + run

```powershell
cd "c:\Users\skotta\Desktop\Personal Code\Swara\frontend"
yarn install
yarn start
```

If you prefer npm:

```powershell
cd "c:\Users\skotta\Desktop\Personal Code\Swara\frontend"
npm install
npm start
```

Open: http://localhost:3000

### 2) Backend setup + run

```powershell
cd "c:\Users\skotta\Desktop\Personal Code\Swara\backend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Backend:
- Base URL: http://localhost:8001
- API prefix: /api
- API docs: http://localhost:8001/docs

### 3) Required environment files

Frontend env file:

```powershell
@"
REACT_APP_BACKEND_URL=http://localhost:8001
"@ | Set-Content -Path "c:\Users\skotta\Desktop\Personal Code\Swara\frontend\.env"
```

Backend env file:

```powershell
@"
MONGO_URL=mongodb://localhost:27017
DB_NAME=Swara_db
CORS_ORIGINS=http://localhost:3000
"@ | Set-Content -Path "c:\Users\skotta\Desktop\Personal Code\Swara\backend\.env"
```

## Development Commands

### Frontend

```powershell
cd "c:\Users\skotta\Desktop\Personal Code\Swara\frontend"
yarn start
yarn build
yarn test
```

### Backend

```powershell
cd "c:\Users\skotta\Desktop\Personal Code\Swara\backend"
.\.venv\Scripts\Activate.ps1
pytest
```

## Architecture Diagram (Complete System)

```mermaid
flowchart TB
		user[User Browser]

		subgraph FE[Frontend - React App]
			idx[index.js\nQueryClientProvider]
			app[App.js\nBrowserRouter]
			land[pages/Landing.jsx\nPage Composer]

			subgraph SEC[Landing Sections]
				nav[Navbar]
				hero[Hero]
				marq[Marquee]
				action[SeeItInAction]
				mani[Manifesto]
				usec[UseCases]
				feat[Features]
				roi[ROICalculator]
				price[Pricing]
				proof[SocialProof]
				cta[FinalCTA + Footer]
			end

			motion[motion.jsx\nReveal/MaskLine/Eyebrow]
			smooth[SmoothScroll.jsx\nLenis wrapper]
			ui[components/ui/*\nshadcn + Radix primitives]
			tokens[index.css + tailwind.config.js\nDesign tokens + animations]
			testids[constants/testIds/*\nStable selectors]
		end

		subgraph BE[Backend - FastAPI]
			api[server.py FastAPI app]
			router[APIRouter prefix /api]
			root[GET /api/]
			poststatus[POST /api/status]
			getstatus[GET /api/status]
			cors[CORS middleware]
			models[Pydantic models\nStatusCheck, StatusCheckCreate]
		end

		subgraph DB[Data Layer]
			mongo[(MongoDB)]
			motor[Motor AsyncIOMotorClient]
			coll[status_checks collection]
		end

		subgraph CFG[Config + Docs]
			envfe[frontend/.env\nREACT_APP_BACKEND_URL]
			envbe[backend/.env\nMONGO_URL, DB_NAME, CORS_ORIGINS]
			proj[SWARA_PROJECT.md]
			guide[design_guidelines.json]
			reports[test_reports/*.json]
		end

		user --> FE
		idx --> app --> land
		land --> SEC
		land --> motion
		land --> smooth
		SEC --> ui
		FE --> tokens
		FE --> testids

		user -. API calls (current/future) .-> BE
		BE --> api --> router
		router --> root
		router --> poststatus
		router --> getstatus
		api --> cors
		api --> models

		poststatus --> motor --> mongo --> coll
		getstatus --> motor

		envfe --> FE
		envbe --> BE
		proj --> FE
		proj --> BE
		guide --> FE
		reports --> FE
```

## Current Product State

- Frontend landing page is complete and actively styled/animated.
- Backend is scaffolded and currently exposes status endpoints.
- Current backend routes:
	- GET /api/
	- POST /api/status
	- GET /api/status

## Important Files

- SWARA_PROJECT.md
- design_guidelines.json
- frontend/package.json
- frontend/src/pages/Landing.jsx
- backend/server.py
- backend/requirements.txt

## Update Log (Required)

This README must be updated for all meaningful product or architecture changes.

Rule:
- Every non-trivial change must add one new row to the log below in the same PR/commit.

Template:

| Date | Area | Change | Files | Notes |
|---|---|---|---|---|
| YYYY-MM-DD | Frontend/Backend/Infra/Docs | Short summary | file paths | Why it matters |

### Change Entries

| Date | Area | Change | Files | Notes |
|---|---|---|---|---|
| 2026-07-17 | Docs | Full README redesign with badges/buttons, startup flow, and complete architecture diagram | README.md | Improves onboarding speed and documentation quality |
| 2026-07-17 | Frontend | Reduced hero typography and voice demo footprint so marquee appears earlier at 100% zoom | frontend/src/components/Swara/Hero.jsx, frontend/src/components/Swara/VoiceDemo.jsx | Improves above-the-fold balance and reduces first-scroll dependency |
| 2026-07-17 | Frontend | Switched app logo rendering to use provided real logo asset | frontend/src/components/Swara/Logo.jsx, frontend/public/Swaralogo.jpg | Ensures brand consistency across navbar and footer |
| 2026-07-17 | Backend | Added Day 1 modular backend skeleton with package init files, health router, config module, and provider interfaces | backend/app/main.py, backend/app/routers/health.py, backend/app/core/config.py, backend/app/services/interfaces.py | Sets foundation for 7-day learning sprint architecture |

## Development Notes

- Do not hardcode backend URLs in frontend code. Use REACT_APP_BACKEND_URL.
- Keep backend routes under /api prefix.
- Prefer data-driven component content arrays for easy copy and pricing updates.
