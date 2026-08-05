import { SmoothScroll } from "@/components/Swara/SmoothScroll";
import { Navbar } from "@/components/Swara/Navbar";
import { Hero } from "@/components/Swara/Hero";
import { Marquee } from "@/components/Swara/Marquee";
import { SeeItInAction } from "@/components/Swara/SeeItInAction";
import { Manifesto } from "@/components/Swara/Manifesto";
import { UseCases } from "@/components/Swara/UseCases";
import { Features } from "@/components/Swara/Features";
import { ROICalculator } from "@/components/Swara/ROICalculator";
import { Pricing } from "@/components/Swara/Pricing";
import { SocialProof } from "@/components/Swara/SocialProof";
import { FinalCTA, Footer } from "@/components/Swara/FinalCTA";

export default function Landing() {
  return (
    <SmoothScroll>
      <div data-testid="landing-page" className="min-h-screen bg-swara-cream font-sans text-swara-ink">
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
