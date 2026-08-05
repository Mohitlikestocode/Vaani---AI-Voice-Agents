import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Lock } from "lucide-react";

export const Waveform = ({ bars = 28, active = true, color = "#0055FF" }) => (
  <div className="flex h-7 items-center gap-[3px]">
    {Array.from({ length: bars }).map((_, i) => (
      <span
        key={i}
        className="swara-wave-bar w-[3px] rounded-full"
        style={{
          height: "100%",
          background: color,
          animationDelay: `${(i % 7) * 0.09}s`,
          animationDuration: `${0.7 + (i % 5) * 0.12}s`,
          animationPlayState: active ? "running" : "paused",
          opacity: active ? 1 : 0.3,
        }}
      />
    ))}
  </div>
);

// Scripted, looping voice conversation
export const VoiceDemo = ({
  business = "Spice Garden",
  initial = "S",
  url = "Swara.app/agent/spice-garden",
  tag = "Restaurant",
  script = [
    { from: "agent", text: "Welcome to Spice Garden! How can I help you today?" },
    { from: "user", text: "What's your lunch special?" },
    {
      from: "agent",
      text: "Today we have Paneer Butter Masala with Dal & Rice for ₹199 — our most-loved thali. Want to know what's in it?",
    },
  ],
  testId = "voice-demo",
}) => {
  const [visible, setVisible] = useState([]);
  const [listening, setListening] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    const run = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setVisible([]);
      setListening(false);

      let t = 600;
      script.forEach((msg, idx) => {
        if (msg.from === "user") {
          timers.current.push(setTimeout(() => setListening(true), t - 500));
          timers.current.push(setTimeout(() => setListening(false), t));
        }
        timers.current.push(setTimeout(() => setVisible((v) => [...v, idx]), t));
        t += 1400 + msg.text.length * 12;
      });
      timers.current.push(setTimeout(run, t + 2200));
    };
    run();
    return () => timers.current.forEach(clearTimeout);
  }, []);

  return (
    <div
      data-testid={testId}
      className="w-full overflow-hidden rounded-[24px] border border-zinc-200 bg-swara-white shadow-[0_24px_70px_-32px_rgba(9,9,11,0.25)]"
    >
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-zinc-200 bg-swara-sand px-4 py-2.5">
        <Lock className="h-3.5 w-3.5 text-swara-muted" />
        <span className="font-mono text-xs text-swara-muted">{url}</span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-swara-gold/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-swara-gold">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-swara-gold" />
          Live
        </span>
      </div>

      {/* header */}
      <div className="flex items-center gap-3 px-5 pt-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-swara-gold font-display text-base font-semibold text-white">
          {initial}
        </div>
        <div>
          <p className="text-sm font-medium leading-tight text-swara-ink">{business}</p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-swara-muted">
            {tag}
          </p>
        </div>
      </div>

      {/* messages */}
      <div className="flex min-h-[220px] flex-col gap-2.5 px-5 py-5">
        <AnimatePresence>
          {script.map((msg, idx) =>
            visible.includes(idx) ? (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${
                    msg.from === "user"
                      ? "rounded-br-sm bg-swara-ink text-white"
                      : "rounded-bl-sm bg-swara-sand text-swara-ink"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>

      {/* input / listening bar */}
      <div className="flex items-center gap-3 border-t border-zinc-200 px-5 py-3.5">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
            listening ? "bg-swara-gold text-white" : "bg-swara-sand text-swara-muted"
          }`}
        >
          <Mic className="h-4.5 w-4.5" />
        </div>
        {listening ? (
          <div className="flex flex-1 items-center gap-3">
            <Waveform active bars={22} />
            <span className="font-mono text-xs text-swara-gold">Listeningâ€¦</span>
          </div>
        ) : (
          <span className="flex-1 text-[13px] text-swara-muted">Tap to speakâ€¦</span>
        )}
        <span className="font-mono text-[11px] text-swara-muted">0.8s</span>
      </div>
    </div>
  );
};
