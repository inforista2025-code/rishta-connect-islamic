import { Check, Crown } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export function PremiumMembershipSection() {
  const features = [
    "Unlimited Profile Browse",
    "Profile Highlight / Featured",
    "Direct WhatsApp Connect",
    "Exclusive Success Stories",
    "Special WhatsApp Community"
  ];

  const handleUpgradeClick = () => {
    // Redirect to payment gateway (Razorpay/Paytm integration can be added here)
    window.open("#payment", "_blank");
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-background via-accent/10 to-primary/5">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="mb-12">
          <Badge className="mb-4" variant="secondary">
            <Crown className="w-4 h-4 mr-2" />
            Premium
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Upgrade to Premium Membership
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Unlock exclusive features and connect with verified profiles faster
          </p>
        </div>

        <Card className="bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20 shadow-elegant max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="mb-8">
              <div className="text-5xl font-bold text-primary mb-2">₹500</div>
              <div className="text-muted-foreground">/month</div>
            </div>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              variant="hero"
              onClick={handleUpgradeClick}
              className="w-full text-lg font-semibold"
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}