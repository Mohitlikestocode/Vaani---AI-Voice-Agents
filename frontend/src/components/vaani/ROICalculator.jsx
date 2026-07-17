import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Reveal, Eyebrow } from "./motion";
import { SoundWave } from "./SoundWave";

const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

export const ROICalculator = () => {
  const [calls, setCalls] = useState(80);
  const [value, setValue] = useState(450);
  const [missed, setMissed] = useState(28);

  const missedPerDay = calls * (missed / 100);
  const recoveredPerMonth = missedPerDay * 30;
  const revenue = missedPerDay * value * 30;

  const controls = [
    { id: "calls", label: "Calls received per day", value: calls, display: `${calls} calls / day`, min: 10, max: 500, step: 5, set: setCalls },
    { id: "value", label: "Average order / booking value", value: value, display: inr(value), min: 50, max: 5000, step: 50, set: setValue },
    { id: "missed", label: "Calls you miss today", value: missed, display: `${missed}% missed`, min: 5, max: 60, step: 1, set: setMissed },
  ];

  return (
    <section id="roi" data-testid="roi-calculator" className="px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-16 max-w-3xl">
          <Eyebrow>Return on investment</Eyebrow>
          <h2 className="mt-5 font-serif text-5xl font-light leading-[1.02] tracking-tight text-vaani-ink md:text-7xl">
            Every missed call is money walking away.
          </h2>
          <p className="mt-6 max-w-xl text-lg text-vaani-muted">
            Drag the sliders to match your business. See what Vaani recovers by
            answering the calls you&apos;re missing today.
          </p>
        </Reveal>

        <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="space-y-12">
            {controls.map((c) => (
              <div key={c.id}>
                <div className="mb-4 flex items-end justify-between">
                  <label className="text-sm text-vaani-muted">{c.label}</label>
                  <span className="font-mono text-2xl font-semibold text-vaani-ink">{c.display}</span>
                </div>
                <Slider
                  data-testid={`roi-slider-${c.id}`}
                  aria-label={c.label}
                  value={[c.value]}
                  min={c.min}
                  max={c.max}
                  step={c.step}
                  onValueChange={(v) => c.set(v[0])}
                  className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5"
                />
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-[28px] bg-vaani-ink p-10 text-white md:p-14">
              <div className="vaani-grid pointer-events-none absolute inset-0 opacity-[0.06]" />
              <SoundWave className="pointer-events-none absolute inset-x-0 bottom-0 h-24" bars={44} color="#0055FF" opacity={0.14} />
              <div className="relative z-10">
                <p className="font-mono text-xs uppercase tracking-widest text-white/60">
                  Recovered every month
                </p>
                <motion.p
                  key={Math.round(revenue)}
                  initial={{ opacity: 0.4, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  data-testid="roi-revenue"
                  className="mt-3 font-display text-6xl font-semibold leading-none tracking-tight md:text-8xl"
                >
                  {inr(revenue)}
                </motion.p>
                <p className="mt-4 text-white/70">in revenue Vaani would have saved you.</p>

                <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/15 pt-8">
                  <div>
                    <p className="font-display text-4xl font-semibold text-vaani-gold" data-testid="roi-calls-day">
                      {Math.round(missedPerDay)}
                    </p>
                    <p className="mt-1 text-sm text-white/60">calls/day answered, not missed</p>
                  </div>
                  <div>
                    <p className="font-display text-4xl font-semibold text-vaani-gold" data-testid="roi-recovered">
                      {Math.round(recoveredPerMonth)}
                    </p>
                    <p className="mt-1 text-sm text-white/60">calls recovered / month</p>
                  </div>
                </div>

                <a
                  href="#pricing"
                  data-testid="roi-cta"
                  className="group mt-10 inline-flex items-center gap-2 rounded-full bg-vaani-gold px-7 py-4 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Start saving with Vaani
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
        <p className="mt-8 font-mono text-xs text-vaani-muted">
          Estimate based on recovered calls × average value × 30 days. Most
          businesses miss 20–40% of calls at peak hours.
        </p>
      </div>
    </section>
  );
};
