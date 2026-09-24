import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, MessageCircle, ArrowRight, UserPlus, HelpCircle, ShieldCheck, Zap, Lock, Eye, Star, PhoneCall, Image, Send, Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageSkeleton } from "@/components/PageSkeleton";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Pricing() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageSkeleton type="pricing" />;
  }

  const freePlanFeatures = [
    {
      title: "100% Free Lifetime Registration",
      description: "Submit authentic biodata & create your verified account without paying anything.",
      status: "included"
    },
    {
      title: "Personal Member Dashboard",
      description: "Secure login with OTP to track matching profiles and received interests.",
      status: "included"
    },
    {
      title: "Browse All Verified Profiles",
      description: "Explore rishta proposals across all communities, cities and sects.",
      status: "included"
    },
    {
      title: "5 Send Interest Requests / Month",
      description: "Express initial interest in suitable profiles directly from your dashboard.",
      status: "included"
    },
    {
      title: "Shortlist & Save Profiles",
      description: "Bookmark favorite profiles to discuss and review anytime with your family.",
      status: "included"
    },
    {
      title: "Photo Visibility: Blurred",
      description: "Profile photos are blurred for standard privacy (Unlocks in Premium).",
      status: "limited"
    },
    {
      title: "Contact Details: Hidden",
      description: "Phone & WhatsApp numbers are protected (Unlocks in Premium).",
      status: "limited"
    },
    {
      title: "Who Viewed My Profile: Locked",
      description: "Visitor list is hidden for free accounts.",
      status: "limited"
    }
  ];

  const premiumPlanFeatures = [
    {
      title: "👑 1st Page Top Priority & ⭐ Premium Featured Tag",
      description: "Your profile is pinned at the top on Page 1 with a shining ⭐ Premium Featured tag so 5x more families view your biodata first.",
      highlight: true
    },
    {
      title: "Clear Original Photos Unlocked",
      description: "View high-resolution profile photos in full 100% clarity with zero blur.",
      highlight: true
    },
    {
      title: "Direct WhatsApp & Contact Access",
      description: "Get verified phone and WhatsApp numbers instantly to talk directly to families.",
      highlight: true
    },
    {
      title: "Unlimited Send Interests",
      description: "Send unlimited proposals every month without any quota or limits.",
      highlight: true
    },
    {
      title: "See 'Who Viewed My Profile'",
      description: "Full visibility of all members & families who checked out your profile.",
      highlight: true
    },
    {
      title: "⭐ Verified Premium Badge & Royal Border",
      description: "Gold verified badge on your profile builds instant trust, credibility and high response rate.",
      highlight: false
    },
    {
      title: "Weekly Priority Reposting",
      description: "Profile reshared weekly across WhatsApp & Telegram groups for max reach.",
      highlight: false
    },
    {
      title: "Dedicated Matchmaking Support",
      description: "Direct priority WhatsApp helpline for instant guidance and query resolution.",
      highlight: false
    }
  ];

  const handleWhatsAppUpgrade = () => {
    window.open(
      "https://wa.me/919128719875?text=Assalamu%20Alaikum%20Team%20Rishta%20Matrimony%2C%20I%20would%20like%20to%20upgrade%20to%20the%20Premium%20Rishta%20Plan%20(Rs.%20491%20for%202%20Months).%20Kindly%20share%20payment%20details.%20JazakAllahu%20Khair.",
      "_blank"
    );
  };

  const faqs = [
    {
      question: "What is the benefit of the '⭐ Premium Featured' tag & 1st Page Priority?",
      answer: "When your profile is upgraded to Premium, it is automatically pinned at the top of Page 1 on the Profiles listing with an exclusive '⭐ Premium Featured' badge. This gives your biodata maximum exposure and gets you 5x faster responses from suitable families."
    },
    {
      question: "How do I upgrade to the Premium Plan?",
      answer: "Click on 'Upgrade via WhatsApp' to message our support team. You can pay securely via Google Pay, PhonePe, Paytm, or UPI QR code. Your premium benefits will be activated within 15 minutes of payment confirmation."
    },
    {
      question: "Is photo privacy respected in the Free and Premium plans?",
      answer: "Yes, absolutely. We strictly adhere to Islamic privacy standards. Photos are shown only to verified, serious candidates seeking marriage."
    },
    {
      question: "Can I register for free first and upgrade later?",
      answer: "Yes! Registration is 100% free. You can browse profiles, create your biodata, and upgrade to the Premium plan whenever you wish to view contact numbers or clear photos."
    },
    {
      question: "What happens after 2 months of Premium Plan?",
      answer: "Your account will simply revert to the Free Plan. There are no automatic deductions or hidden charges. You can renew only if you wish."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Islamic Header Section */}
      <div className="relative bg-gradient-to-b from-primary/10 via-muted/20 to-background pt-8 pb-8 px-4 text-center overflow-hidden border-b mb-8">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-2xl font-serif text-primary/80 mb-1">
            ﷽
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
            Simple & Transparent Membership Plans
          </h1>
          
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Find your righteous life partner with barakah. Choose the plan that best suits your family's matchmaking needs.
          </p>
        </div>
      </div>

      {/* Pricing Cards Container */}
      <div className="container max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Free Plan Card */}
          <Card className="border border-border/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out rounded-3xl bg-card flex flex-col justify-between">
            <div>
              <CardHeader className="text-center pb-4 pt-6">
                <Badge variant="secondary" className="w-fit mx-auto mb-2 text-xs font-semibold px-3 py-1">
                  Basic Matchmaking
                </Badge>
                <CardTitle className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  Free Registration
                </CardTitle>
                <div className="text-3xl font-bold text-foreground mt-2">
                  ₹0 <span className="text-sm font-normal text-muted-foreground">/ Forever</span>
                </div>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                  Begin your matrimonial search with complete sincerity and ease.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-2">
                <div className="space-y-3">
                  {freePlanFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-1.5 rounded-lg transition-colors hover:bg-muted/40">
                      {feature.status === "included" ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0 mt-0.5">
                          <Lock className="w-3 h-3" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className={`font-semibold text-xs sm:text-sm ${feature.status === "included" ? "text-foreground" : "text-muted-foreground"}`}>
                          {feature.title}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>

            <div className="p-6 pt-0">
              <Button 
                onClick={() => navigate("/register")}
                variant="outline"
                size="lg" 
                className="w-full h-11 border-primary/40 hover:bg-primary/10 active:scale-[0.98] text-primary font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Start Free Registration</span>
              </Button>
            </div>
          </Card>

          {/* Premium Plan Card */}
          <Card className="border-2 border-primary shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 ease-out rounded-3xl bg-gradient-to-b from-primary/5 via-card to-card relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[11px] font-bold px-4 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Recommended</span>
            </div>

            <div>
              <CardHeader className="text-center pb-4 pt-6">
                <Badge className="w-fit mx-auto mb-2 text-xs font-bold px-3 py-1 bg-primary text-primary-foreground shadow-xs">
                  ⭐ Full Contact & Photos
                </Badge>
                <CardTitle className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  Premium Rishta Plan
                </CardTitle>
                <div className="text-3xl sm:text-4xl font-extrabold text-primary mt-2">
                  ₹491 <span className="text-sm font-semibold text-muted-foreground">/ 2 Months</span>
                </div>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                  Direct contacts, unblurred photos & dedicated matchmaking support.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-2">
                <div className="space-y-3">
                  {premiumPlanFeatures.map((feature, index) => (
                    <div 
                      key={index} 
                      className={`flex items-start gap-3 p-2 rounded-xl transition-all duration-200 hover:translate-x-0.5 ${feature.highlight ? "bg-primary/10 border border-primary/20 shadow-xs" : "hover:bg-muted/40"}`}
                    >
                      <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-1.5">
                          <span>{feature.title}</span>
                          {feature.highlight && (
                            <span className="text-[10px] uppercase font-extrabold bg-primary/20 text-primary px-1.5 py-0.2 rounded">
                              Unlocked
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>

            <div className="p-6 pt-0">
              <Button 
                onClick={handleWhatsAppUpgrade}
                size="lg" 
                className="w-full h-11 bg-primary hover:bg-primary/90 active:scale-[0.98] text-primary-foreground font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span>Upgrade via WhatsApp (₹491)</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>

        </div>

        {/* Frequently Asked Questions Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              <span>Frequently Asked Questions</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Common questions regarding our membership plans and activation
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full bg-card border rounded-2xl p-2 sm:p-4 shadow-xs">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-b-0 px-2">
                <AccordionTrigger className="text-left font-semibold text-xs sm:text-sm text-foreground hover:no-underline hover:text-primary py-3.5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-3.5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Islamic Hadith Footer Quote */}
        <div className="mt-12 text-center">
          <p className="text-xs sm:text-sm italic text-muted-foreground max-w-xl mx-auto">
            "When a person marries, they have fulfilled half of their religion, so let them fear Allah regarding the remaining half." – Prophet Muhammad ﷺ
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

