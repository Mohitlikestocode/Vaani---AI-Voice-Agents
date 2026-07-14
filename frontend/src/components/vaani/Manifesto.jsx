import { Reveal, Eyebrow } from "./motion";
import { PenLine, SlidersHorizontal, Rocket } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: PenLine,
    title: "Describe",
    body: "Tell Vaani about your business in plain words — or just drop a link. It reads your menu, hours, services and FAQs.",
    detail: ["Paste a link or PDF", "Auto-extracts your info"],
  },
  {
    n: "02",
    icon: SlidersHorizontal,
    title: "Customize",
    body: "Choose a personality, languages and AI model — then switch on the integrations your industry needs.",
    detail: ["Friendly · Pro · Energetic", "Maps · Weather · Bookings"],
  },
  {
    n: "03",
    icon: Rocket,
    title: "Go live",
    body: "Publish with a single line of code, share a link, or point your number at Vaani. It answers from second one.",
    detail: ["One-line embed", "Live in 60 seconds"],
  },
];

export const Manifesto = () => (
  <section id="how-it-works" data-testid="how-it-works" className="px-6 py-28 md:px-10 md:py-40">
    <div className="mx-auto max-w-[1400px]">
      <Reveal className="mb-16 max-w-2xl">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mt-5 font-serif text-5xl font-light leading-[1.02] tracking-tight text-vaani-ink md:text-7xl">
          Three steps. Sixty seconds. Done.
        </h2>
      </Reveal>

      <div className="relative grid gap-6 md:grid-cols-3">
        {/* connecting line */}
        <div className="pointer-events-none absolute left-0 right-0 top-[92px] hidden h-px bg-vaani-gold-soft md:block" />

        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.12}>
            <div
              data-testid={`step-card-${i}`}
              className="group relative flex h-full flex-col rounded-[24px] border border-vaani-gold-soft bg-vaani-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-vaani-maroon/30 hover:shadow-[0_30px_60px_-30px_rgba(110,26,26,0.35)] md:p-10"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-vaani-maroon/10 text-vaani-maroon transition-colors duration-300 group-hover:bg-vaani-maroon group-hover:text-vaani-cream">
                  <s.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="font-serif text-6xl font-light leading-none text-vaani-gold-soft transition-colors duration-300 group-hover:text-vaani-gold">
                  {s.n}
                </span>
              </div>
              <h3 className="font-serif text-3xl font-light text-vaani-maroon">{s.title}</h3>
              <p className="mt-3 flex-1 text-vaani-muted">{s.body}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {s.detail.map((d) => (
                  <span
                    key={d}
                    className="rounded-full bg-vaani-sand px-3 py-1.5 font-mono text-[11px] text-vaani-ink"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
