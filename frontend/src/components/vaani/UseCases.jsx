import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, Eyebrow } from "./motion";
import { UtensilsCrossed, Scissors, Stethoscope, Hotel, Headset, ArrowRight } from "lucide-react";

const cases = [
  {
    name: "Restaurants & Cloud Kitchens",
    short: "Take orders, answer menu questions, and handle reservations — never miss a hungry customer.",
    icon: UtensilsCrossed,
    popular: true,
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=80",
    chat: [
      { from: "user", text: "Do you have anything Jain?" },
      { from: "agent", text: "Absolutely — our Jain Thali is ₹179, no onion or garlic. Shall I reserve a table?" },
    ],
  },
  {
    name: "Salons & Spas",
    short: "Book appointments, explain services and share pricing — and upsell packages automatically.",
    icon: Scissors,
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80",
    chat: [
      { from: "user", text: "How much for a haircut and how long will it take?" },
      { from: "agent", text: "A stylist cut is ₹499 and takes about 40 minutes. I have a 5 PM slot today — book it?" },
    ],
  },
  {
    name: "Clinics & Healthcare",
    short: "Answer patient queries, share clinic hours and manage appointments in any language.",
    icon: Stethoscope,
    image:
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1000&q=80",
    chat: [
      { from: "user", text: "Is the doctor available on Sunday?" },
      { from: "agent", text: "Dr. Rao sees patients 10 AM–1 PM on Sundays. Would you like the next available appointment?" },
    ],
  },
  {
    name: "Hotels & Hospitality",
    short: "Handle bookings, room service and local recommendations, around the clock.",
    icon: Hotel,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
    chat: [
      { from: "user", text: "Do you have a lake-view room for two nights?" },
      { from: "agent", text: "Yes — our Lake View Deluxe is ₹4,200/night, breakfast included. Shall I block it for your dates?" },
    ],
  },
  {
    name: "Tech Support",
    short: "First-line support, troubleshooting and ticket creation, without the hold music.",
    icon: Headset,
    image:
      "https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=1000&q=80",
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
        <Reveal className="mb-16 max-w-2xl">
          <Eyebrow>Built for every business</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.03] tracking-tight text-vaani-ink md:text-6xl">
            One platform. Infinite use cases.
          </h2>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Selector list */}
          <Reveal className="flex flex-col gap-2">
            {cases.map((item, i) => {
              const isActive = active === i;
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  data-testid={`usecase-tab-${i}`}
                  onClick={() => setActive(i)}
                  className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
                    isActive
                      ? "border-vaani-gold bg-vaani-white shadow-[0_20px_50px_-30px_rgba(0,85,255,0.6)]"
                      : "border-transparent bg-white/40 hover:bg-vaani-white"
                  }`}
                >
                  {isActive && <span className="absolute inset-y-0 left-0 w-1 bg-vaani-gold" />}
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                        isActive ? "bg-vaani-gold text-white" : "bg-vaani-sand text-vaani-ink group-hover:bg-vaani-gold/10 group-hover:text-vaani-gold"
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-display text-lg font-semibold ${isActive ? "text-vaani-ink" : "text-vaani-ink"}`}>
                          {item.name}
                        </span>
                        {item.popular && (
                          <span className="rounded-full bg-vaani-gold/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-vaani-gold">
                            Popular
                          </span>
                        )}
                      </div>
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden text-sm text-vaani-muted"
                          >
                            <span className="block pt-1.5">{item.short}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <ArrowRight
                      className={`h-4 w-4 shrink-0 transition-all duration-300 ${
                        isActive ? "translate-x-0 text-vaani-gold opacity-100" : "-translate-x-1 opacity-0"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </Reveal>

          {/* Visual panel */}
          <Reveal delay={0.1}>
            <div
              data-testid="usecase-panel"
              className="relative h-[520px] overflow-hidden rounded-[28px] border border-zinc-200 bg-vaani-ink shadow-[0_40px_90px_-40px_rgba(9,9,11,0.4)]"
            >
              {/* image crossfade */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  {/* gradient fallback (shows if image fails) */}
                  <div className="absolute inset-0 bg-gradient-to-br from-vaani-gold/40 via-vaani-ink to-vaani-ink" />
                  <img
                    src={c.image}
                    alt={c.name}
                    onError={(e) => {
                      e.currentTarget.style.opacity = "0";
                    }}
                    data-testid="usecase-image"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-vaani-ink via-vaani-ink/30 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* label */}
              <div className="absolute left-8 top-8 z-10 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-vaani-gold" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-white">Live agent</span>
              </div>

              {/* floating sample chat */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`chat-${active}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-6 bottom-6 z-10 rounded-2xl border border-white/10 bg-white/95 p-5 shadow-2xl backdrop-blur-xl md:inset-x-8 md:bottom-8"
                >
                  <p className="mb-3 font-display text-base font-semibold text-vaani-ink">{c.name}</p>
                  <div className="space-y-2">
                    {c.chat.map((m, k) => (
                      <div key={k} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                        <span
                          className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-snug ${
                            m.from === "user"
                              ? "rounded-br-sm bg-vaani-ink text-white"
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
          </Reveal>
        </div>
      </div>
    </section>
  );
};
