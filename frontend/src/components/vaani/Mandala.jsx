import { motion } from "framer-motion";

/**
 * Concentric lotus-mandala line-art motif echoing the Vaani logo.
 * Renders layered petal rings. Use as a subtle rotating background element.
 */
export const Mandala = ({
  className = "",
  color = "#6E1A1A",
  strokeWidth = 1,
  spin = true,
  duration = 90,
  reverse = false,
}) => {
  const petals = (count, r, len, rot = 0) => {
    const paths = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * 360 + rot;
      paths.push(
        <path
          key={`${r}-${i}`}
          d={`M0 ${-r} C ${len} ${-r + len} ${len} ${-r - len} 0 ${-r - len * 1.6} C ${-len} ${-r - len} ${-len} ${-r + len} 0 ${-r} Z`}
          transform={`rotate(${a})`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      );
    }
    return paths;
  };

  return (
    <motion.svg
      viewBox="-400 -400 800 800"
      className={className}
      animate={spin ? { rotate: reverse ? -360 : 360 } : undefined}
      transition={spin ? { duration, ease: "linear", repeat: Infinity } : undefined}
      aria-hidden="true"
    >
      <g>
        {petals(16, 320, 55)}
        {petals(16, 250, 48, 11.25)}
        {petals(12, 185, 42)}
        {petals(12, 130, 34, 15)}
        <circle cx="0" cy="0" r="70" fill="none" stroke={color} strokeWidth={strokeWidth} />
        <circle cx="0" cy="0" r="52" fill="none" stroke={color} strokeWidth={strokeWidth} />
      </g>
    </motion.svg>
  );
};
