import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Reveal, Eyebrow } from "./motion";
import { Star } from "lucide-react";

const stats = [
  { n: "200+", l: "businesses onboarded" },
  { n: "1.2M+", l: "calls answered" },
  { n: "4.9â˜…", l: "average rating" },
  { n: "32%", l: "fewer missed calls" },
];

const testimonials = [
  {
    quote:
      "Set it up during a chai break. By dinner, Swara had taken 30 reservation calls I'd have otherwise missed — in Malayalam and English both. It even remembers our specials and suggests them to callers without me lifting a finger.",
    name: "Priya Nair",
    role: "Owner · Spice Garden, Kochi",
    avatar:
      "https://images.unsplash.com/photo-1590650153855-d9e808231d41?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzg0MDE5OTQ0fDA&ixlib=rb-4.1.0&q=85",
  },
  {
    quote:
      "Our front desk used to drown in 'what are your timings' and 'are you open today' calls all day long. Swara handles every one of them now, books appointments, and even upsells our spa packages — so my staff finally focus on the client in the chair instead of the ringing phone.",
    name: "Rohan Mehta",
    role: "Manager · Glow Salon, Pune",
    avatar:
      "https://images.unsplash.com/photo-1647598378432-1aa8fa34f37f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjBidXNpbmVzcyUyMG93bmVyJTIwcG9ydHJhaXQlMjBmcmllbmRseXxlbnwwfHx8fDE3ODQwMTk5Mzh8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    quote:
      "It understands follow-up questions so naturally that patients genuinely think they're texting a real receptionist. It shares our timings, books slots and answers insurance queries in Kannada and English — our no-shows have dropped noticeably and the front desk is far calmer through the day.",
    name: "Dr. Anita Rao",
    role: "Sunrise Clinic · Bengaluru",
    avatar:
      "https://images.unsplash.com/photo-1573497019707-1c04de26e58c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjB3b21hbiUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzg0MDE5OTQ0fDA&ixlib=rb-4.1.0&q=85",
  },
];

export const SocialProof = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section data-testid="social-proof" className="px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-16 max-w-2xl">
          <Eyebrow>Loved across India</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.03] tracking-tight text-swara-ink md:text-6xl">
            Real businesses. Real conversations.
          </h2>
        </Reveal>

        <div className="mb-16 grid grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-swara-gold-soft bg-swara-gold-soft md:grid-cols-4">
          {stats.map((s) => (
            <Reveal key={s.l}>
              <div className="bg-swara-white p-8 text-center md:p-10">
                <p className="font-display text-4xl font-semibold text-swara-gold md:text-5xl">{s.n}</p>
                <p className="mt-2 text-sm text-swara-muted">{s.l}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => {
            const isActive = active === i;
            return (
              <Reveal key={t.name} delay={i * 0.08} className="h-full">
                <motion.figure
                  data-testid={`testimonial-card-${i}`}
                  animate={{ y: isActive ? -8 : 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex h-full flex-col justify-between overflow-hidden rounded-[24px] border p-8 md:p-10 ${
                    isActive
                      ? "border-swara-ink bg-swara-ink text-white shadow-[0_35px_70px_-30px_rgba(9,9,11,0.35)]"
                      : "border-swara-gold-soft bg-swara-white"
                  }`}
                  style={{
                    transitionProperty: "background-color, border-color, color, box-shadow",
                    transitionDuration: "1400ms",
                    transitionTimingFunction: "ease-in-out",
                  }}
                >
                  {isActive && (
                    <motion.span
                      key={`bar-${i}-${active}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="absolute inset-x-0 top-0 h-1 origin-left bg-swara-gold"
                    />
                  )}
                  <div>
                    <span className={`font-display text-6xl leading-none ${isActive ? "text-swara-gold" : "text-zinc-200"}`}>
                      &ldquo;
                    </span>
                    <blockquote
                      className={`-mt-4 font-serif text-2xl font-normal leading-snug transition-colors duration-[1400ms] ${
                        isActive ? "text-white" : "text-swara-ink"
                      }`}
                    >
                      {t.quote}
                    </blockquote>
                    <div className="mt-5 flex">
                      {[...Array(5)].map((_, k) => (
                        <Star key={k} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <figcaption className="mt-8 flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
                    <div>
                      <p className={`font-medium ${isActive ? "" : "text-swara-ink"}`}>{t.name}</p>
                      <p className={`text-sm transition-colors duration-[1400ms] ${isActive ? "text-white/60" : "text-swara-muted"}`}>
                        {t.role}
                      </p>
                    </div>
                  </figcaption>
                </motion.figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
