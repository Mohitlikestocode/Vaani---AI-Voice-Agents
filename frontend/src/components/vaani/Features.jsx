import { Reveal, Eyebrow } from "./motion";
import { SoundWave } from "./SoundWave";
import {
  MessagesSquare,
  Database,
  Infinity as InfinityIcon,
  BarChart3,
  Code2,
  Languages,
  PhoneForwarded,
} from "lucide-react";

const langs = ["हिन्दी", "தமிழ்", "తెలుగు", "ಕನ್ನಡ"];

export const Features = () => (
  <section id="features" data-testid="features" className="px-6 py-28 md:px-10 md:py-40">
    <div className="mx-auto max-w-[1400px]">
      <Reveal className="mb-16 max-w-2xl">
        <Eyebrow>Platform</Eyebrow>
        <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.03] tracking-tight text-vaani-ink md:text-6xl">
          Everything you need. Nothing you don&apos;t.
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[28px] border border-vaani-gold-soft bg-vaani-gold-soft md:grid-cols-6">
        {/* Row 1 — context (4) + data (2) */}
        <Reveal className="md:col-span-4">
          <div className="group relative flex h-full flex-col justify-between overflow-hidden bg-vaani-white p-8 transition-colors duration-500 hover:bg-vaani-sand md:p-12">
            <div className="vaani-grid pointer-events-none absolute inset-0 opacity-[0.5]" />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-vaani-maroon/10">
              <MessagesSquare className="h-6 w-6 text-vaani-maroon" strokeWidth={1.5} />
            </div>
            <div className="mt-10">
              <h3 className="font-serif text-3xl font-light text-vaani-ink md:text-4xl">
                Conversations that understand context
              </h3>
              <p className="mt-4 max-w-xl text-vaani-muted">
                Your agent follows the thread, handles follow-ups, asks clarifying
                questions, and knows when to hand off. Not a phone tree — a real
                conversation.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="md:col-span-2">
          <div className="flex h-full flex-col justify-between bg-vaani-white p-8 transition-colors duration-500 hover:bg-vaani-cream md:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-vaani-gold/20">
              <Database className="h-6 w-6 text-vaani-gold" strokeWidth={1.5} />
            </div>
            <div className="mt-10">
              <h3 className="font-serif text-2xl font-light text-vaani-ink">Learns from YOUR data</h3>
              <p className="mt-3 text-sm text-vaani-muted">
                Upload your menu, FAQ or price list. Vaani answers from your
                information only — never hallucinates.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Row 2 — always-on (GOLD, 2) + analytics (2) + embed (MAROON, 2) */}
        <Reveal delay={0.05} className="md:col-span-2">
          <div className="flex h-full flex-col justify-between bg-vaani-gold p-8 text-white md:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <InfinityIcon className="h-6 w-6 text-white" strokeWidth={1.75} />
            </div>
            <div className="mt-10">
              <h3 className="font-serif text-2xl font-light">Always on, never off</h3>
              <p className="mt-3 text-sm text-white/80">
                24/7 availability. Handles 100 simultaneous conversations. Zero
                downtime, zero sick days.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="md:col-span-2">
          <div className="flex h-full flex-col justify-between bg-vaani-white p-8 transition-colors duration-500 hover:bg-vaani-cream md:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-vaani-gold/20">
              <BarChart3 className="h-6 w-6 text-vaani-gold" strokeWidth={1.5} />
            </div>
            <div className="mt-10">
              <h3 className="font-serif text-2xl font-light text-vaani-ink">Analytics dashboard</h3>
              <p className="mt-3 text-sm text-vaani-muted">
                See every conversation, track popular questions, and improve your
                agent over time.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="md:col-span-2">
          <div className="relative flex h-full flex-col justify-between overflow-hidden bg-vaani-ink p-8 text-white md:p-10">
            <SoundWave className="pointer-events-none absolute inset-x-0 bottom-0 h-16" bars={30} color="#0055FF" opacity={0.18} />
            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Code2 className="h-6 w-6 text-vaani-gold" strokeWidth={1.5} />
            </div>
            <div className="relative z-10 mt-10">
              <h3 className="font-serif text-2xl font-light">One-line embed</h3>
              <code className="mt-4 block overflow-x-auto rounded-lg bg-black/40 p-3 font-mono text-[11px] text-white/90">
                {'<script src="vaani.app/embed/you"></script>'}
              </code>
              <p className="mt-3 text-sm text-white/70">
                Add your voice agent to any website in 10 seconds.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Row 3 — multi-language (3) + human handoff (3) */}
        <Reveal delay={0.05} className="md:col-span-3">
          <div className="flex h-full flex-col justify-between bg-vaani-sand p-8 md:p-10">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-vaani-maroon/10">
                <Languages className="h-6 w-6 text-vaani-maroon" strokeWidth={1.5} />
              </div>
              <span className="rounded-full border border-vaani-gold px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-vaani-gold">
                Coming Soon
              </span>
            </div>
            <div className="mt-10">
              <h3 className="font-serif text-2xl font-light text-vaani-ink">
                Speaks your customer&apos;s language
              </h3>
              <p className="mt-3 max-w-md text-sm text-vaani-muted">
                Hindi, Tamil, Telugu, Kannada and more — your agent answers in the
                language your customer is most comfortable in.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {langs.map((l) => (
                  <span
                    key={l}
                    className="rounded-full border border-vaani-gold-soft bg-vaani-white px-3 py-1 text-sm text-vaani-ink"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="md:col-span-3">
          <div className="flex h-full flex-col justify-between bg-vaani-white p-8 transition-colors duration-500 hover:bg-vaani-cream md:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-vaani-gold/20">
              <PhoneForwarded className="h-6 w-6 text-vaani-gold" strokeWidth={1.5} />
            </div>
            <div className="mt-10">
              <h3 className="font-serif text-2xl font-light text-vaani-ink">
                Seamless human handoff
              </h3>
              <p className="mt-3 max-w-md text-sm text-vaani-muted">
                When a question needs a human touch, Vaani captures the details and
                transfers to your team — with the full conversation, so nobody
                repeats themselves.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Live transfer", "Call summaries", "WhatsApp alerts"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-vaani-sand px-3 py-1 font-mono text-[11px] text-vaani-ink"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
