import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const links = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      data-testid="navbar"
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between px-6 transition-all duration-500 md:px-10 ${
          scrolled ? "py-3" : "py-6"
        }`}
      >
        <a
          href="#top"
          data-testid="navbar-logo"
          className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-500 ${
            scrolled ? "bg-vaani-surface/80 backdrop-blur-xl shadow-sm" : ""
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-vaani-terracotta" />
          <span className="font-mono text-sm font-semibold uppercase tracking-[0.35em] text-vaani-ink">
            Vaani
          </span>
        </a>

        <nav
          className={`hidden items-center gap-8 rounded-full px-8 py-3 transition-all duration-500 lg:flex ${
            scrolled ? "bg-vaani-surface/80 backdrop-blur-xl shadow-sm" : ""
          }`}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-vaani-muted transition-colors hover:text-vaani-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#top"
            data-testid="navbar-login"
            className="hidden rounded-full px-4 py-2 text-sm text-vaani-ink transition-colors hover:text-vaani-terracotta sm:block"
          >
            Log in
          </a>
          <a
            href="#pricing"
            data-testid="navbar-cta"
            className="group flex items-center gap-1.5 rounded-full bg-vaani-ink px-5 py-2.5 text-sm text-vaani-bg transition-transform duration-300 hover:scale-[1.03]"
          >
            Get Started
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </motion.header>
  );
};
