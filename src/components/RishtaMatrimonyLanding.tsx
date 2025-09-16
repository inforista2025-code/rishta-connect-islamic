import { Header } from "./Header";
import { NewHeroSection } from "./NewHeroSection";
import { HowToJoinStepsSection } from "./HowToJoinStepsSection";
import { BrowseProfilesSection } from "./BrowseProfilesSection";
import { PremiumUpgradeSection } from "./PremiumUpgradeSection";
import { SuccessStoriesSection } from "./SuccessStoriesSection";
import { AboutUsContactSection } from "./AboutUsContactSection";
import { NewFooter } from "./NewFooter";

export function RishtaMatrimonyLanding() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <NewHeroSection />

      {/* How to Join Steps */}
      <HowToJoinStepsSection />

      {/* Browse Profiles Section */}
      <BrowseProfilesSection />

      {/* Premium Upgrade Section */}
      <PremiumUpgradeSection />

      {/* Success Stories Section */}
      <SuccessStoriesSection />

      {/* About Us & Contact Section */}
      <AboutUsContactSection />

      {/* Footer */}
      <NewFooter />
    </div>
  );
}