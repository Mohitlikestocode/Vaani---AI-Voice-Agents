# Vaani — AI Voice Agents for Every Business

## Problem Statement
Build an award-worthy (Awwwards-level) marketing landing page for Vaani, an AI voice-agent SaaS for local Indian businesses. Competitor to brilo.ai, inspired by Atlassian Jira. Light theme only, premium editorial art direction, heavy motion (framer-motion + lenis).

## User Choices
- Build everything, but landing page FIRST (signup/login + dashboard deferred).
- ROI calculator sliders + pricing toggle fully interactive.
- No backend for now (frontend-only).
- Voice demo = visually animated only (no real AI).
- No dark theme. Design expert chooses aesthetic.

## Architecture
- Frontend: React 19 + Tailwind + framer-motion + lenis (smooth scroll). Shadcn UI (Slider, Accordion).
- Design: "Swiss Editorial (Light)" — Cormorant Garamond (serif headings), Manrope (body), JetBrains Mono (labels). Palette: bg #F5F4F0, terracotta #D94F36, forest #213A2C, ink #111.
- No backend used; server.py untouched.

## Implemented (2026)
- Kinetic hero with masked line-by-line reveal + parallax animated voice-demo mockup.
- Editorial logo marquee, "See it in action" forest section with 2nd voice demo.
- Numbered manifesto (How it works), Use cases (clipped-frame photography + accordion sample chats).
- Bento features grid, interactive ROI calculator (verified ₹3,02,400 default), pricing with Monthly/6mo/Annual toggle (verified discounts).
- Social proof stats + testimonials, final CTA, massive-wordmark footer.
- Tested: 21/21 frontend checks passed (iteration_1.json).

## Backlog / Next
- P0: Auth (JWT or Emergent Google login) + Get Started flow.
- P1: Agent creation wizard (Describe → Customize → Go live), dashboard, analytics.
- P2: Real voice agent (LLM + TTS/STT), multi-language, embed widget, lead-capture backend.
