# Building Swara's Backend: A 7 Day Engineering Sprint

This document is written to be fed to a coding copilot, one section at a time, not all at once. Its whole point is that you come out the other end actually understanding the codebase, not just owning a repo that happens to work.

## How to use this document

Paste one day's section into your copilot at a time. Each task below is tagged:

- **YOU BUILD**, write this yourself. The copilot can review it after, but the first draft is yours. These are the parts where the thinking matters more than the typing.
- **COPILOT SCAFFOLDS**, genuinely boilerplate (config loaders, folder structure, Dockerfiles). Let the copilot generate it, but read every line before you accept it. Ask "why is this here" if anything looks unfamiliar.

Before moving to the next day, do this every single time: ask your copilot to explain, in plain language, what the code you just wrote actually does and why it's structured that way, not just that it works. If you can't explain a piece of code back in one sentence, you don't understand it yet, you've just copied it.

One ground rule for the whole week: every provider (STT, LLM, TTS) gets built behind an interface from day one, never called directly. This is the single most important architectural decision in this whole document, explained properly in the section below, because it's what saves you from a rewrite later.

---

## The one big decision: local now, API later, without a rewrite

You're right that going fully local with Ollama will be slower than hosted APIs. Roughly, on a decent laptop CPU (no dedicated GPU), expect an 8B parameter model quantized to 4 bit to give you a time-to-first-token somewhere between 300ms and 2 seconds depending on your hardware, versus 150 to 400ms for a hosted API like Gemini Flash. Local Whisper (via faster-whisper) on CPU can take 1 to 3 seconds to transcribe a 5 second clip. Piper TTS is the one piece that stays fast even locally, usually under 300ms to first audio, because it was built specifically for constrained hardware.

None of that latency gap matters yet. Right now the goal is understanding the pipeline, not winning a speed contest. What matters is that when you do move to hosted APIs, it's a one line config change, not two weeks of rewriting.

The way you get that is the **adapter pattern**: every provider type (STT, LLM, TTS) is defined as an abstract interface, and every concrete provider (Ollama, faster-whisper, Piper, or later Gemini, Deepgram, ElevenLabs) implements that interface. Your application code only ever talks to the interface, never to a specific vendor's SDK directly. This is exactly what LangChain and LiveKit's Agents SDK do internally, you're building a small, honest version of the same pattern that infrastructure companies raise real funding rounds to sell. It's not overengineering for a project this size, it's the single thing that will make day 7 painless instead of miserable.

```
# services/interfaces.py

from abc import ABC, abstractmethod

class STTProvider(ABC):
    @abstractmethod
    async def transcribe(self, audio_bytes: bytes) -> str:
        ...

class LLMProvider(ABC):
    @abstractmethod
    async def generate(self, messages: list[dict]) -> str:
        ...

    @abstractmethod
    async def stream_generate(self, messages: list[dict]):
        ...  # yields tokens as they're generated

class TTSProvider(ABC):
    @abstractmethod
    async def synthesize(self, text: str) -> bytes:
        ...
```

Every day below builds one concrete implementation of one of these. Keep this file open while you work, it's the spine of the whole project.

---

## Tech stack for the week

- **Backend framework: FastAPI (Python).** Async-native, which matters a lot here since you're juggling audio I/O, model inference, and websockets all waiting on each other. Built on Starlette and Pydantic, created by SebastiÃ¡n RamÃ­rez in 2018. It auto-generates interactive API docs from your type hints, which you'll actually use constantly this week to test endpoints without writing a frontend for each one.
- **Local LLM: Ollama**, running Llama 3.1 8B or Gemma 2 9B, whichever runs smoother on your machine. Ollama itself is a wrapper around **llama.cpp**, a project started by Georgi Gerganov specifically because he wanted to run LLaMA inference fast in plain C/C++ on a MacBook, no Python, no GPU required. That one hobby project is the reason "run a real LLM on a laptop" is a normal sentence today.
- **Local STT: faster-whisper.** A reimplementation of OpenAI's Whisper using CTranslate2, roughly 4x faster than the original Whisper repo on the same hardware, same accuracy. Whisper itself was open sourced by OpenAI in 2022, trained on 680,000 hours of multilingual audio scraped from the internet, which is part of why it handles accents so much better than most STT models that came before it.
- **Local TTS: Piper.** Built by Michael Hansen specifically to run in real time on a Raspberry Pi 4, which tells you everything about how lightweight it is. It's the TTS engine behind Home Assistant's local voice assistant.
- **Audio transport: WebSockets** for this build, not WebRTC. WebRTC is the production-grade choice (it's what LiveKit is built on) but it brings a genuinely heavier setup, ICE candidates, STUN/TURN servers, SDP negotiation, and none of that teaches you anything about your actual voice pipeline. WebSockets get you real bidirectional streaming with a fraction of the setup, which is the right trade for a learning-first build.
- **Database: SQLite for now**, via SQLAlchemy as the ORM, with Alembic for migrations. Swappable to Postgres later by changing one connection string, that's the entire point of using an ORM instead of raw SQL from day one.
- **Session state: an in-memory Python dict** to start, explicitly labeled as a thing you will rip out and replace with Redis the moment you deploy anywhere with more than one server process. Called out on Day 5 so it doesn't quietly become permanent.
- **Auth: JWT**, kept deliberately simple, one access token, no refresh token rotation yet. You can harden this later; the goal this week is understanding auth exists as a layer, not building bank-grade security.

---

## Day 1: Project skeleton and the shape of the app

**Concept:** Why does a backend get split into folders like `routers/`, `services/`, `models/`, `core/` instead of one giant `main.py`? Because in six months (or honestly, by Day 5 of this week) you'll have STT logic, LLM logic, TTS logic, database models, and websocket handlers all fighting for space. Separating "the HTTP layer" (routers) from "the business logic" (services) from "the data shape" (models) means you can change how an endpoint is called without touching what it actually does, and vice versa. This is the same reason the adapter pattern above works: separation of concerns isn't a buzzword, it's what stops one change from breaking four unrelated things.

**Fun fact:** FastAPI is used internally by Microsoft, Uber, and Netflix, and it hit that adoption largely because of the auto-generated OpenAPI docs, teams could hand a working API spec to frontend engineers without writing a separate Postman collection by hand.

**Tasks:**
- **YOU BUILD:** the folder structure and `main.py` entrypoint. Type every line yourself here, this is the map you'll be navigating all week.
  ```
  swara-backend/
    app/
      main.py
      core/
        config.py
      routers/
      services/
        interfaces.py
      models/
      db/
    requirements.txt
    .env
  ```
- **YOU BUILD:** a single `GET /health` endpoint that returns `{"status": "ok"}`. Trivial on purpose, this is just to confirm the skeleton actually runs before anything real gets layered on.
- **COPILOT SCAFFOLDS:** a Pydantic Settings class in `core/config.py` that reads `.env` values (provider names, model names, ports). Ask it to explain what `BaseSettings` is doing versus plain `os.environ` calls.

**Before Day 2:** run the server, hit `/health` from your browser or `curl`, and actually read the auto-generated docs at `/docs`. Ask your copilot to explain what Swagger/OpenAPI is and why FastAPI generates it for free.

---

## Day 2: The STT service

**Concept recap:** the three things that make an STT model good are transcription accuracy, streaming vs. batch, and word error rate. Today you're building batch first (simpler), and leaving a clearly marked spot for streaming, since real streaming STT needs a persistent connection, which you'll wire up properly on Day 5 with the websocket.

Audio format matters more than people expect here: speech models expect 16kHz mono PCM audio, not whatever raw format a browser microphone gives you by default. Get this wrong and you'll get garbage transcriptions with no error message telling you why, so it's worth understanding, not just copying a conversion snippet.

**Fun fact:** faster-whisper's 4x speedup over the original Whisper implementation comes from CTranslate2, a inference engine originally built for translation models, repurposed here almost unchanged. A lot of the speed gains in this whole ecosystem come from reusing infra built for a slightly different problem.

**Tasks:**
- **YOU BUILD:** `WhisperSTTProvider`, implementing the `STTProvider` interface from the spine document above. Load the model once at startup (not per request, that's a classic mistake that tanks latency), and implement `transcribe()`.
- **YOU BUILD:** `POST /api/stt/transcribe`, accepting a multipart audio file upload, calling the provider, returning the transcript as JSON.
- **COPILOT SCAFFOLDS:** the multipart file handling boilerplate (reading `UploadFile`, writing to a temp file or in-memory buffer for the model to consume).

**Before Day 3:** record yourself saying something with your phone, upload it through the `/docs` UI, and actually look at what comes back. Deliberately test something with background noise or a mumbled word, and watch the WER problem happen in front of you instead of just reading about it.

---

## Day 3: The LLM service and conversation state

**Concept recap:** for voice specifically, four things matter for an LLM: time-to-first-token, streaming output, context window management, and tool calling. Today you're building the first two properly; context window pruning and tool calling are flagged as later additions once the core loop works, don't let scope creep eat this day.

A voice agent's system prompt is a different animal from a chat app's system prompt. Text on a screen can have bullet points, markdown, long lists. Text that's about to be read aloud by TTS needs to be short, conversational, and free of anything that sounds absurd spoken out loud (nobody wants to hear "asterisk asterisk" or a numbered list read as a monologue). Write your system prompt with that constraint explicit: short sentences, no markdown, no more than two sentences per turn unless asked for more.

**Fun fact:** Ollama exposes a REST API on `localhost:11434` by default, meaning your `OllamaLLMProvider` is really just an HTTP client talking to a process running on the same machine, the exact same shape of code you'll use later when you swap in a real hosted API. That similarity is not an accident, it's the whole reason the adapter pattern works so cleanly here.

**Tasks:**
- **YOU BUILD:** `OllamaLLMProvider`, implementing both `generate()` and `stream_generate()` from the interface. Use Ollama's `/api/chat` endpoint with `"stream": true` for the streaming version, and parse the newline-delimited JSON chunks it returns.
- **YOU BUILD:** a simple `ConversationStore` class, an in-memory dict keyed by `session_id`, storing a list of `{role, content}` messages. Write the method that appends a turn and the method that returns the full history for a session.
- **YOU BUILD:** `POST /api/chat`, accepting `{session_id, message}`, appending to history, calling the LLM provider, returning the reply.
- **COPILOT SCAFFOLDS:** the raw HTTP client setup for talking to Ollama's REST API (this is genuinely boilerplate, `httpx.AsyncClient` calls).

**Before Day 4:** have an actual back-and-forth with your endpoint through `/docs`, at least four turns deep, and check whether the model still remembers turn one by turn four. This is where you'll feel context window limits firsthand instead of reading about them.

---

## Day 4: The TTS service

**Concept recap:** streaming synthesis, naturalness, and voice identity are the three things that decide a good TTS model. Piper is fast enough locally that you can actually test streaming synthesis meaningfully today, rather than faking it.

**Fun fact:** Piper generates audio directly as raw PCM samples, which means you're responsible for wrapping it in a proper WAV header before a browser or audio player will recognize the file, a small but genuinely instructive detail about how little "audio" actually means at the byte level; it's just numbers until something tells the player how to interpret them.

**Tasks:**
- **YOU BUILD:** `PiperTTSProvider`, implementing `synthesize()`, returning raw audio bytes.
- **YOU BUILD:** `POST /api/tts/synthesize`, accepting `{text}`, returning an audio file response with the correct `Content-Type` header (`audio/wav`).
- **COPILOT SCAFFOLDS:** the WAV header writing utility, this is a genuinely fiddly binary format detail worth understanding conceptually but not worth hand-typing byte offsets for.

**Before Day 5:** send a few sentences of different lengths through the endpoint and actually listen to the output. Try one sentence with a question mark, one with an exclamation point, and notice (or don't) whether Piper's prosody actually reacts to punctuation. This is where the "naturalness" definition from Day 1 stops being theoretical.

---

## Day 5: Wiring the full pipeline together

**Concept recap:** this is the day everything from the sequential vs. streaming pipeline discussion becomes real code, not a diagram. You're building the orchestrator that ties STT into LLM into TTS, live, over a single connection, plus a first pass at turn detection so the agent knows when to actually respond.

**Fun fact:** the VAD library you'll likely reach for here, `webrtcvad`, is a Python binding around Google's own voice activity detector from the original WebRTC project, over a decade old at this point and still the default choice in most hobbyist voice projects, because it's tiny, fast, and good enough. Not everything in this space needs to be a transformer model.

**Tasks:**
- **YOU BUILD:** `WS /ws/voice/{session_id}`, a websocket endpoint that accepts incoming audio chunks from the client, buffers them, runs a simple silence-based VAD check (energy threshold or `webrtcvad`) to detect when the caller has stopped talking, then runs the buffered audio through STT, feeds the transcript into the LLM provider, and streams the reply text into TTS, sending audio chunks back over the same socket as they're generated.
- **YOU BUILD:** the `VoiceSession` class that holds this orchestration logic, this is the most important file in the whole project, and the one place all three services actually meet.
- **COPILOT SCAFFOLDS:** the websocket connection manager boilerplate (accepting connections, tracking active sessions, handling disconnects cleanly).

Flag explicitly here: your first working version will very likely run sequentially (wait for full STT, then full LLM reply, then full TTS) even though the interfaces support streaming. That's fine, and expected. Get it working end to end first, then go back and make each stage actually stream once the full loop works once. Trying to build streaming and correctness at the same time on Day 5 is how projects stall out.

**Before Day 6:** have one full, real, spoken exchange with your own agent over the websocket, even if it takes 3 or 4 seconds to reply. That round trip working at all, out loud, is the actual milestone this whole week has been building toward.

---

## Day 6: Persistence, agent config, and auth

**Concept recap:** right now your "agent" is just a hardcoded system prompt in code. Today it becomes something a user could actually configure, a name, a system prompt, a voice, stored in a real database instead of a variable.

**Fun fact:** Alembic, the migration tool you'll use alongside SQLAlchemy, is named after the alembic, the distillation apparatus alchemists used to purify substances, a genuinely on-the-nose name for a tool whose entire job is taking a messy database schema history and distilling it into a clean, repeatable set of steps.

**Tasks:**
- **YOU BUILD:** the SQLAlchemy models: `User`, `Agent` (name, system_prompt, voice_id, owner_id), `CallLog` (session_id, transcript, created_at). Think through the relationships yourself (one user has many agents, one agent has many call logs) before you let anything scaffold the code.
- **YOU BUILD:** `POST /api/agents`, `GET /api/agents/{id}`, `PATCH /api/agents/{id}`, real CRUD, using Pydantic schemas to validate input separately from the SQLAlchemy models (this separation is deliberate, ask your copilot why request schemas and DB models are usually kept as two different classes even when they look similar).
- **YOU BUILD:** basic JWT auth, a login endpoint that issues a token, and a dependency that protects the agent endpoints above.
- **COPILOT SCAFFOLDS:** the Alembic init and migration boilerplate, and the JWT encode/decode utility functions (these are close to identical across every FastAPI project and not worth hand-deriving).

**Before Day 7:** run an actual migration (`alembic revision --autogenerate`, then `alembic upgrade head`), and open the resulting SQLite file in a DB viewer to see your tables sitting there. Seeing the schema materialize is worth more than reading about ORMs in the abstract.

---

## Day 7: Provider swapping, observability, and shipping it

**Concept recap:** this is the day the Day 0 architectural decision pays off. Because every provider sits behind an interface, moving from Ollama to Gemini, or from Piper to ElevenLabs, should be a config change and a new class, never a rewrite of your routes or your orchestrator.

**Fun fact:** this exact pattern, provider interfaces selected by config, is functionally what LiveKit's Agents SDK and LangChain's model abstraction layer both sell as core infrastructure. You will have built, in miniature, the same architectural idea that underlies real funded companies in this space.

**Tasks:**
- **YOU BUILD:** a provider factory function, reading `STT_PROVIDER`, `LLM_PROVIDER`, `TTS_PROVIDER` from your `.env`, and returning the right concrete class. Even if you only ever build the local providers this week, structure this so adding `GeminiLLMProvider` later is purely additive.
- **YOU BUILD:** basic per-stage latency logging in your `VoiceSession` orchestrator, timestamp before and after each of STT, LLM, and TTS, logged per session. This is a small taste of the observability discussion from the pipeline article, dropped connections and silent failures are exactly what this kind of logging catches later.
- **COPILOT SCAFFOLDS:** the Dockerfile and docker-compose setup for deployment, and the connection between your Emergent landing page and this backend's API base URL.

**End of week:** you should be able to explain, out loud, without looking at the code, what happens between a caller starting to talk and hearing a reply, which file each step lives in, and what you'd need to change to swap any one piece for a hosted API. If you can do that, this project did its job.

---

## A note for whichever day you're stuck on

If something breaks and you don't understand why, resist the urge to just paste the error into the copilot and accept whatever fix comes back. Ask it to explain the error first, in terms of what your code was trying to do versus what actually happened. The fix matters less than the model of the system you're building in your head as you go, that model is the actual deliverable of this week, the working app is just the byproduct.