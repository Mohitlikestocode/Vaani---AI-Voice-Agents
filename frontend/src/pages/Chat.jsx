// Chat page — handles text chat AND voice calls with the AI agent.
// Voice uses browser-native APIs: Web Speech API (STT) + SpeechSynthesis (TTS).
// No external voice services — everything runs client-side in Chrome.

import { useState, useEffect, useRef } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Send, ArrowLeft, Bot, User, Settings, Mic, MicOff, Volume2, Phone, PhoneOff } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";

export default function Chat() {
  const { agentId } = useParams();
  const [searchParams] = useSearchParams();
  const isEmbed = searchParams.get("embed") === "true";
  const isAdmin = searchParams.get("admin") === "true";
  const [agent, setAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [inCall, setInCall] = useState(false);
  const [callStatus, setCallStatus] = useState("");
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);
  const inCallRef = useRef(false);

  // On page load: fetch agent details from backend to show greeting + business name
  useEffect(() => {
    fetch(`${API}/api/agents/${agentId}`)
      .then((r) => r.json())
      .then((data) => {
        setAgent(data);
        // Show the agent's greeting as the first message
        setMessages([{ role: "agent", text: data.greeting }]);
      })
      .catch(() => alert("Could not load agent. Is the backend running?"));
  }, [agentId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a typed message — called when user presses Enter or clicks Send button
  const sendMessage = async () => {
    const userMsg = input.trim();
    if (!userMsg || sendingRef.current) return;
    setInput("");
    doSend(userMsg);
  };

  // Toggle voice call on/off. Pausing doesn't reset conversation — user can resume.
  const toggleCall = async () => {
    if (inCallRef.current) {
      // Pause call (don't reset conversation)
      inCallRef.current = false;
      setInCall(false);
      setListening(false);
      setCallStatus("");
      try { recognitionRef.current?.stop(); } catch {}
      window.speechSynthesis?.cancel();
    } else {
      inCallRef.current = true;
      setInCall(true);
      setVoiceEnabled(true);
      startCallRecognition();
    }
  };

  // STT: Start browser's built-in Speech Recognition (Web Speech API).
  // Creates ONE persistent instance for the entire call. Mic stays open.
  // After 2.5s of silence, auto-sends whatever was heard.
  const startCallRecognition = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition; // Browser-native STT
    if (!SR) { alert("Use Chrome for voice."); return; }

    const rec = new SR();
    rec.lang = "en-IN";
    rec.interimResults = true;
    rec.continuous = true;
    recognitionRef.current = rec;

    let currentText = "";
    let silenceTimer = null;
    let isSending = false;

    setCallStatus("🎤 Listening... (speak now)");
    setListening(true);

    rec.onresult = (e) => {
      if (isSending) return; // ignore audio while processing/speaking

      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      currentText = transcript;
      setInput(currentText);
      setCallStatus("🎤 " + currentText);

      // After 2.5s of silence, send
      clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        if (currentText.trim() && !isSending) {
          isSending = true;
          const textToSend = currentText.trim();
          currentText = "";
          setInput("");
          doSendAndSpeak(textToSend, () => {
            isSending = false;
            setCallStatus("🎤 Listening... (speak now)");
          });
        }
      }, 2500);
    };

    rec.onerror = (e) => {
      if (e.error === "not-allowed") {
        setCallStatus("❌ Mic blocked — allow in browser settings");
        return;
      }
      // Auto-restart on any other error
      if (inCallRef.current) {
        setTimeout(() => {
          try { rec.start(); } catch {}
        }, 500);
      }
    };

    rec.onend = () => {
      // continuous=true shouldn't end, but if it does, restart
      if (inCallRef.current) {
        setTimeout(() => {
          try { rec.start(); } catch {}
        }, 300);
      }
    };

    rec.start();
  };

  // Send user's speech to backend, get AI reply, then speak it aloud using TTS.
  // onDone callback resumes the mic after speaking finishes.
  const doSendAndSpeak = async (text, onDone) => {
    setCallStatus("⏳ Thinking...");
    setSending(true);
    sendingRef.current = true;
    setMessages((prev) => [...prev, { role: "user", text }]);

    try {
      const res = await fetch(`${API}/api/agents/${agentId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "agent", text: data.reply }]);
      setCallStatus("🔊 Speaking...");

      // TTS: Browser-native SpeechSynthesis API — speaks the AI reply out loud
      const utterance = new SpeechSynthesisUtterance(data.reply);
      let done = false;
      const finish = () => { if (!done) { done = true; onDone(); } };
      utterance.onend = finish;
      setTimeout(finish, Math.max(data.reply.length * 80, 2000));
      window.speechSynthesis.speak(utterance);
    } catch {
      setMessages((prev) => [...prev, { role: "agent", text: "Couldn't reach server." }]);
      setCallStatus("❌ Server error");
      onDone();
    }
    setSending(false);
    sendingRef.current = false;
  };

  if (!agent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-swara-cream font-sans">
        <p className="text-swara-muted">Loading agent...</p>
      </div>
    );
  }

  return (
    <div className={`flex h-screen flex-col font-sans ${isEmbed ? "bg-white" : "bg-swara-cream"}`}>
      {/* Header — hidden in embed mode */}
      {!isEmbed && (
        <header className="flex items-center gap-4 border-b border-zinc-200 bg-white px-6 py-4">
          <Link to="/" className="text-swara-muted hover:text-swara-ink">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex flex-1 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-swara-gold text-white">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-swara-ink">
                {agent.business_name}
              </p>
              <p className="text-xs text-swara-muted">Swara AI Agent</p>
            </div>
          </div>
          {isAdmin && (
            <Link
              to={`/admin/${agentId}`}
              className="flex items-center gap-1.5 rounded-full border border-zinc-200 px-4 py-2 text-sm text-swara-muted hover:bg-zinc-50 hover:text-swara-ink"
            >
              <Settings className="h-4 w-4" /> Admin
            </Link>
          )}
        </header>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  msg.role === "user"
                    ? "bg-swara-ink text-white"
                    : "bg-swara-gold text-white"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-swara-ink text-white"
                    : "border border-zinc-200 bg-white text-swara-ink"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-swara-gold text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-swara-muted">
                Typing...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-zinc-200 bg-white px-6 py-4">
        {/* Call status — shows exactly what's happening */}
        {inCall && callStatus && (
          <div className="mx-auto mb-3 max-w-2xl rounded-lg bg-zinc-100 px-4 py-2 text-center text-sm font-medium text-swara-ink">
            {callStatus}
          </div>
        )}
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          {/* Call button — start/end continuous voice conversation */}
          <button
            type="button"
            onClick={toggleCall}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all ${
              inCall
                ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                : "bg-green-500 text-white shadow-lg shadow-green-500/30"
            }`}
            title={inCall ? "End call" : "Start voice call"}
          >
            {inCall ? <PhoneOff className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
          </button>

          {/* Text input — still works alongside voice */}
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex flex-1 gap-2"
          >
            <input
              className="flex-1 rounded-full border border-zinc-200 px-5 py-3 text-sm focus:border-swara-gold focus:outline-none focus:ring-2 focus:ring-swara-gold/20"
              placeholder={inCall ? "In call — speak or type..." : "Type or start a call..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-swara-gold text-white transition-opacity disabled:opacity-40"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
