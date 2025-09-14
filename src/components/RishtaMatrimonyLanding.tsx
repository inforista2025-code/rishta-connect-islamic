import { useRef } from "react";
import { HeroSection } from "./HeroSection";
import { HowToJoinSection } from "./HowToJoinSection";
import { WhyChooseUsSection } from "./WhyChooseUsSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { PremiumMembershipSection } from "./PremiumMembershipSection";
import { FeaturedProfilesSection } from "./FeaturedProfilesSection";
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

      {/* How to Join Section */}
      <div ref={howToJoinRef}>
        <HowToJoinSection />
      </div>

      {/* Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Premium Membership Section */}
      <PremiumMembershipSection />

      {/* Featured Profiles Section */}
      <FeaturedProfilesSection />

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