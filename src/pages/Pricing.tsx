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
      title: "Profile Sharing Across Communities",
      description: "Your profile will be posted on WhatsApp Community, WhatsApp Channel, Telegram Channel, and Facebook Page."
    },
    {
      title: "Basic Chat Support",
      description: "Receive help for any questions through chat anytime."
    },
    {
      title: "Weekly Profile Reposting",
      description: "Profile reposting depends on availability and queue."
    },
    {
      title: "Community Access",
      description: "Receive matchmaking updates and Islamic reminders regularly."
    }
  ];

  const premiumPlanFeatures = [
    {
      title: "Unlimited Access",
      description: "Instantly get unlimited access to any posted profile—for free. Request detailed information for any member, anytime, without limits."
    },
    {
      title: "Priority Contact Sharing",
      description: "Get contact details of suitable profiles on priority."
    },
    {
      title: "Premium Profile Badge",
      description: "Verified badge that highlights your profile and builds trust."
    },
    {
      title: "Personal Matchmaking Support",
      description: "Receive profiles after mutual interest confirmation."
    },
    {
      title: "Communication Assistance",
      description: "We help continue conversations if there's delay or no response."
    },
    {
      title: "Location-Specific Matches",
      description: "Get personalized matches based on your preferred cities."
    },
    {
      title: "Priority Profile Reposting",
      description: "Profile reshared weekly across all groups for visibility."
    },
    {
      title: "Dedicated Point of Contact",
      description: "Direct access to our support team for faster response."
    }
  ];

  const handleWhatsAppUpgrade = () => {
    window.open(
      "https://wa.me/919128719875?text=Assalamu%20Alaikum%20Team%20Rishta%20Connect%2C%20I%20would%20like%20to%20upgrade%20to%20the%20Premium%20Rishta%20Plan%20for%20Rs.%20491%20for%202%20months.%20Kindly%20guide%20me%20with%20the%20next%20steps%2C%20JazakAllah%20khair.",
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

      {/* 1. Free Registration Plan - TOP */}
      <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
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
                onClick={() => window.location.href = '/register'}
                variant="outline"
                size="lg" 
                className="w-full mt-6 border-primary/30 hover:bg-primary/5 text-primary font-semibold rounded-full transition-all duration-300"
              >
                Register Free Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 2. Quick Access Packs Section - MIDDLE */}
      <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16 pt-0">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Quick Access Packs ⚡
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Need profile details urgently? Choose a pack and get verified biodata + photos within your selected validity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          {/* ₹49 Quick Pack */}
          <Card className="border border-primary/20 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-foreground">₹49 Quick Pack</CardTitle>
              <div className="text-3xl font-bold text-primary mt-2">₹49</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-center">
                <p className="text-foreground font-medium">Get 2 profile details</p>
                <p className="text-sm text-muted-foreground">Validity: 24 Hours</p>
              </div>
              <Button 
                onClick={() => window.open(
                  "https://wa.me/919128719875?text=Assalamu%20Alaikum%20Team%20Rishta%20Connect%2C%20I%20want%20to%20activate%20the%20%E2%82%B949%20Quick%20Pack%20(2%20profiles%2C%2024%20hours).%20Please%20guide%20me%20with%20the%20next%20steps.",
                  "_blank"
                )}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full"
              >
                Activate Pack on WhatsApp
              </Button>
            </CardContent>
          </Card>

          {/* ₹91 Starter Pack */}
          <Card className="border border-primary/20 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-foreground">₹91 Starter Pack</CardTitle>
              <div className="text-3xl font-bold text-primary mt-2">₹91</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-center">
                <p className="text-foreground font-medium">Get 4 profile details</p>
                <p className="text-sm text-muted-foreground">Validity: 7 Days</p>
              </div>
              <Button 
                onClick={() => window.open(
                  "https://wa.me/919128719875?text=Assalamu%20Alaikum%20Team%20Rishta%20Connect%2C%20I%20want%20to%20activate%20the%20%E2%82%B991%20Starter%20Pack%20(4%20profiles%2C%207%20days).%20Please%20guide%20me%20with%20the%20next%20steps.",
                  "_blank"
                )}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full"
              >
                Activate Pack on WhatsApp
              </Button>
            </CardContent>
          </Card>

          {/* ₹191 Value Pack */}
          <Card className="border-2 border-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-primary/5 to-card relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <Badge className="bg-primary text-primary-foreground text-xs shadow-md">
                Best Value
              </Badge>
            </div>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-foreground">₹191 Value Pack</CardTitle>
              <div className="text-3xl font-bold text-primary mt-2">₹191</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-center">
                <p className="text-foreground font-medium">Get 10 profile details</p>
                <p className="text-sm text-muted-foreground">Validity: 21 Days</p>
              </div>
              <Button 
                onClick={() => window.open(
                  "https://wa.me/919128719875?text=Assalamu%20Alaikum%20Team%20Rishta%20Connect%2C%20I%20want%20to%20activate%20the%20%E2%82%B9191%20Value%20Pack%20(10%20profiles%2C%2021%20days).%20Please%20guide%20me%20with%20the%20next%20steps.",
                  "_blank"
                )}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full"
              >
                Activate Pack on WhatsApp
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Note and Register Button */}
        <div className="text-center max-w-2xl mx-auto bg-primary/5 border border-primary/20 rounded-2xl p-6">
          <p className="text-foreground leading-relaxed mb-4">
            ✅ These benefits are available only for our registered & verified members. Please complete FREE registration today.
          </p>
          <Button 
            onClick={() => window.location.href = '/register'}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold rounded-full px-8"
          >
            Register Free
          </Button>
        </div>
      </div>

      {/* 3. Premium Plan - BOTTOM */}
      <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16 pt-0">
        <div className="max-w-3xl mx-auto">
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
