import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, Eyebrow } from "./motion";
import { UtensilsCrossed, Scissors, Stethoscope, Hotel, Headset, Check, TrendingUp } from "lucide-react";

const cases = [
  {
    key: "restaurants",
    tab: "Restaurants",
    name: "Restaurants & Cloud Kitchens",
    icon: UtensilsCrossed,
    popular: true,
    desc: "Your agent takes orders, answers menu questions and books tables — so you never lose a hungry customer to a missed call.",
    bullets: ["Takes orders & reservations 24/7", "Knows your full menu & daily specials", "Handles Jain, vegan & allergy questions"],
    stat: { value: "42%", label: "fewer missed orders" },
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=80",
    chat: [
      { from: "user", text: "Do you have anything Jain?" },
      { from: "agent", text: "Absolutely — our Jain Thali is ₹179, no onion or garlic. Shall I reserve a table?" },
    ],
  },
  {
    key: "salons",
    tab: "Salons & Spas",
    name: "Salons & Spas",
    icon: Scissors,
    desc: "Fill your calendar around the clock. Vaani books, reschedules and upsells while your stylists stay with the client in the chair.",
    bullets: ["Books & reschedules appointments", "Explains services & pricing clearly", "Upsells packages automatically"],
    stat: { value: "3×", label: "more bookings after hours" },
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80",
    chat: [
      { from: "user", text: "How much for a haircut and how long will it take?" },
      { from: "agent", text: "A stylist cut is ₹499 and takes about 40 minutes. I have a 5 PM slot today — book it?" },
    ],
  },
  {
    key: "clinics",
    tab: "Clinics",
    name: "Clinics & Healthcare",
    icon: Stethoscope,
    desc: "A calm, always-available front desk. Vaani shares hours, books appointments and answers patient FAQs in their own language.",
    bullets: ["Shares hours, location & fees", "Books and confirms appointments", "Answers FAQs in local languages"],
    stat: { value: "31%", label: "fewer no-shows" },
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1000&q=80",
    chat: [
      { from: "user", text: "Is the doctor available on Sunday?" },
      { from: "agent", text: "Dr. Rao sees patients 10 AM–1 PM on Sundays. Would you like the next available appointment?" },
    ],
  },
  {
    key: "hotels",
    tab: "Hotels",
    name: "Hotels & Hospitality",
    icon: Hotel,
    desc: "A 24/7 concierge that never sleeps — Vaani takes bookings, handles room service and recommends the best spots in town.",
    bullets: ["Takes room bookings & requests", "Handles room-service orders", "Recommends local experiences"],
    stat: { value: "24/7", label: "concierge, zero hold time" },
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
    chat: [
      { from: "user", text: "Do you have a lake-view room for two nights?" },
      { from: "agent", text: "Yes — our Lake View Deluxe is ₹4,200/night, breakfast included. Shall I block it for your dates?" },
    ],
  },
  {
    key: "support",
    tab: "Tech Support",
    name: "Tech Support",
    icon: Headset,
    desc: "First-line support without the hold music. Vaani troubleshoots common issues instantly and escalates the rest with full context.",
    bullets: ["Resolves common issues instantly", "Creates & routes tickets", "Cuts first-response time to seconds"],
    stat: { value: "60%", label: "tickets auto-resolved" },
    image: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=1000&q=80",
    chat: [
      { from: "user", text: "My router keeps disconnecting." },
      { from: "agent", text: "Let's power-cycle it — unplug for 30 seconds. If it persists, I'll raise ticket #4821 for an engineer visit." },
    ],
  },
];

export const UseCases = () => {
  const [active, setActive] = useState(0);
  const c = cases[active];

  return (
    <section id="use-cases" data-testid="use-cases" className="bg-vaani-sand px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-10 max-w-2xl">
          <Eyebrow>Built for every business</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.03] tracking-tight text-vaani-ink md:text-6xl">
            One platform. Infinite use cases.
          </h2>
        </Reveal>

        {/* Segmented pill tabs */}
        <Reveal className="mb-8 flex flex-wrap gap-2">
          {cases.map((item, i) => {
            const isActive = active === i;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                data-testid={`usecase-tab-${i}`}
                onClick={() => setActive(i)}
                className={`group flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "border-vaani-ink bg-vaani-ink text-white"
                    : "border-zinc-200 bg-white text-vaani-muted hover:border-vaani-ink/30 hover:text-vaani-ink"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                {item.tab}
                {item.popular && (
                  <span className={`rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide ${isActive ? "bg-vaani-gold text-white" : "bg-vaani-gold/10 text-vaani-gold"}`}>
                    Popular
                  </span>
                )}
              </button>
            );
          })}
        </Reveal>

        {/* Product window */}
        <Reveal delay={0.05}>
          <div
            data-testid="usecase-panel"
            className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_40px_90px_-50px_rgba(9,9,11,0.35)]"
          >
            <div className="grid lg:grid-cols-[1fr_1.05fr]">
              {/* Left — copy */}
              <div className="flex flex-col justify-center p-8 md:p-14">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={c.key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-vaani-gold">
                      Use case {String(active + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight text-vaani-ink md:text-4xl">
                      {c.name}
                    </h3>
                    <p className="mt-4 max-w-md text-vaani-muted">{c.desc}</p>

                    <ul className="mt-7 space-y-3">
                      {c.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3 text-sm text-vaani-ink">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-vaani-gold/10">
                            <Check className="h-3 w-3 text-vaani-gold" strokeWidth={3} />
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-zinc-200 bg-vaani-sand/60 px-5 py-3">
                      <TrendingUp className="h-5 w-5 text-vaani-gold" />
                      <span className="font-display text-2xl font-semibold text-vaani-ink">{c.stat.value}</span>
                      <span className="text-sm text-vaani-muted">{c.stat.label}</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right — framed visual + floating chat */}
              <div className="relative min-h-[420px] overflow-hidden bg-vaani-ink lg:min-h-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={c.key}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-vaani-gold/30 via-vaani-ink to-vaani-ink" />
                    <img
                      src={c.image}
                      alt={c.name}
                      onError={(e) => {
                        e.currentTarget.style.opacity = "0";
                      }}
                      data-testid="usecase-image"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-vaani-ink/90 via-vaani-ink/20 to-transparent" />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-vaani-gold" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white">Vaani · live</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`chat-${c.key}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-x-6 bottom-6 z-10 rounded-2xl border border-white/40 bg-white/95 p-4 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="space-y-2">
                      {c.chat.map((m, k) => (
                        <div key={k} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                          <span
                            className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-snug ${
                              m.from === "user"
                                ? "rounded-br-sm bg-vaani-gold text-white"
                                : "rounded-bl-sm bg-vaani-sand text-vaani-ink"
                            }`}
                          >
                            {m.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
