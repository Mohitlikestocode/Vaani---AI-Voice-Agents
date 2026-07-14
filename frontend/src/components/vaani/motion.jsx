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
  <span className="block overflow-hidden">
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

// Eyebrow / section label
export const Eyebrow = ({ children, className = "" }) => (
  <span
    className={`font-mono text-[11px] uppercase tracking-[0.25em] text-vaani-terracotta ${className}`}
  >
    {children}
  </span>
);
