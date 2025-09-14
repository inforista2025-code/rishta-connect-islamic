import { useRef } from "react";
import { Navigation } from "./Navigation";
import { HeroSection } from "./HeroSection";
import { HowToJoinSection } from "./HowToJoinSection";
import { WhyChooseUsSection } from "./WhyChooseUsSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { CommunityLinksSection } from "./CommunityLinksSection";
import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";

export function RishtaMatrimonyLanding() {
  const howToJoinRef = useRef<HTMLDivElement>(null);
  const whyChooseUsRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToHowToJoin = () => {
    howToJoinRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToSection = (section: string) => {
    switch (section) {
      case "why-choose-us":
        whyChooseUsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case "how-it-works":
        howItWorksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case "community":
        communityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case "contact":
        contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation onScrollToSection={scrollToSection} />

      {/* Hero Section */}
      <div className="pt-16">
        <HeroSection onScrollToHowToJoin={scrollToHowToJoin} />
      </div>

      {/* How to Join Section */}
      <div ref={howToJoinRef}>
        <HowToJoinSection />
      </div>

      {/* Why Choose Us Section */}
      <div ref={whyChooseUsRef}>
        <WhyChooseUsSection />
      </div>

      {/* How It Works Section */}
      <div ref={howItWorksRef}>
        <HowItWorksSection />
      </div>

      {/* Community Links Section */}
      <div ref={communityRef}>
        <CommunityLinksSection />
      </div>

      {/* Contact Section */}
      <div ref={contactRef} id="contact">
        <ContactSection />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}