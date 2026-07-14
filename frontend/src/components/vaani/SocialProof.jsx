import { Reveal, Eyebrow } from "./motion";
import { Star } from "lucide-react";

const stats = [
  { n: "200+", l: "businesses onboarded" },
  { n: "1.2M+", l: "calls answered" },
  { n: "4.9★", l: "average rating" },
  { n: "32%", l: "fewer missed calls" },
];

const testimonials = [
  {
    quote:
      "Set it up during a chai break. By dinner, Vaani had taken 30 reservation calls I'd have otherwise missed — in Malayalam and English both.",
    name: "Priya Nair",
    role: "Owner · Spice Garden, Kochi",
    avatar:
      "https://images.unsplash.com/photo-1590650153855-d9e808231d41?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzg0MDE5OTQ0fDA&ixlib=rb-4.1.0&q=85",
    big: true,
  },
  {
    quote: "Our front desk used to drown in 'what are your timings' calls. Vaani handles them all now.",
    name: "Rohan Mehta",
    role: "Manager · Glow Salon, Pune",
    avatar:
      "https://images.unsplash.com/photo-1647598378432-1aa8fa34f37f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjBidXNpbmVzcyUyMG93bmVyJTIwcG9ydHJhaXQlMjBmcmllbmRseXxlbnwwfHx8fDE3ODQwMTk5Mzh8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    quote: "It understands follow-up questions. Patients think they're texting a real receptionist.",
    name: "Dr. Anita Rao",
    role: "Sunrise Clinic · Bengaluru",
    avatar:
      "https://images.unsplash.com/photo-1573497019707-1c04de26e58c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjB3b21hbiUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzg0MDE5OTQ0fDA&ixlib=rb-4.1.0&q=85",
  },
];

export const SocialProof = () => (
  <section data-testid="social-proof" className="px-6 py-28 md:px-10 md:py-40">
    <div className="mx-auto max-w-[1400px]">
      <Reveal className="mb-16 max-w-2xl">
        <Eyebrow>Loved across India</Eyebrow>
        <h2 className="mt-5 font-serif text-5xl font-light leading-[1.02] tracking-tight text-vaani-ink md:text-7xl">
          Real businesses. Real conversations.
        </h2>
      </Reveal>

      <div className="mb-16 grid grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-vaani-gold-soft bg-vaani-gold-soft md:grid-cols-4">
        {stats.map((s) => (
          <Reveal key={s.l}>
            <div className="bg-vaani-white p-8 text-center md:p-10">
              <p className="font-serif text-4xl font-light text-vaani-maroon md:text-5xl">{s.n}</p>
              <p className="mt-2 text-sm text-vaani-muted">{s.l}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08} className={t.big ? "lg:row-span-2" : ""}>
            <figure
              className={`flex h-full flex-col justify-between rounded-[24px] border p-8 md:p-10 ${
                t.big ? "border-vaani-maroon bg-vaani-maroon text-vaani-cream" : "border-vaani-gold-soft bg-vaani-white"
              }`}
            >
              <div>
                <span className={`font-serif text-6xl leading-none ${t.big ? "text-vaani-gold" : "text-vaani-maroon/25"}`}>
                  &ldquo;
                </span>
                <blockquote
                  className={`-mt-4 font-serif font-light leading-snug ${
                    t.big ? "text-3xl md:text-4xl" : "text-xl text-vaani-ink"
                  }`}
                >
                  {t.quote}
                </blockquote>
                <div className="mt-5 flex">
                  {[...Array(5)].map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-vaani-gold text-vaani-gold" />
                  ))}
                </div>
              </div>
              <figcaption className="mt-8 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className={`font-medium ${t.big ? "" : "text-vaani-ink"}`}>{t.name}</p>
                  <p className={`text-sm ${t.big ? "text-vaani-cream/60" : "text-vaani-muted"}`}>{t.role}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
