import { useState, useEffect } from "react";
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from "framer-motion";
import { Check, ArrowUpRight, Sparkles } from "lucide-react";
import { Reveal, Eyebrow } from "./motion";

const billing = [
  { id: "monthly", label: "Monthly", mult: 1, save: 0, term: "billed monthly", months: 1 },
  { id: "sixmo", label: "6 months", mult: 0.9, save: 10, term: "billed every 6 months", months: 6 },
  { id: "annual", label: "Annual", mult: 0.8, save: 20, term: "billed yearly", months: 12 },
];

const tiers = [
  {
    name: "Free",
    base: 0,
    suffix: "forever",
    tagline: "To try Vaani with one agent.",
    cta: "Get started free",
    accent: "gold",
    features: ["50 conversations / month", "1 agent", "Community support", "Vaani branding on agent", "Browser voices (Web Speech)"],
  },
  {
    name: "Pro",
    base: 1999,
    suffix: "/mo",
    tagline: "For growing local businesses.",
    cta: "Start 14-day free trial",
    highlight: true,
    accent: "cream",
    plus: "EVERYTHING IN FREE, PLUS",
    features: ["500 conversations / month", "5 agents", "Email support", "Remove Vaani branding", "Custom greeting & instructions", "Analytics dashboard", "Priority AI model"],
  },
  {
    name: "Business",
    base: 6999,
    suffix: "/mo",
    tagline: "For multi-location & scale.",
    cta: "Talk to sales",
    accent: "maroon",
    plus: "EVERYTHING IN PRO, PLUS",
    features: ["Unlimited conversations", "Unlimited agents", "Dedicated support", "API access", "Custom domain", "Webhook integrations", "Premium AI voices (soon)"],
  },
];

const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

// Rapidly counts from previous value to the new value for a satisfying price-drop effect
const AnimatedRupee = ({ value, className, testId }) => {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => inr(v));
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.6, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [value, mv]);
  return (
    <motion.span data-testid={testId} className={className}>
      {text}
    </motion.span>
  );
};

export const Pricing = () => {
  const [cycle, setCycle] = useState(billing[0]);

  return (
    <section id="pricing" data-testid="pricing" className="bg-vaani-sand px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-12 text-center">
          <div className="flex justify-center"><Eyebrow>Pricing</Eyebrow></div>
          <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.03] tracking-tight text-vaani-ink md:text-6xl">
            One agent pays for itself in a day.
          </h2>
          <p className="mt-6 text-vaani-muted">Start free. Commit to a longer term and watch your monthly price drop.</p>
        </Reveal>

        {/* Toggle */}
        <Reveal className="mb-16 flex flex-col items-center gap-3">
          <div data-testid="billing-toggle" className="inline-flex rounded-full border border-zinc-200 bg-vaani-white p-1.5 shadow-sm">
            {billing.map((b) => (
              <button
                key={b.id}
                data-testid={`billing-${b.id}`}
                onClick={() => setCycle(b)}
                className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-colors md:px-6 ${
                  cycle.id === b.id ? "text-white" : "text-vaani-muted hover:text-vaani-ink"
                }`}
              >
                {cycle.id === b.id && (
                  <motion.span
                    layoutId="billing-pill"
                    className="absolute inset-0 rounded-full bg-vaani-ink"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{b.label}</span>
                {b.save > 0 && (
                  <span
                    className={`relative z-10 rounded-full px-2 py-0.5 font-mono text-[10px] ${
                      cycle.id === b.id ? "bg-vaani-gold text-white" : "bg-vaani-gold/10 text-vaani-gold"
                    }`}
                  >
                    −{b.save}%
                  </span>
                )}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {cycle.save > 0 && (
              <motion.p
                key={cycle.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-1.5 font-mono text-xs text-vaani-gold"
              >
                <Sparkles className="h-3.5 w-3.5 text-vaani-gold" />
                You&apos;re saving {cycle.save}% with {cycle.label.toLowerCase()} billing
              </motion.p>
            )}
          </AnimatePresence>
        </Reveal>

        <div className="grid items-stretch gap-6 lg:grid-cols-3">
          {tiers.map((t, i) => {
            const price = t.base === 0 ? 0 : t.base * cycle.mult;
            const discounted = t.base > 0 && cycle.mult < 1;
            const monthlySave = t.base - price;
            const isMaroon = t.highlight;
            return (
              <Reveal key={t.name} delay={i * 0.08} className="h-full">
                <div
                  data-testid={`pricing-card-${t.name.toLowerCase()}`}
                  className={`relative flex h-full flex-col overflow-hidden rounded-[24px] border transition-transform duration-300 hover:-translate-y-1 ${
                    isMaroon
                      ? "border-vaani-ink bg-vaani-ink text-white shadow-[0_35px_80px_-25px_rgba(9,9,11,0.4)] lg:scale-[1.03]"
                      : "border-vaani-gold-soft bg-vaani-white"
                  }`}
                >
                  {/* accent cap */}
                  <span
                    className={`absolute inset-x-0 top-0 h-1.5 ${
                      isMaroon ? "bg-vaani-gold" : t.accent === "maroon" ? "bg-vaani-ink" : "bg-vaani-gold"
                    }`}
                  />
                  {isMaroon && (
                    <span className="absolute -right-12 top-6 rotate-45 bg-vaani-gold px-12 py-1 text-center font-mono text-[10px] uppercase tracking-wider text-white">
                      Popular
                    </span>
                  )}

                  <div className="p-8 md:p-10">
                    <h3 className={`font-display text-2xl font-semibold ${isMaroon ? "text-white" : "text-vaani-ink"}`}>
                      {t.name}
                    </h3>
                    <p className={`mt-1 text-sm ${isMaroon ? "text-white/70" : "text-vaani-muted"}`}>{t.tagline}</p>

                    {/* Price */}
                    <div className="mt-6 flex h-8 items-center gap-2">
                      <AnimatePresence mode="popLayout">
                        {discounted && (
                          <motion.span
                            key={"orig-" + t.name}
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className={`font-mono text-lg line-through ${isMaroon ? "text-white/40" : "text-vaani-muted/50"}`}
                          >
                            {inr(t.base)}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {discounted && (
                        <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${isMaroon ? "bg-vaani-gold text-white" : "bg-vaani-gold/10 text-vaani-gold"}`}>
                          Save {inr(monthlySave)}/mo
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <AnimatedRupee
                        value={price}
                        testId={`price-${t.name.toLowerCase()}`}
                        className={`font-display text-6xl font-semibold ${isMaroon ? "text-white" : "text-vaani-ink"}`}
                      />
                      <span className={isMaroon ? "text-white/70" : "text-vaani-muted"}>{t.suffix}</span>
                    </div>
                    <p className={`mt-2 font-mono text-[11px] uppercase tracking-wider ${isMaroon ? "text-white/50" : "text-vaani-muted"}`}>
                      {t.base === 0 ? "no card required" : cycle.months > 1 ? `${inr(price * cycle.months)} ${cycle.term}` : cycle.term}
                    </p>

                    <a
                      href="#top"
                      data-testid={`pricing-cta-${t.name.toLowerCase()}`}
                      className={`group mt-7 flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                        isMaroon
                          ? "bg-vaani-gold text-white hover:shadow-lg hover:shadow-vaani-gold/30"
                          : t.accent === "maroon"
                          ? "bg-vaani-ink text-white hover:bg-vaani-maroon-light"
                          : "border border-zinc-300 text-vaani-ink hover:border-vaani-ink hover:bg-vaani-ink hover:text-white"
                      }`}
                    >
                      {t.cta}
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>

                  {/* Features */}
                  <div className={`mt-auto border-t px-8 py-8 md:px-10 ${isMaroon ? "border-white/15" : "border-vaani-gold-soft bg-vaani-sand/50"}`}>
                    {t.plus && (
                      <p className={`mb-4 font-mono text-[10px] uppercase tracking-widest ${isMaroon ? "text-vaani-gold" : "text-vaani-gold"}`}>
                        {t.plus}
                      </p>
                    )}
                    <ul className="space-y-3">
                      {t.features.map((f) => (
                        <li key={f} className={`flex items-start gap-3 text-sm ${isMaroon ? "text-white/90" : "text-vaani-ink"}`}>
                          <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${isMaroon ? "bg-vaani-gold/25" : "bg-vaani-gold/10"}`}>
                            <Check className={`h-3 w-3 ${isMaroon ? "text-vaani-gold" : "text-vaani-gold"}`} />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-10 text-center font-mono text-xs text-vaani-muted">
          No credit card to start · Cancel anytime · 14-day Pro trial
        </p>
      </div>
    </section>
  );
};
