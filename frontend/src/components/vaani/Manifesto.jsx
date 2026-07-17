import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Reveal, Eyebrow } from "./motion";
import { PenLine, SlidersHorizontal, Rocket } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: PenLine,
    title: "Describe",
    body: "Tell Vaani about your business in plain words — or just drop a link. It reads your menu, hours, services and FAQs in seconds.",
    detail: ["Paste a link or PDF", "Auto-extracts your info"],
  },
  {
    n: "02",
    icon: SlidersHorizontal,
    title: "Customize",
    body: "Choose a personality, languages and AI model — then switch on the integrations your industry needs, from Maps to bookings.",
    detail: ["Friendly · Pro · Energetic", "Maps · Weather · Bookings"],
  },
  {
    n: "03",
    icon: Rocket,
    title: "Go live",
    body: "Publish with a single line of code, share a link, or point your number at Vaani. It starts answering from second one.",
    detail: ["One-line embed", "Live in 60 seconds"],
  },
];

export const Manifesto = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="how-it-works" data-testid="how-it-works" className="px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.03] tracking-tight text-vaani-ink md:text-6xl">
            Three steps. Sixty seconds. Done.
            </h2>
          </div>
          {/* step dots */}
          <div className="flex items-center gap-2" data-testid="how-it-works-dots">
            {steps.map((s, i) => (
              <button
                key={s.n}
                data-testid={`step-dot-${i}`}
                onClick={() => setActive(i)}
                aria-label={`Show step ${s.n}`}
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: active === i ? 32 : 8,
                  backgroundColor: active === i ? "#6E1A1A" : "#E8DCC4",
                }}
              />
            ))}
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => {
            const isActive = active === i;
            return (
              <Reveal key={s.n} delay={i * 0.1}>
                <motion.div
                  data-testid={`step-card-${i}`}
                  animate={{ y: isActive ? -8 : 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex h-full flex-col overflow-hidden rounded-[24px] border p-8 md:p-10 ${
                    isActive
                      ? "border-vaani-ink bg-vaani-ink text-white shadow-[0_35px_70px_-30px_rgba(9,9,11,0.35)]"
                      : "border-vaani-gold-soft bg-vaani-white"
                  }`}
                  style={{
                    transitionProperty: "background-color, border-color, color, box-shadow",
                    transitionDuration: "1400ms",
                    transitionTimingFunction: "ease-in-out",
                  }}
                >
                  {/* progress bar on active */}
                  {isActive && (
                    <motion.span
                      key={`bar-${i}-${active}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="absolute inset-x-0 top-0 h-1 origin-left bg-vaani-gold"
                    />
                  )}

                  <div className="mb-8 flex items-center justify-between">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-[1400ms] ${
                        isActive ? "bg-vaani-cream/15 text-vaani-gold" : "bg-vaani-maroon/10 text-vaani-maroon"
                      }`}
                    >
                      <s.icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <span
                      className={`font-serif text-6xl font-light leading-none transition-colors duration-[1400ms] ${
                        isActive ? "text-vaani-gold" : "text-vaani-gold-soft"
                      }`}
                    >
                      {s.n}
                    </span>
                  </div>

                  <h3
                    className={`font-serif text-3xl font-light transition-colors duration-[1400ms] ${
                      isActive ? "text-vaani-cream" : "text-vaani-maroon"
                    }`}
                  >
                    {s.title}
                  </h3>
                  <p
                    className={`mt-3 flex-1 transition-colors duration-[1400ms] ${
                      isActive ? "text-vaani-cream/80" : "text-vaani-muted"
                    }`}
                  >
                    {s.body}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {s.detail.map((d) => (
                      <span
                        key={d}
                        className={`rounded-full px-3 py-1.5 font-mono text-[11px] transition-colors duration-[1400ms] ${
                          isActive ? "bg-vaani-cream/12 text-vaani-cream/90" : "bg-vaani-sand text-vaani-ink"
                        }`}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
