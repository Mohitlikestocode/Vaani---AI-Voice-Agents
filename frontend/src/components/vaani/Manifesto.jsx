import { Reveal, Eyebrow } from "./motion";

const steps = [
  {
    n: "01",
    title: "Describe",
    body: "Tell Vaani about your business in plain words — or drop a link. It reads your menu, hours, services and FAQs, then builds an agent that actually knows you.",
    detail: ["Paste a website or upload a PDF", "Auto-extracts hours, pricing & FAQs"],
  },
  {
    n: "02",
    title: "Customize",
    body: "Choose a personality, languages and AI model — then switch on the integrations your industry needs, from Google Maps to bookings.",
    detail: ["Friendly · Pro · Energetic", "Google Maps · Weather · Bookings"],
  },
  {
    n: "03",
    title: "Go live",
    body: "Publish with a single line of code, share a link, or point your number at Vaani. Your agent answers every call from the first second.",
    detail: ["One-line embed script", "Live in under 60 seconds"],
  },
];

export const Manifesto = () => (
  <section
    id="how-it-works"
    data-testid="how-it-works"
    className="px-6 py-28 md:px-10 md:py-40"
  >
    <div className="mx-auto max-w-[1400px]">
      <Reveal className="mb-20 max-w-2xl">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mt-5 font-serif text-5xl font-light leading-[1.02] tracking-tight text-vaani-ink md:text-7xl">
          Three steps. Sixty seconds. Done.
        </h2>
      </Reveal>

      <div className="flex flex-col">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.05}>
            <div className="grid grid-cols-1 gap-6 border-t border-vaani-ink/10 py-12 md:grid-cols-[0.4fr_0.6fr] md:gap-16 md:py-16">
              <div className="flex items-baseline gap-6">
                <span className="font-mono text-6xl font-light text-vaani-terracotta md:text-8xl">
                  {s.n}
                </span>
                <h3 className="font-serif text-4xl font-light text-vaani-ink md:text-5xl">
                  {s.title}
                </h3>
              </div>
              <div className="md:pt-4">
                <p className="max-w-xl text-lg leading-relaxed text-vaani-muted">
                  {s.body}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {s.detail.map((d) => (
                    <span
                      key={d}
                      className="rounded-full border border-vaani-ink/15 bg-vaani-surface px-4 py-1.5 font-mono text-xs text-vaani-ink"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
