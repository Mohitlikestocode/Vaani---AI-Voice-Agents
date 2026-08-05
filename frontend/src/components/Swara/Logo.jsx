const LOGO_SRC = "/swaralogo.png";

export const LogoMark = ({ className = "h-9 w-9" }) => (
  <img
    src={LOGO_SRC}
    alt="Swara logo"
    className={`inline-block object-contain ${className}`}
  />
);

export const Logo = ({ light = false, className = "" }) => (
  <span className={`flex items-center gap-2.5 ${className}`}>
    <LogoMark />
    <span
      className={`font-display text-xl font-semibold tracking-tight ${
        light ? "text-white" : "text-swara-ink"
      }`}
    >
      Swara
    </span>
  </span>
);
