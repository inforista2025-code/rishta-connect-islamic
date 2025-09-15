import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Phone, Star, Users, Headphones } from "lucide-react";

export function PremiumUpgradeSection() {
  const benefits = [
    {
      icon: Phone,
      title: "View Contact Details",
      description: "Access phone numbers and direct contact information of all profiles"
    },
    {
      icon: Star,
      title: "Priority Support",
      description: "Get priority assistance and faster response from our support team"
    },
    {
      icon: Users,
      title: "Unlimited Connections",
      description: "Connect with unlimited profiles without any restrictions"
    },
    {
      icon: Crown,
      title: "Profile Highlighting",
      description: "Make your profile stand out with premium highlighting features"
    },
    {
      icon: Headphones,
      title: "Dedicated Support",
      description: "Personal matchmaking assistance from our dedicated team"
    }
  ];

  const handleUpgradeClick = () => {
    // Placeholder link - can be easily updated to payment gateway
    window.open("https://razorpay.com/", "_blank"); // Or use Paytm link
  };

  return (
    <section className="py-20 hero-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Crown className="w-5 h-5" />
              <span className="font-semibold">Premium Membership</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Upgrade to Premium Membership
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlock all features and get priority access to find your perfect match faster
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Benefits List */}
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Card */}
            <div className="flex justify-center">
              <Card className="w-full max-w-sm card-shadow border-2 border-primary/20 bg-card/95 backdrop-blur-sm">
                <CardHeader className="text-center pb-8">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Premium Plan</CardTitle>
                  <div className="text-4xl font-bold text-primary mb-2">
                    ₹500
                    <span className="text-lg font-normal text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground">Everything you need to find your match</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      "View Contact Details",
                      "Priority Support", 
                      "Unlimited Connections",
                      "Profile Highlighting",
                      "Dedicated Support"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground button-shadow"
                    size="lg"
                    onClick={handleUpgradeClick}
                  >
                    Upgrade Now
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    Secure payment via Razorpay/Paytm
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}