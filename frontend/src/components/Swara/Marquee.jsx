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
      className="border-y border-swara-gold-soft bg-swara-sand py-10"
    >
      <p className="mb-7 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-swara-muted">
        Businesses across India build with Swara
      </p>
      <div className="relative overflow-hidden">
        <div className="swara-marquee-track">
          {items.map((name, i) => (
            <span key={i} className="flex items-center">
              <span className="px-8 font-serif text-3xl font-light text-swara-maroon/85 md:text-4xl">
                {name}
              </span>
              <span className="text-swara-gold">âœ³</span>
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-swara-sand to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-swara-sand to-transparent" />
      </div>
    </section>
  );
};
