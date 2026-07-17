// Clean, modern SaaS logo mark: an electric-azure rounded square with a
// white soundwave, paired with the "Vaani" wordmark. No external asset needed.
export const LogoMark = ({ className = "h-9 w-9" }) => (
  <span
    className={`inline-flex items-center justify-center rounded-[10px] bg-vaani-gold ${className}`}
    aria-hidden="true"
  >
    <svg viewBox="0 0 24 24" className="h-1/2 w-1/2 text-white" fill="none">
      {[
        { x: 3, h: 6 },
        { x: 8, h: 14 },
        { x: 13, h: 20 },
        { x: 18, h: 10 },
      ].map((b) => (
        <rect
          key={b.x}
          x={b.x}
          y={(24 - b.h) / 2}
          width="3"
          height={b.h}
          rx="1.5"
          fill="currentColor"
        />
      ))}
    </svg>
  </span>
);

export const Logo = ({ light = false, className = "" }) => (
  <span className={`flex items-center gap-2.5 ${className}`}>
    <LogoMark />
    <span
      className={`font-display text-xl font-semibold tracking-tight ${
        light ? "text-white" : "text-vaani-ink"
      }`}
    >
      Vaani
    </span>
  </span>
);
