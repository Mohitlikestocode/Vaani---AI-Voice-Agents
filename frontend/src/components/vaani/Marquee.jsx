const logos = [
  "Spice Garden",
  "Glow Salon",
  "Lake View Inn",
  "Sunrise Café",
  "CityCare Clinic",
  "Bazaar Co.",
  "PulseFit",
  "BrightMinds",
];

export const Marquee = () => {
  const items = [...logos, ...logos];
  return (
    <section
      data-testid="logo-marquee"
      className="border-y border-vaani-ink/10 bg-vaani-alt/60 py-8"
    >
      <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-vaani-muted">
        Businesses across India build with Vaani
      </p>
      <div className="relative overflow-hidden">
        <div className="vaani-marquee-track">
          {items.map((name, i) => (
            <span key={i} className="flex items-center">
              <span className="px-8 font-serif text-3xl font-light text-vaani-ink/80 md:text-4xl">
                {name}
              </span>
              <span className="text-vaani-terracotta">•</span>
            </span>
          ))}
        </div>
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-vaani-alt/90 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-vaani-alt/90 to-transparent" />
      </div>
    </section>
  );
};
