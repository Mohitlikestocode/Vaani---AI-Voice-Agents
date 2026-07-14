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
    avatar: "https://images.pexels.com/photos/8068770/pexels-photo-8068770.jpeg",
    big: true,
  },
  {
    quote:
      "Our front desk used to drown in 'what are your timings' calls. Vaani handles them all now.",
    name: "Rohan Mehta",
    role: "Manager · Glow Salon, Pune",
  },
  {
    quote:
      "It understands follow-up questions. Patients think they're texting a real receptionist.",
    name: "Dr. Anita Rao",
    role: "Sunrise Clinic · Bengaluru",
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

      <div className="mb-16 grid grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-vaani-ink/10 bg-vaani-ink/10 md:grid-cols-4">
        {stats.map((s) => (
          <Reveal key={s.l}>
            <div className="bg-vaani-surface p-8 text-center md:p-10">
              <p className="font-serif text-4xl font-light text-vaani-terracotta md:text-5xl">
                {s.n}
              </p>
              <p className="mt-2 text-sm text-vaani-muted">{s.l}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal
            key={t.name}
            delay={i * 0.08}
            className={t.big ? "lg:row-span-2" : ""}
          >
            <figure
              className={`flex h-full flex-col justify-between rounded-[24px] border border-vaani-ink/10 p-8 md:p-10 ${
                t.big ? "bg-vaani-forest text-vaani-bg" : "bg-vaani-surface"
              }`}
            >
              <div>
                <div className="mb-5 flex">
                  {[...Array(5)].map((_, k) => (
                    <Star
                      key={k}
                      className={`h-4 w-4 ${
                        t.big
                          ? "fill-vaani-terracotta text-vaani-terracotta"
                          : "fill-vaani-terracotta text-vaani-terracotta"
                      }`}
                    />
                  ))}
                </div>
                <blockquote
                  className={`font-serif font-light leading-snug ${
                    t.big ? "text-3xl md:text-4xl" : "text-xl text-vaani-ink"
                  }`}
                >
                  “{t.quote}”
                </blockquote>
              </div>
              <figcaption className="mt-8 flex items-center gap-3">
                {t.avatar ? (
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full font-serif text-lg ${
                      t.big ? "bg-vaani-bg text-vaani-forest" : "bg-vaani-terracotta text-vaani-bg"
                    }`}
                  >
                    {t.name[0]}
                  </span>
                )}
                <div>
                  <p className={`font-medium ${t.big ? "" : "text-vaani-ink"}`}>{t.name}</p>
                  <p className={`text-sm ${t.big ? "text-vaani-bg/60" : "text-vaani-muted"}`}>
                    {t.role}
                  </p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
