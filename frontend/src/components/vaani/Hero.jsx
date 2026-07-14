import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Play, Star } from "lucide-react";
import { MaskLine } from "./motion";
import { VoiceDemo } from "./VoiceDemo";
import { Mandala } from "./Mandala";

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const demoY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const demoRotate = useTransform(scrollYProgress, [0, 1], [0, -3]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const mandalaScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      id="top"
      ref={ref}
      data-testid="hero"
      className="relative overflow-hidden px-6 pb-24 pt-36 md:px-10 md:pt-44"
    >
      {/* Rotating mandala motif */}
      <motion.div
        style={{ scale: mandalaScale }}
        className="pointer-events-none absolute -right-[18%] top-[6%] z-0 hidden h-[900px] w-[900px] opacity-[0.06] md:block"
      >
        <Mandala color="#6E1A1A" strokeWidth={1.2} duration={120} className="h-full w-full" />
      </motion.div>
      <div className="pointer-events-none absolute -left-[22%] bottom-[-30%] z-0 h-[600px] w-[600px] opacity-[0.05]">
        <Mandala color="#C5A059" strokeWidth={1.5} duration={100} reverse className="h-full w-full" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1400px] items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: kinetic copy */}
        <motion.div style={{ y: textY }} className="relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-vaani-gold-soft bg-vaani-white/70 px-4 py-1.5 backdrop-blur"
          >
            <span className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-vaani-gold text-vaani-gold" />
              ))}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-vaani-muted">
              Now in public beta — start free
            </span>
          </motion.div>

          <p className="mb-4 font-serif text-2xl italic text-vaani-maroon/70">
            वाणी — the voice of your business
          </p>

          <h1 className="font-serif text-[15vw] font-light leading-[0.9] tracking-tight text-vaani-ink sm:text-7xl lg:text-[6.5rem]">
            <MaskLine delay={0.15}>Your business,</MaskLine>
            <MaskLine delay={0.3} className="italic text-vaani-maroon">
              always on call
            </MaskLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9 }}
            className="mt-8 max-w-md text-base leading-relaxed text-vaani-muted md:text-lg"
          >
            Create an AI voice agent that knows your business inside out. Answers
            every question, handles every call, never takes a day off. Set up in
            60 seconds — no code required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.9 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#pricing"
              data-testid="hero-primary-cta"
              className="group flex items-center gap-2 rounded-full bg-vaani-maroon px-7 py-4 text-sm font-medium text-vaani-cream transition-all duration-300 hover:bg-vaani-maroon-dark hover:-translate-y-0.5"
            >
              Create your agent — free
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#see-it"
              data-testid="hero-secondary-cta"
              className="group flex items-center gap-2 rounded-full border border-vaani-maroon/25 px-6 py-4 text-sm text-vaani-maroon transition-colors hover:border-vaani-maroon hover:bg-vaani-maroon/5"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-vaani-maroon text-vaani-cream">
                <Play className="h-3 w-3 fill-current" />
              </span>
              See it in action
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.9 }}
            className="mt-8 font-mono text-xs text-vaani-muted"
          >
            ★ 4.9/5 from 50+ reviews · Trusted by 200+ businesses across India
          </motion.p>
        </motion.div>

        {/* Right: parallax voice demo */}
        <motion.div
          style={{ y: demoY, rotate: demoRotate }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="absolute -left-4 top-8 z-20 hidden rounded-2xl border border-vaani-gold-soft bg-vaani-white px-4 py-3 shadow-lg md:block"
          >
            <p className="font-mono text-[10px] uppercase tracking-wider text-vaani-muted">
              Calls handled this week
            </p>
            <p className="font-serif text-2xl text-vaani-maroon">1,248</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.25, duration: 0.8 }}
            className="absolute -right-3 bottom-14 z-20 hidden rounded-2xl bg-vaani-maroon px-4 py-3 text-vaani-cream shadow-lg md:block"
          >
            <p className="font-mono text-[10px] uppercase tracking-wider opacity-70">
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
