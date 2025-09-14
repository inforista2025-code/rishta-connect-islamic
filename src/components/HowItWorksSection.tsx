import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, FileText, Users } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: UserPlus,
      title: "Join",
      description: "Join our WhatsApp community and channel"
    },
    {
      icon: FileText,
      title: "Register", 
      description: "Fill out the registration form with your details"
    },
    {
      icon: Users,
      title: "Get Matched",
      description: "Admin will contact you with suitable profiles"
    }
  ];

  return (
    <section className="py-20 section-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple 3-step process to find your perfect match
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="text-center shadow-card border-0 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                      {index + 1}
                    </div>
                    <div className="w-12 h-12 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                
                {/* Arrow connector for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-0.5 bg-primary/30"></div>
                    <div className="absolute -right-1 -top-1 w-2 h-2 bg-primary/30 rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}