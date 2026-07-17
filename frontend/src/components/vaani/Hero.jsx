import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Play, Star } from "lucide-react";
import { MaskLine } from "./motion";
import { VoiceDemo } from "./VoiceDemo";
import { SoundWave } from "./SoundWave";

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const demoY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const demoRotate = useTransform(scrollYProgress, [0, 1], [0, -2]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section
      id="top"
      ref={ref}
      data-testid="hero"
      className="relative overflow-hidden px-6 pb-24 pt-36 md:px-10 md:pt-44"
    >
      {/* Technical grid motif */}
      <div className="vaani-grid vaani-grid-fade pointer-events-none absolute inset-0 z-0" />
      {/* Soft azure glow */}
      <div className="pointer-events-none absolute -right-40 -top-40 z-0 h-[600px] w-[600px] rounded-full bg-vaani-gold/[0.06] blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-[1400px] items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: kinetic copy */}
        <motion.div style={{ y: textY }} className="relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 shadow-[0_1px_2px_rgba(9,9,11,0.04)]"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-vaani-gold" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-vaani-muted">
              Now in public beta — start free
            </span>
          </motion.div>

          <h1 className="font-display text-[14vw] font-semibold leading-[0.95] tracking-tighter text-vaani-ink sm:text-6xl lg:text-[5.5rem]">
            <MaskLine delay={0.15}>Your business,</MaskLine>
            <MaskLine delay={0.3} className="text-vaani-gold">
              always on call
            </MaskLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9 }}
            className="mt-8 max-w-md text-base leading-relaxed text-vaani-muted md:text-lg"
          >
            Create an AI voice agent that knows your business inside out. It
            answers every question, handles every call, and never takes a day off.
            Set up in 60 seconds — no code required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.9 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href="#pricing"
              data-testid="hero-primary-cta"
              className="group flex items-center gap-2 rounded-full bg-vaani-gold px-7 py-4 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-vaani-gold/25"
            >
              Create your agent — free
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#see-it"
              data-testid="hero-secondary-cta"
              className="group flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-4 text-sm text-vaani-ink transition-colors hover:bg-zinc-50"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-vaani-ink text-white">
                <Play className="h-3 w-3 fill-current" />
              </span>
              See it in action
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.9 }}
            className="mt-8 flex items-center gap-2 font-mono text-xs text-vaani-muted"
          >
            <span className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </span>
            4.9/5 from 50+ reviews · Trusted by 200+ businesses
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.9 }}
            data-testid="featured-on"
            className="mt-6 flex items-center gap-4"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-vaani-muted">
              As featured on
            </span>
            <span className="h-4 w-px bg-zinc-200" />
            <a
              href="https://medium.com"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="featured-medium-link"
              className="flex items-center gap-2 text-vaani-ink transition-opacity duration-300 hover:opacity-60"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
              </svg>
              <span className="text-xl font-bold tracking-tight">Medium</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Right: parallax voice demo */}
        <motion.div
          style={{ y: demoY, rotate: demoRotate }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <SoundWave
            className="absolute inset-x-0 -bottom-16 -z-10 h-24"
            bars={44}
            opacity={0.12}
          />
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="absolute bottom-full left-6 mb-5 z-20 hidden rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] lg:block"
          >
            <p className="font-mono text-[10px] uppercase tracking-wider text-vaani-muted">
              Calls handled this week
            </p>
            <p className="font-mono text-2xl font-semibold text-vaani-ink">1,248</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.25, duration: 0.8 }}
            className="absolute top-full right-6 mt-5 z-20 hidden rounded-2xl bg-vaani-ink px-4 py-3 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] lg:block"
          >
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/60">
              New booking confirmed
            </p>
            <p className="text-sm">Table for 4 · 8:30 PM</p>
          </motion.div>

          <VoiceDemo />
        </motion.div>
      </div>
    </section>
  );
};
