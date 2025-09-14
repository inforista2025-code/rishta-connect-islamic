import { Card, CardContent } from "@/components/ui/card";
import { Shield, Heart, Zap } from "lucide-react";

export function WhyChooseUsSection() {
  const features = [
    {
      icon: Heart,
      title: "Islamic Guidelines",
      description: "Following proper Islamic principles in matrimonial process"
    },
    {
      icon: Shield, 
      title: "Privacy Assured",
      description: "Your personal information is completely safe and secure"
    },
    {
      icon: Zap,
      title: "Easy & Fast Process",
      description: "Simple registration and quick matching process"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-muted-foreground">
              Your trusted partner in finding the perfect match
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center shadow-card border-0 bg-card/90 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}