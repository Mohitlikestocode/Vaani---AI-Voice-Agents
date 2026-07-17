const LOGO_SRC =
  "https://customer-assets.emergentagent.com/job_voice-assistant-pro-43/artifacts/qtjnkbed_image.png";

// Brand logo mark — the Vaani lotus monogram.
export const LogoMark = ({ className = "h-9 w-9" }) => (
  <img
    src={LOGO_SRC}
    alt="Vaani"
    className={`rounded-[10px] object-cover ${className}`}
  />
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
