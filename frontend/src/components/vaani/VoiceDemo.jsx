import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Lock } from "lucide-react";

export const Waveform = ({ bars = 28, active = true, color = "#D94F36" }) => (
  <div className="flex h-8 items-center gap-[3px]">
    {Array.from({ length: bars }).map((_, i) => (
      <span
        key={i}
        className="vaani-wave-bar w-[3px] rounded-full"
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
  url = "vaani.app/agent/spice-garden",
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
          timers.current.push(
            setTimeout(() => setListening(true), t - 500)
          );
          timers.current.push(
            setTimeout(() => setListening(false), t)
          );
        }
        timers.current.push(
          setTimeout(() => setVisible((v) => [...v, idx]), t)
        );
        t += 1400 + msg.text.length * 12;
      });
      // restart loop
      timers.current.push(setTimeout(run, t + 2200));
    };
    run();
    return () => timers.current.forEach(clearTimeout);
  }, []);

  return (
    <div
      data-testid={testId}
      className="w-full overflow-hidden rounded-[28px] border border-vaani-ink/10 bg-vaani-surface shadow-[0_30px_80px_-20px_rgba(17,17,17,0.25)]"
    >
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-vaani-ink/10 bg-vaani-alt/50 px-5 py-3">
        <Lock className="h-3.5 w-3.5 text-vaani-muted" />
        <span className="font-mono text-xs text-vaani-muted">{url}</span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-vaani-forest/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-vaani-forest">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-vaani-forest" />
          Live
        </span>
      </div>

      {/* header */}
      <div className="flex items-center gap-3 px-6 pt-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-vaani-terracotta font-serif text-xl text-vaani-bg">
          {initial}
        </div>
        <div>
          <p className="font-medium leading-tight text-vaani-ink">{business}</p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-vaani-muted">
            {tag}
          </p>
        </div>
      </div>

      {/* messages */}
      <div className="flex min-h-[260px] flex-col gap-3 px-6 py-6">
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
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.from === "user"
                      ? "rounded-br-sm bg-vaani-ink text-vaani-bg"
                      : "rounded-bl-sm bg-vaani-alt text-vaani-ink"
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
      <div className="flex items-center gap-3 border-t border-vaani-ink/10 px-6 py-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
            listening ? "bg-vaani-terracotta text-vaani-bg" : "bg-vaani-alt text-vaani-muted"
          }`}
        >
          <Mic className="h-5 w-5" />
        </div>
        {listening ? (
          <div className="flex flex-1 items-center gap-3">
            <Waveform active bars={22} />
            <span className="font-mono text-xs text-vaani-terracotta">Listening…</span>
          </div>
        ) : (
          <span className="flex-1 text-sm text-vaani-muted">Tap to speak…</span>
        )}
        <span className="font-mono text-[11px] text-vaani-muted">0.8s</span>
      </div>
    </div>
  );
};
