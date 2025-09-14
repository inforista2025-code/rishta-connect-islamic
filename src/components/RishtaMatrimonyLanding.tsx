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
  const contactRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const browseRef = useRef<HTMLDivElement>(null);
  const storiesRef = useRef<HTMLDivElement>(null);

  const scrollToHowToJoin = () => {
    howToJoinRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToSection = (sectionId: string) => {
    const refs: { [key: string]: React.RefObject<HTMLDivElement> } = {
      about: aboutRef,
      browse: browseRef,
      stories: storiesRef,
      register: howToJoinRef,
      contact: contactRef,
    };

    const targetRef = refs[sectionId];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation onScrollToSection={scrollToSection} />
      
      {/* Hero Section */}
      <HeroSection onScrollToHowToJoin={scrollToHowToJoin} />

      {/* How to Join Section */}
      <div ref={howToJoinRef}>
        <HowToJoinSection />
      </div>

      {/* Why Choose Us Section (About Us) */}
      <div ref={aboutRef}>
        <WhyChooseUsSection />
      </div>

      {/* How It Works Section */}
      <div ref={browseRef}>
        <HowItWorksSection />
      </div>

      {/* Community Links Section (Success Stories) */}
      <div ref={storiesRef}>
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