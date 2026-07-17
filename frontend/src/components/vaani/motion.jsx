import { motion } from "framer-motion";

// Fade + rise on scroll into view
export const Reveal = ({ children, delay = 0, y = 40, className = "", ...props }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Masked line reveal (each line wrapped in overflow-hidden)
export const MaskLine = ({ children, delay = 0, className = "" }) => (
  <span className="block overflow-hidden py-[0.05em]">
    <motion.span
      className={`block ${className}`}
      initial={{ y: "110%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

// Eyebrow / section label with mandala tick
export const Eyebrow = ({ children, className = "", light = false }) => (
  <span
    className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] ${
      light ? "text-vaani-gold" : "text-vaani-gold"
    } ${className}`}
  >
    <span className="h-px w-6 bg-vaani-gold" />
    {children}
  </span>
);
