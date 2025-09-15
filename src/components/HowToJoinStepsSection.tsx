import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, FileText, UserCheck, Search } from "lucide-react";

export function HowToJoinStepsSection() {
  const steps = [
    {
      number: "01",
      title: "Join WhatsApp Channel",
      description: "Connect with our official WhatsApp channel to get started and receive updates",
      icon: MessageCircle,
      action: "Join Channel",
      link: "https://wa.me/" // Placeholder link
    },
    {
      number: "02", 
      title: "Fill Google Form",
      description: "Complete our detailed registration form with your profile information",
      icon: FileText,
      action: "Fill Form",
      link: "https://forms.google.com/" // Placeholder link
    },
    {
      number: "03",
      title: "Verification & Profile Approval",
      description: "Our team will review and verify your profile for authenticity",
      icon: UserCheck,
      action: "Under Review",
      link: "#"
    },
    {
      number: "04",
      title: "Browse Profiles",
      description: "Once approved, start browsing and connecting with potential matches",
      icon: Search,
      action: "Start Browsing",
      link: "#browse-profiles"
    }
  ];

  const handleStepAction = (link: string) => {
    if (link.startsWith("#")) {
      const element = document.querySelector(link);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.open(link, "_blank");
    }
  };

  return (
    <section className="py-20 section-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How to Join - Step by Step
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to create your profile and start your journey to find the perfect match
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="relative card-shadow border-0 bg-card/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  {/* Step Number */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mt-6 mb-6">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                      <step.icon className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {step.description}
                  </p>

                  {/* Action Button */}
                  <Button
                    variant={index === 2 ? "secondary" : "outline"}
                    size="sm"
                    className="w-full"
                    onClick={() => handleStepAction(step.link)}
                    disabled={index === 2}
                  >
                    {step.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}