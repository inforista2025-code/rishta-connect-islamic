import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Users, FileText, Clock, Heart } from "lucide-react";

export function StepsSection() {
  const handleWhatsAppChannelClick = () => {
    window.open('https://whatsapp.com/channel/0029VaAqSMRFzlEOkzHrEe3c', '_blank');
  };

  const handleWhatsAppCommunityClick = () => {
    window.open('https://chat.whatsapp.com/F0Sdw8mYaZ550w7vpcqqLi?mode=ems_wa_t', '_blank');
  };

  const handleGoogleFormClick = () => {
    window.open('https://forms.gle/HdQgKBAVbVAoT9N47', '_blank');
  };

  const steps = [
    {
      number: 1,
      title: "Join our WhatsApp Channel",
      description: "Get regular updates and announcements",
      icon: MessageCircle,
      action: handleWhatsAppChannelClick,
      buttonText: "Join Channel",
      buttonClass: "bg-blue-500 hover:bg-blue-600 text-white"
    },
    {
      number: 2,
      title: "Join our WhatsApp Community",
      description: "Connect with other members",
      icon: Users,
      action: handleWhatsAppCommunityClick,
      buttonText: "Join Community",
      buttonClass: "bg-green-500 hover:bg-green-600 text-white"
    },
    {
      number: 3,
      title: "Fill the Registration Form",
      description: "Complete your profile details",
      icon: FileText,
      action: handleGoogleFormClick,
      buttonText: "Register Profile",
      buttonClass: "bg-primary hover:bg-primary/90 text-white"
    },
    {
      number: 4,
      title: "Wait for Admin to Contact You",
      description: "Our team will review and verify your profile",
      icon: Clock,
      action: null,
      buttonText: null,
      buttonClass: null
    },
    {
      number: 5,
      title: "Get Matched with Suitable Profiles",
      description: "Start connecting with compatible matches",
      icon: Heart,
      action: null,
      buttonText: null,
      buttonClass: null
    }
  ];

  return (
    <section id="steps" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Clear & Simple Steps
          </h2>
          <p className="text-lg text-muted-foreground">
            Follow these easy steps to get started
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {steps.map((step) => (
              <Card key={step.number} className="shadow-card border-0 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0">
                      {step.number}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <step.icon className="w-6 h-6 text-primary" />
                        <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                    
                    {step.action && step.buttonText && (
                      <Button
                        onClick={step.action}
                        className={`${step.buttonClass} px-6 py-3 font-semibold rounded-lg shadow-button flex-shrink-0`}
                      >
                        {step.buttonText}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}