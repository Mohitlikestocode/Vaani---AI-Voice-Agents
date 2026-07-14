import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Reveal, Eyebrow } from "./motion";

const billing = [
  { id: "monthly", label: "Monthly", mult: 1 },
  { id: "sixmo", label: "6 months −10%", mult: 0.9 },
  { id: "annual", label: "Annual −20%", mult: 0.8 },
];

const tiers = [
  {
    name: "Free",
    base: 0,
    suffix: "forever",
    tagline: "To try Vaani with one agent.",
    cta: "Get started free",
    highlight: false,
    features: ["50 conversations / month", "1 agent", "Community support", "Vaani branding on agent", "Browser voices (Web Speech)"],
  },
  {
    name: "Pro",
    base: 1999,
    suffix: "/mo",
    tagline: "Billed monthly, cancel anytime",
    cta: "Start 14-day free trial",
    highlight: true,
    plus: "EVERYTHING IN FREE, PLUS",
    features: ["500 conversations / month", "5 agents", "Email support", "Remove Vaani branding", "Custom greeting & instructions", "Analytics dashboard", "Priority AI model"],
  },
  {
    name: "Business",
    base: 6999,
    suffix: "/mo",
    tagline: "Billed monthly, cancel anytime",
    cta: "Talk to sales",
    highlight: false,
    plus: "EVERYTHING IN PRO, PLUS",
    features: ["Unlimited conversations", "Unlimited agents", "Dedicated support", "API access", "Custom domain", "Webhook integrations", "Premium AI voices (soon)"],
  },
];

const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

export const Pricing = () => {
  const [cycle, setCycle] = useState(billing[0]);

  return (
    <section id="pricing" data-testid="pricing" className="bg-vaani-sand px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-12 text-center">
          <div className="flex justify-center"><Eyebrow>Pricing</Eyebrow></div>
          <h2 className="mx-auto mt-5 max-w-3xl font-serif text-5xl font-light leading-[1.02] tracking-tight text-vaani-ink md:text-7xl">
            One agent pays for itself in a day.
          </h2>
          <p className="mt-6 text-vaani-muted">Start free. Pick a longer term and your monthly price drops.</p>
        </Reveal>

        <Reveal className="mb-16 flex justify-center">
          <div data-testid="billing-toggle" className="inline-flex rounded-full border border-vaani-gold-soft bg-vaani-white p-1.5">
            {billing.map((b) => (
              <button
                key={b.id}
                data-testid={`billing-${b.id}`}
                onClick={() => setCycle(b)}
                className={`relative rounded-full px-5 py-2.5 text-sm transition-colors ${
                  cycle.id === b.id ? "text-vaani-cream" : "text-vaani-muted hover:text-vaani-maroon"
                }`}
              >
                {cycle.id === b.id && (
                  <motion.span
                    layoutId="billing-pill"
                    className="absolute inset-0 rounded-full bg-vaani-maroon"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{b.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((t, i) => {
            const price = t.base === 0 ? 0 : t.base * cycle.mult;
            return (
              <Reveal key={t.name} delay={i * 0.08}>
                <div
                  data-testid={`pricing-card-${t.name.toLowerCase()}`}
                  className={`relative flex h-full flex-col rounded-[24px] border p-8 md:p-10 ${
                    t.highlight
                      ? "border-vaani-maroon bg-vaani-maroon text-vaani-cream shadow-[0_30px_70px_-25px_rgba(110,26,26,0.6)]"
                      : "border-vaani-gold-soft bg-vaani-white"
                  }`}
                >
                  {t.highlight && (
                    <span className="absolute -top-3 left-8 rounded-full bg-vaani-gold px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-vaani-maroon">
                      Most popular
                    </span>
                  )}
                  <h3 className={`font-serif text-3xl font-light ${t.highlight ? "text-vaani-cream" : "text-vaani-maroon"}`}>
                    {t.name}
                  </h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <motion.span
                      key={Math.round(price)}
                      initial={{ opacity: 0.4, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      data-testid={`price-${t.name.toLowerCase()}`}
                      className={`font-serif text-5xl font-light ${t.highlight ? "text-vaani-cream" : "text-vaani-ink"}`}
                    >
                      {inr(price)}
                    </motion.span>
                    <span className={t.highlight ? "text-vaani-cream/70" : "text-vaani-muted"}>{t.suffix}</span>
                  </div>
                  <p className={`mt-2 text-sm ${t.highlight ? "text-vaani-cream/70" : "text-vaani-muted"}`}>{t.tagline}</p>

                  <a
                    href="#top"
                    data-testid={`pricing-cta-${t.name.toLowerCase()}`}
                    className={`mt-7 block rounded-full px-6 py-3.5 text-center text-sm font-medium transition-transform duration-300 hover:-translate-y-0.5 ${
                      t.highlight ? "bg-vaani-cream text-vaani-maroon" : "bg-vaani-maroon text-vaani-cream"
                    }`}
                  >
                    {t.cta}
                  </a>

                  {t.plus && (
                    <p className={`mt-8 font-mono text-[10px] uppercase tracking-widest ${t.highlight ? "text-vaani-gold" : "text-vaani-muted"}`}>
                      {t.plus}
                    </p>
                  )}
                  <ul className={`space-y-3 ${t.plus ? "mt-4" : "mt-8"}`}>
                    {t.features.map((f) => (
                      <li key={f} className={`flex items-start gap-3 text-sm ${t.highlight ? "text-vaani-cream/90" : "text-vaani-ink"}`}>
                        <Check className={`mt-0.5 h-4 w-4 shrink-0 ${t.highlight ? "text-vaani-gold" : "text-vaani-maroon"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
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
