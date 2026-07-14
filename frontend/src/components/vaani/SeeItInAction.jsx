import { Check } from "lucide-react";
import { Reveal, Eyebrow } from "./motion";
import { VoiceDemo } from "./VoiceDemo";
import { Mandala } from "./Mandala";

const points = [
  "Understands natural speech, accents and follow-ups",
  "Answers only from your business information",
  "Replies in under a second, around the clock",
];

export const SeeItInAction = () => (
  <section
    id="see-it"
    data-testid="see-it-in-action"
    className="relative overflow-hidden bg-vaani-maroon px-6 py-28 text-vaani-cream md:px-10 md:py-40"
  >
    <div className="pointer-events-none absolute -right-[15%] -top-[20%] h-[700px] w-[700px] opacity-[0.08]">
      <Mandala color="#E8DCC4" strokeWidth={1.2} duration={140} className="h-full w-full" />
    </div>

    <div className="relative z-10 mx-auto grid max-w-[1400px] items-center gap-16 lg:grid-cols-2">
      <Reveal>
        <Eyebrow light>See it in action</Eyebrow>
        <h2 className="mt-5 font-serif text-5xl font-light leading-[1.02] tracking-tight md:text-7xl">
          Press play and hear Vaani work.
        </h2>
        <p className="mt-8 max-w-lg text-lg leading-relaxed text-vaani-cream/70">
          This is Sunrise Café&apos;s agent handling a real conversation — listening,
          thinking, and answering from the café&apos;s own menu and hours. No script,
          no hold music.
        </p>
        <ul className="mt-10 space-y-4">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-vaani-gold">
                <Check className="h-3.5 w-3.5 text-vaani-maroon" />
              </span>
              <span className="text-vaani-cream/85">{p}</span>
            </li>
          ))}
        </ul>
        <a
          href="#pricing"
          data-testid="see-it-cta"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-vaani-cream px-7 py-4 text-sm font-medium text-vaani-maroon transition-transform duration-300 hover:-translate-y-0.5"
        >
          Build one for your business →
        </a>
      </Reveal>

      <Reveal delay={0.15} className="text-vaani-ink">
        <VoiceDemo
          testId="voice-demo-sunrise"
          business="Sunrise Café"
          initial="S"
          url="vaani.app/agent/sunrise-cafe"
          tag="Restaurant · Live demo"
          script={[
            { from: "agent", text: "Good morning! Welcome to Sunrise Café ☀️ How can I help you today?" },
            { from: "user", text: "Are you open right now, and do you do filter coffee?" },
            { from: "agent", text: "We're open till 10 PM today, and yes — our South Indian filter coffee is a house favourite at ₹60. Shall I hold a table for you?" },
          ]}
        />
      </Reveal>
    </div>
  </section>
);
