import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./motion";
import { Mandala } from "./Mandala";

const LOGO =
  "https://customer-assets.emergentagent.com/job_voice-assistant-pro-43/artifacts/6dhgm9jo_Maroon%20Beige%20Flat%20Illustrative%20Indian%20Wedding%20Event%20Logo.png";

export const FinalCTA = () => (
  <section
    data-testid="final-cta"
    className="relative overflow-hidden bg-vaani-white px-6 py-28 md:px-10 md:py-40"
  >
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-[0.05]">
      <Mandala color="#6E1A1A" strokeWidth={1.2} duration={120} className="h-full w-full" />
    </div>
    <div className="relative z-10 mx-auto max-w-[1000px] text-center">
      <Reveal>
        <img src={LOGO} alt="Vaani" className="mx-auto mb-10 h-20 w-20 rounded-2xl object-cover shadow-md" />
        <h2 className="font-serif text-5xl font-light leading-[1.0] tracking-tight text-vaani-maroon md:text-8xl">
          Ready to give your business a voice?
        </h2>
        <p className="mt-8 text-lg text-vaani-muted">Join 200+ businesses already using Vaani.</p>
        <a
          href="#pricing"
          data-testid="final-cta-button"
          className="group mt-10 inline-flex items-center gap-2 rounded-full bg-vaani-maroon px-8 py-4 text-sm font-medium text-vaani-cream transition-all duration-300 hover:bg-vaani-maroon-dark hover:-translate-y-0.5"
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
  <footer data-testid="footer" className="relative overflow-hidden bg-vaani-maroon px-6 pt-24 text-vaani-cream md:px-10">
    <div className="pointer-events-none absolute -right-40 top-10 h-[500px] w-[500px] opacity-[0.07]">
      <Mandala color="#E8DCC4" duration={150} className="h-full w-full" />
    </div>
    <div className="relative z-10 mx-auto max-w-[1400px]">
      <div className="grid gap-12 border-b border-vaani-cream/15 pb-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="Vaani" className="h-10 w-10 rounded-lg object-cover" />
            <span className="font-serif text-2xl font-medium tracking-[0.2em]">VAANI</span>
          </div>
          <p className="mt-5 max-w-xs text-sm text-vaani-cream/60">AI voice agents for every business.</p>
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
                    className="text-sm text-vaani-cream/80 transition-colors hover:text-vaani-gold"
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
        <p className="font-mono text-xs text-vaani-cream/50">
          © 2026 Vaani. All rights reserved. · Built with ☕ in Bengaluru
        </p>
        <div className="flex gap-5 font-mono text-xs text-vaani-cream/70">
          <a href="#top" className="transition-colors hover:text-vaani-gold">𝕏</a>
          <a href="#top" className="transition-colors hover:text-vaani-gold">GitHub</a>
          <a href="#top" className="transition-colors hover:text-vaani-gold">LinkedIn</a>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="select-none pb-6 text-center font-serif text-[24vw] font-light leading-none tracking-tighter text-vaani-cream/[0.08] md:text-[20vw]"
      >
        VAANI
      </motion.p>
    </div>
  </footer>
);
