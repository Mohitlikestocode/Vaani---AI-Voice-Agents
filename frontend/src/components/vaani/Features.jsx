import { Reveal, Eyebrow } from "./motion";
import { Mandala } from "./Mandala";
import { MessagesSquare, Database, Infinity as InfinityIcon, BarChart3, Code2, Languages } from "lucide-react";

const langs = ["हिन्दी", "தமிழ்", "తెలుగు", "ಕನ್ನಡ"];

export const Features = () => (
  <section id="features" data-testid="features" className="px-6 py-28 md:px-10 md:py-40">
    <div className="mx-auto max-w-[1400px]">
      <Reveal className="mb-16 max-w-2xl">
        <Eyebrow>Platform</Eyebrow>
        <h2 className="mt-5 font-serif text-5xl font-light leading-[1.02] tracking-tight text-vaani-ink md:text-7xl">
          Everything you need. Nothing you don&apos;t.
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[28px] border border-vaani-gold-soft bg-vaani-gold-soft md:grid-cols-6">
        {/* context - large */}
        <Reveal className="md:col-span-4">
          <div className="relative flex h-full flex-col justify-between overflow-hidden bg-vaani-white p-8 md:p-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 opacity-[0.06]">
              <Mandala color="#6E1A1A" spin={false} className="h-full w-full" />
            </div>
            <MessagesSquare className="h-8 w-8 text-vaani-maroon" strokeWidth={1.5} />
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
          <div className="flex h-full flex-col justify-between bg-vaani-white p-8 md:p-12">
            <Database className="h-8 w-8 text-vaani-gold" strokeWidth={1.5} />
            <div className="mt-10">
              <h3 className="font-serif text-2xl font-light text-vaani-ink">Learns from YOUR data</h3>
              <p className="mt-3 text-sm text-vaani-muted">
                Upload your menu, FAQ or price list. Vaani answers from your
                information only — never hallucinates.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="md:col-span-2">
          <div className="flex h-full flex-col justify-between bg-vaani-white p-8 md:p-12">
            <InfinityIcon className="h-8 w-8 text-vaani-maroon" strokeWidth={1.5} />
            <div className="mt-10">
              <h3 className="font-serif text-2xl font-light text-vaani-ink">Always on, never off</h3>
              <p className="mt-3 text-sm text-vaani-muted">
                24/7 availability. Handles 100 simultaneous conversations. Zero
                downtime, zero sick days.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="md:col-span-2">
          <div className="flex h-full flex-col justify-between bg-vaani-white p-8 md:p-12">
            <BarChart3 className="h-8 w-8 text-vaani-gold" strokeWidth={1.5} />
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
          <div className="flex h-full flex-col justify-between bg-vaani-maroon p-8 text-vaani-cream md:p-12">
            <Code2 className="h-8 w-8 text-vaani-gold" strokeWidth={1.5} />
            <div className="mt-10">
              <h3 className="font-serif text-2xl font-light">One-line embed</h3>
              <code className="mt-4 block overflow-x-auto rounded-lg bg-black/25 p-3 font-mono text-[11px] text-vaani-cream/90">
                {'<script src="vaani.app/embed/your-agent"></script>'}
              </code>
              <p className="mt-3 text-sm text-vaani-cream/70">
                Add your voice agent to any website in 10 seconds.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="md:col-span-2">
          <div className="flex h-full flex-col justify-between bg-vaani-white p-8 md:p-12">
            <div className="flex items-center justify-between">
              <Languages className="h-8 w-8 text-vaani-maroon" strokeWidth={1.5} />
              <span className="rounded-full border border-vaani-gold-soft px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-vaani-muted">
                Coming Soon
              </span>
            </div>
            <div className="mt-10">
              <h3 className="font-serif text-2xl font-light text-vaani-ink">Multi-language support</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {langs.map((l) => (
                  <span key={l} className="rounded-full bg-vaani-sand px-3 py-1 text-sm text-vaani-ink">
                    {l}
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
