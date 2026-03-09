import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { SocialProof } from "@/components/landing/SocialProof";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { DemoSection } from "@/components/landing/DemoSection";
import { GlobeReviewFlow } from "@/components/landing/GlobeReviewFlow";
import { ScrollFrameSection } from "@/components/landing/ScrollFrameSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SocialProof />
      <FeaturesSection />
      <GlobeReviewFlow />
      <DemoSection />
      <ScrollFrameSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
