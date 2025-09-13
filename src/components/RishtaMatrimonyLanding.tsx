import { useRef } from "react";
import { HeaderSection } from "./HeaderSection";
import { StepsSection } from "./StepsSection";
import { WhyChooseUsSection } from "./WhyChooseUsSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { CallToActionSection } from "./CallToActionSection";
import { FooterSection } from "./FooterSection";

export function RishtaMatrimonyLanding() {
  const stepsRef = useRef<HTMLDivElement>(null);

  const scrollToSteps = () => {
    stepsRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <HeaderSection onScrollToSteps={scrollToSteps} />

      {/* Steps Section */}
      <div ref={stepsRef}>
        <StepsSection />
      </div>

      {/* Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Call to Action Section */}
      <CallToActionSection />

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}