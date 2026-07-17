import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./motion";
import { Logo, LogoMark } from "./Logo";
import { SoundWave } from "./SoundWave";

export const FinalCTA = () => (
  <section
    data-testid="final-cta"
    className="relative overflow-hidden bg-vaani-white px-6 py-28 md:px-10 md:py-40"
  >
    <div className="vaani-grid vaani-grid-fade pointer-events-none absolute inset-0" />
    <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-vaani-gold/[0.07] blur-3xl" />
    <div className="relative z-10 mx-auto max-w-[1000px] text-center">
      <Reveal>
        <LogoMark className="mx-auto mb-10 h-16 w-16 rounded-2xl shadow-lg shadow-vaani-gold/20" />
        <h2 className="font-display text-4xl font-semibold leading-[1.02] tracking-tight text-vaani-ink md:text-7xl">
          Ready to give your business a voice?
        </h2>
        <p className="mt-8 text-lg text-vaani-muted">Join 200+ businesses already using Vaani.</p>
        <a
          href="#pricing"
          data-testid="final-cta-button"
          className="group mt-10 inline-flex items-center gap-2 rounded-full bg-vaani-gold px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-vaani-gold/25"
        >
          Create your free agent
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
        <p className="mt-6 font-mono text-xs text-vaani-muted">
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
  <footer data-testid="footer" className="relative overflow-hidden bg-vaani-ink px-6 pt-24 text-white md:px-10">
    <SoundWave className="pointer-events-none absolute inset-x-0 top-8 h-24" bars={70} color="#0055FF" opacity={0.1} />
    <div className="relative z-10 mx-auto max-w-[1400px]">
      <div className="grid gap-12 border-b border-white/10 pb-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm text-white/50">AI voice agents for every business, in every language.</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="font-mono text-xs uppercase tracking-widest text-vaani-gold">{c.title}</p>
            <ul className="mt-5 space-y-3">
              {c.links.map((l) => (
                <li key={l}>
                  <a
                    href="#top"
                    data-testid={`footer-link-${l.toLowerCase()}`}
                    className="text-sm text-white/70 transition-colors hover:text-white"
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
        <p className="font-mono text-xs text-white/40">
          © 2026 Vaani. All rights reserved. · Built with care in Bengaluru
        </p>
        <div className="flex gap-5 font-mono text-xs text-white/60">
          <a href="#top" className="transition-colors hover:text-vaani-gold">X</a>
          <a href="#top" className="transition-colors hover:text-vaani-gold">GitHub</a>
          <a
            href="https://www.linkedin.com/company/vaani-ai/"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="footer-linkedin"
            className="transition-colors hover:text-vaani-gold"
          >
            LinkedIn
          </a>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="select-none pb-6 text-center font-display text-[24vw] font-semibold leading-none tracking-tighter text-white/[0.05] md:text-[20vw]"
      >
        Vaani
      </motion.p>
    </div>
  </footer>
);
