// Decorative animated soundwave / equalizer motif for a voice-AI product.
// Use as a subtle background texture (low opacity).
export const SoundWave = ({ className = "", color = "#0055FF", bars = 40, opacity = 0.5 }) => (
  <div
    className={`flex items-end gap-1.5 ${className}`}
    style={{ opacity }}
    aria-hidden="true"
  >
    {Array.from({ length: bars }).map((_, i) => (
      <span
        key={i}
        className="swara-wave-bar w-1 rounded-full"
        style={{
          height: `${20 + (Math.sin(i * 0.9) * 0.5 + 0.5) * 80}%`,
          background: color,
          animationDelay: `${(i % 9) * 0.12}s`,
          animationDuration: `${1.1 + (i % 5) * 0.18}s`,
        }}
      />
    ))}
  </div>
);
