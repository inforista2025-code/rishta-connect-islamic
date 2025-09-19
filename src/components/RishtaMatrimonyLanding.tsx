import { useRef } from "react";
import { HeroSection } from "./HeroSection";
import { WhyJoinChannelSection } from "./WhyJoinChannelSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { HowToJoinSection } from "./HowToJoinSection";
import { SuccessAndTrustSection } from "./SuccessAndTrustSection";
import { SuccessStoriesSection } from "./SuccessStoriesSection";
import { WhyChooseUsSection } from "./WhyChooseUsSection";
import { FAQSection } from "./FAQSection";
import { CommunityLinksSection } from "./CommunityLinksSection";
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

      {/* Why Join WhatsApp Channel Section */}
      <WhyJoinChannelSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* How to Join Section */}
      <div ref={howToJoinRef}>
        <HowToJoinSection />
      </div>

      {/* Success & Trust Section */}
      <SuccessAndTrustSection />

      {/* Success Stories Section */}
      <SuccessStoriesSection />

      {/* Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* FAQs Section */}
      <FAQSection />

      {/* Community Links Section */}
      <CommunityLinksSection />

      {/* Contact Section */}
      <div ref={contactRef} id="contact">
        <ContactSection />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}