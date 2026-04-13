import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Star, Unlock, Phone, Eye, Award, Zap } from "lucide-react";

export function PremiumSection() {
  const navigate = useNavigate();

  const features = [
    { icon: Unlock, text: "Unlimited Access", description: "Instantly get unlimited access to any posted profile with photos—for free." },
    { icon: Phone, text: "Access Contact Numbers" },
    { icon: Eye, text: "Priority Profile Visibility" },
    { icon: Award, text: "Profile Highlight Badge" },
    { icon: Zap, text: "Faster Matchmaking Support" },
  ];

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Crown Icon */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">👑</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-1">
                Unlock Full Profiles & Get Serious Matches Faster!
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Go Premium to view contact details, chat directly, and get priority support.
              </p>

              {/* Feature bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">
                      {feature.text && <strong>{feature.text}</strong>}
                      {feature.description && <span className="font-normal"> {feature.description}</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex-shrink-0 w-full md:w-auto text-center">
              <Button
                onClick={() => navigate("/pricing")}
                className="w-full md:w-auto bg-foreground text-background hover:bg-foreground/90 rounded-full px-6 transition-transform duration-200 hover:scale-105"
                size="lg"
              >
                <Star className="w-4 h-4" />
                View Pricing Plans
              </Button>
              <p className="text-base font-bold text-primary mt-2">₹491 / 2 Months</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
