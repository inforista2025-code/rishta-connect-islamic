import { useRef } from "react";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { TrustStripSection } from "./TrustStripSection";
import { FeaturedProfilesSection } from "./FeaturedProfilesSection";
import { HowToJoinSection } from "./HowToJoinSection";
import { WhyChooseUsSection } from "./WhyChooseUsSection";
import { IslamicTrustSection } from "./IslamicTrustSection";
import { SuccessAndTrustSection } from "./SuccessAndTrustSection";
import { PremiumSection } from "./PremiumSection";
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

      {/* 1. Hero Section */}
      <HeroSection onScrollToHowToJoin={scrollToHowToJoin} />

      {/* 2. Trust Strip (Instant Social Proof) */}
      <TrustStripSection />

      {/* 3. Featured Profiles (Immediate Profile Engagement) */}
      <FeaturedProfilesSection />

      {/* 4. How It Works (Clear 3-Step Journey) */}
      <div ref={howToJoinRef} id="how-to-join">
        <HowToJoinSection />
      </div>

      {/* 5. Why Choose Us (Core Value Proposition) */}
      <WhyChooseUsSection />

      {/* 6. Islamic Trust & Ayah */}
      <IslamicTrustSection />

      {/* 7. Success Stories & Real Matches */}
      <SuccessAndTrustSection />

      {/* 8. Premium & Membership Benefits */}
      <PremiumSection />

      {/* 9. WhatsApp & Telegram Communities */}
      <CommunityLinksSection />

      {/* 10. Frequently Asked Questions (FAQ) */}
      <FAQSection />

      {/* 11. Contact Support */}
      <div ref={contactRef} id="contact">
        <ContactSection />
      </div>

      {/* 12. Footer */}
      <Footer />
    </div>
  );
}
