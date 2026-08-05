import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageSkeleton } from "@/components/PageSkeleton";

export default function Pricing() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load for skeleton display
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageSkeleton type="pricing" />;
  }
  const freePlanFeatures = [
    {
      title: "Free Registration",
      description: "Start your journey without any cost — simple and accessible for everyone."
    },
    {
      title: "Personal Member Dashboard",
      description: "Secure login with WhatsApp + Email OTP — access your profile, matches, and activity anytime."
    },
    {
      title: "Browse Verified Profiles",
      description: "Explore all verified opposite-gender profiles across the community (photos blurred, contact hidden — upgrade to unlock)."
    },
    {
      title: "5 Send Interest Requests / Month",
      description: "Express interest in profiles you like — connect with up to 5 members every month."
    },
    {
      title: "Shortlist & Save Profiles",
      description: "Bookmark profiles you like and revisit them anytime from your dashboard."
    },
    {
      title: "Profile Sharing Across Communities",
      description: "Your profile is posted on WhatsApp Community, WhatsApp Channel, Telegram Channel, and Facebook Page."
    },
    {
      title: "Basic Match Recommendations",
      description: "Get suggested profiles based on your basic preferences — refreshed regularly."
    },
    {
      title: "Community Access & Chat Support",
      description: "Receive matchmaking updates, Islamic reminders, and help from our support team over chat."
    }
  ];

  const premiumPlanFeatures = [
    {
      title: "Unlimited Profile Access",
      description: "Browse every verified profile without daily limits — full biodata, family details, and preferences unlocked."
    },
    {
      title: "Clear Original Photos",
      description: "View all profile photos in full clarity — no blur, no restrictions — so you can decide with confidence."
    },
    {
      title: "Direct Contact Access",
      description: "Get WhatsApp number and email of matched profiles instantly, without waiting for admin approval."
    },
    {
      title: "Unlimited Interests",
      description: "Send unlimited Send Interest requests every month — free members are capped at just 5."
    },
    {
      title: "Premium Profile Badge",
      description: "A verified Premium badge on your profile builds trust and gets you noticed first by serious families."
    },
    {
      title: "Priority Ranking in Matches",
      description: "Your profile appears at the top of Recommended and Browse lists, so more families see you first."
    },
    {
      title: "See Who Viewed You",
      description: "Full visibility into every member who viewed your profile — turn interest into real conversations."
    },
    {
      title: "Personalized Match Recommendations",
      description: "Curated opposite-gender verified profiles matched to your city, sect, and preferences."
    },
    {
      title: "Priority Profile Reposting",
      description: "Your profile is reshared weekly across WhatsApp, Telegram, and Facebook groups for maximum reach."
    },
    {
      title: "Dedicated Matchmaking Support",
      description: "Direct WhatsApp line to our matchmaking team for faster replies, guidance, and follow-ups."
    }
  ];

  const handleWhatsAppUpgrade = () => {
    window.open(
      "https://wa.me/917672933587?text=Assalamu%20Alaikum%20Team%20Rishta%20Connect%2C%20I%20would%20like%20to%20upgrade%20to%20the%20Premium%20Rishta%20Plan%20for%20Rs.%20491%20for%202%20months.%20Kindly%20guide%20me%20with%20the%20next%20steps%2C%20JazakAllah%20khair.",
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="py-16 px-4 text-center bg-gradient-to-b from-primary/5 to-background">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight max-w-5xl mx-auto">
          🌸 Find Your Halal Rishta with Barakah – Choose the Plan That Suits You Best!
        </h1>
      </div>

      {/* Pricing Cards */}
      <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16 pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Free Plan Card */}
          <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl md:text-3xl mb-3 text-foreground">
                Free Registration Plan
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground leading-relaxed">
                Begin your rishta journey with sincerity and ease — absolutely free. Let your profile reach more families, In shaa Allah.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                {freePlanFeatures.map((feature, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{feature.title}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                variant="outline"
                size="lg" 
                className="w-full mt-6 border-primary/30 hover:bg-primary/5 text-primary font-semibold rounded-full transition-all duration-300"
              >
                Continue Free Plan
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan Card */}
          <Card className="border-2 border-primary shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-primary/5 to-card relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-primary text-primary-foreground shadow-md">
                Most Popular
              </Badge>
            </div>

            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl md:text-3xl mb-3 text-foreground">
                Premium Rishta Plan
              </CardTitle>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                ₹491 / 2 Months
              </div>
              <CardDescription className="text-base text-muted-foreground leading-relaxed">
                Find your life partner faster with personalized support and Barakah-filled process, In shaa Allah.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                {premiumPlanFeatures.map((feature, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{feature.title}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleWhatsAppUpgrade}
                size="lg" 
                className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                Upgrade via WhatsApp
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            🌸 With sincerity, dua, and effort — may every rishta bring peace, deen, and happiness. 🤍
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
