import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, CheckCircle, Users } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: UserPlus,
      title: "Register Free",
      description: "Fill basic profile",
      step: "Step 1"
    },
    {
      icon: CheckCircle,
      title: "Profile Verification",
      description: "Admin verifies profile",
      step: "Step 2"
    },
    {
      icon: Users,
      title: "View Rishtas",
      description: "Browse & Connect with potential matches",
      step: "Step 3"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple 3-step process to find your perfect match
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="text-center shadow-card border-0 bg-card/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-10 h-10" />
                  </div>
                  <div className="text-sm font-semibold text-primary mb-2">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Connection arrows for larger screens */}
          <div className="hidden md:flex justify-center items-center mt-8 space-x-4">
            <div className="text-primary text-2xl">→</div>
            <div className="text-primary text-2xl">→</div>
          </div>
        </div>
      </div>
    </section>
  );
}