import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, BookOpen, Zap, HeadphonesIcon } from "lucide-react";

export function WhyChooseUsSection() {
  const features = [
    {
      icon: ShieldCheck,
      title: "100% Verified Profiles",
      description: "Manual verification ensures genuine profiles",
    },
    {
      icon: BookOpen,
      title: "Islamic Values Focused",
      description: "Matching based on faith and compatibility",
    },
    {
      icon: Zap,
      title: "Easy & Fast Process",
      description: "Simple registration and quick matching",
    },
    {
      icon: HeadphonesIcon,
      title: "Dedicated Support",
      description: "",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Why Choose <span className="text-primary">Rishta Matrimony?</span>
          </h2>
          <p className="text-muted-foreground mt-2">
            Your trusted partner in finding a halal life partner!
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center border shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm md:text-base mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
