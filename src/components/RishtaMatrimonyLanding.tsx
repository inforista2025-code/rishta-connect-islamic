import { useRef } from "react";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { TrustStripSection } from "./TrustStripSection";
import { FeaturedProfilesSection } from "./FeaturedProfilesSection";

import { SuccessAndTrustSection } from "./SuccessAndTrustSection";
import { TrustStatsSection } from "./TrustStatsSection";
import { IslamicTrustSection } from "./IslamicTrustSection";
import { NikahJourneySection } from "./NikahJourneySection";
import { HowToJoinSection } from "./HowToJoinSection";
import { PremiumSection } from "./PremiumSection";
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
      <Navbar />
      <HeroSection onScrollToHowToJoin={scrollToHowToJoin} />

      {/* Trust / Statistics Strip */}
      <TrustStripSection />

      {/* Featured Profiles */}
      <FeaturedProfilesSection />

      {/* Success Stories */}
      <SuccessAndTrustSection />


      {/* Islamic Trust & Marketing */}
      <IslamicTrustSection />

      {/* Trust Statistics — Secondary */}
      <TrustStatsSection />

      {/* Your Nikah Journey Starts With One Step */}
      <NikahJourneySection />

      {/* How It Works - 3 Steps */}
      <div ref={howToJoinRef}>
        <HowToJoinSection />
      </div>

      {/* Premium Banner */}
      <PremiumSection />

      {/* Why Choose Us */}
      <WhyChooseUsSection />

      {/* Communities */}
      <CommunityLinksSection />

      {/* FAQ */}
      <FAQSection />

      {/* Contact */}
      <div ref={contactRef} id="contact">
        <ContactSection />
      </div>

      <Footer />
    </div>
  );
}
