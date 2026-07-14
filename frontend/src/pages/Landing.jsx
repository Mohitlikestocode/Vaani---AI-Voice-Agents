import { SmoothScroll } from "@/components/vaani/SmoothScroll";
import { Navbar } from "@/components/vaani/Navbar";
import { Hero } from "@/components/vaani/Hero";
import { Marquee } from "@/components/vaani/Marquee";
import { SeeItInAction } from "@/components/vaani/SeeItInAction";
import { Manifesto } from "@/components/vaani/Manifesto";
import { UseCases } from "@/components/vaani/UseCases";
import { Features } from "@/components/vaani/Features";
import { ROICalculator } from "@/components/vaani/ROICalculator";
import { Pricing } from "@/components/vaani/Pricing";
import { SocialProof } from "@/components/vaani/SocialProof";
import { FinalCTA, Footer } from "@/components/vaani/FinalCTA";

export default function Landing() {
  return (
    <SmoothScroll>
      <div data-testid="landing-page" className="min-h-screen bg-vaani-cream font-sans text-vaani-ink">
        <Navbar />
        <main>
          <Hero />
          <Marquee />
          <SeeItInAction />
          <Manifesto />
          <UseCases />
          <Features />
          <ROICalculator />
          <Pricing />
          <SocialProof />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
