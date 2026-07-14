import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./motion";

export const FinalCTA = () => (
  <section data-testid="final-cta" className="bg-vaani-terracotta px-6 py-28 text-vaani-bg md:px-10 md:py-40">
    <div className="mx-auto max-w-[1000px] text-center">
      <Reveal>
        <h2 className="font-serif text-5xl font-light leading-[1.0] tracking-tight md:text-8xl">
          Ready to give your business a voice?
        </h2>
        <p className="mt-8 text-lg text-vaani-bg/80">
          Join 200+ businesses already using Vaani.
        </p>
        <a
          href="#pricing"
          data-testid="final-cta-button"
          className="group mt-10 inline-flex items-center gap-2 rounded-full bg-vaani-ink px-8 py-4 text-sm font-medium text-vaani-bg transition-transform duration-300 hover:scale-[1.03]"
        >
          Create your free agent
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
        <p className="mt-6 font-mono text-xs text-vaani-bg/70">
          No credit card required · Set up in 60 seconds
        </p>
      </Reveal>
    </div>
  </section>
);

const cols = [
  { title: "Product", links: ["Features", "Pricing", "Use Cases", "Docs"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
  { title: "Legal", links: ["Terms", "Privacy", "Security"] },
];

export const Footer = () => (
  <footer data-testid="footer" className="bg-vaani-ink px-6 pt-24 text-vaani-bg md:px-10">
    <div className="mx-auto max-w-[1400px]">
      <div className="grid gap-12 border-b border-vaani-bg/15 pb-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-vaani-terracotta" />
            <span className="font-mono text-sm font-semibold uppercase tracking-[0.35em]">
              Vaani
            </span>
          </div>
          <p className="mt-5 max-w-xs text-sm text-vaani-bg/60">
            AI voice agents for every business.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="font-mono text-xs uppercase tracking-widest text-vaani-bg/50">
              {c.title}
            </p>
            <ul className="mt-5 space-y-3">
              {c.links.map((l) => (
                <li key={l}>
                  <a
                    href="#top"
                    data-testid={`footer-link-${l.toLowerCase()}`}
                    className="text-sm text-vaani-bg/80 transition-colors hover:text-vaani-terracotta"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <p className="font-mono text-xs text-vaani-bg/50">
          © 2026 Vaani. All rights reserved. · Built with ☕ in Bengaluru
        </p>
        <div className="flex gap-5 font-mono text-xs text-vaani-bg/70">
          <a href="#top" className="transition-colors hover:text-vaani-terracotta">𝕏</a>
          <a href="#top" className="transition-colors hover:text-vaani-terracotta">GitHub</a>
          <a href="#top" className="transition-colors hover:text-vaani-terracotta">LinkedIn</a>
        </div>
      </div>

      {/* Massive brand wordmark */}
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="select-none pb-6 text-center font-serif text-[24vw] font-light leading-none tracking-tighter text-vaani-bg/[0.06] md:text-[20vw]"
      >
        VAANI
      </motion.p>
    </div>
  </footer>
);
