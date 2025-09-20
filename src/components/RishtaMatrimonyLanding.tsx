import { useRef } from "react";
import { HeroSection } from "./HeroSection";
import { HowToJoinSection } from "./HowToJoinSection";
import { SuccessAndTrustSection } from "./SuccessAndTrustSection";
import { WhyChooseUsSection } from "./WhyChooseUsSection";
import { CommunityLinksSection } from "./CommunityLinksSection";
import { FAQSection } from "./FAQSection";
import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";

export function RishtaMatrimonyLanding() {
  const howToJoinRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToHowToJoin = () => {
    howToJoinRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection onScrollToHowToJoin={scrollToHowToJoin} />

      {/* How to Join Section */}
      <div ref={howToJoinRef}>
        <HowToJoinSection />
      </div>

      {/* Success & Trust Section */}
      <SuccessAndTrustSection />

      {/* Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* Community Links Section */}
      <CommunityLinksSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Contact Section */}
      <div ref={contactRef} id="contact">
        <ContactSection />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}