import { Check } from "lucide-react";
import { Reveal, Eyebrow } from "./motion";
import { VoiceDemo } from "./VoiceDemo";
import { SoundWave } from "./SoundWave";

const points = [
  "Understands natural speech, accents and follow-ups",
  "Answers only from your business information",
  "Replies in under a second, around the clock",
];

export const SeeItInAction = () => (
  <section
    id="see-it"
    data-testid="see-it-in-action"
    className="relative overflow-hidden bg-swara-ink px-6 py-28 text-white md:px-10 md:py-40"
  >
    <div className="swara-grid pointer-events-none absolute inset-0 opacity-[0.06]" />
    <SoundWave className="pointer-events-none absolute inset-x-0 top-10 h-40" bars={60} color="#0055FF" opacity={0.1} />

    <div className="relative z-10 mx-auto grid max-w-[1400px] items-center gap-16 lg:grid-cols-2">
      <Reveal>
        <Eyebrow light>See it in action</Eyebrow>
        <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
          Press play and hear Swara work.
        </h2>
        <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/70">
          This is Sunrise Café&apos;s agent handling a real conversation — listening,
          thinking, and answering from the café&apos;s own menu and hours. No script,
          no hold music.
        </p>
        <ul className="mt-10 space-y-4">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-swara-gold">
                <Check className="h-3.5 w-3.5 text-white" />
              </span>
              <span className="text-white/85">{p}</span>
            </li>
          ))}
        </ul>
        <a
          href="#pricing"
          data-testid="see-it-cta"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-medium text-swara-ink transition-transform duration-300 hover:-translate-y-0.5"
        >
          Build one for your business â†’
        </a>
      </Reveal>

      <Reveal delay={0.15} className="text-swara-ink">
        <VoiceDemo
          testId="voice-demo-sunrise"
          business="Sunrise Café"
          initial="S"
          url="Swara.app/agent/sunrise-cafe"
          tag="Restaurant · Live demo"
          script={[
            { from: "agent", text: "Good morning! Welcome to Sunrise Café â˜€️ How can I help you today?" },
            { from: "user", text: "Are you open right now, and do you do filter coffee?" },
            { from: "agent", text: "We're open till 10 PM today, and yes — our South Indian filter coffee is a house favourite at ₹60. Shall I hold a table for you?" },
          ]}
        />
      </Reveal>
    </div>
  </section>
);
