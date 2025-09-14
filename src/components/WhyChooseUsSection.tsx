import { Shield, Heart, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function WhyChooseUsSection() {
  const features = [
    {
      icon: Shield,
      title: "Islamic Guidelines",
      description: "Following proper Islamic principles for matrimony"
    },
    {
      icon: Heart,
      title: "Privacy Assured",
      description: "Your personal information is completely secure"
    },
    {
      icon: Zap,
      title: "Easy & Fast Process",
      description: "Simple registration and quick matching system"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-muted-foreground">
            What makes us different from others
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center shadow-card border-0 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
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