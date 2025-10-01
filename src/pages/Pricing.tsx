import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Menu */}
      <Navbar />
      
      {/* Header */}
      <div className="hero-gradient py-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get full access to all profiles and connect with your perfect match
        </p>
      </div>

      {/* Pricing Card */}
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="card-shadow border-2 border-primary/20 relative overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute top-6 right-6">
              <Badge className="bg-primary text-primary-foreground">
                Most Popular
              </Badge>
            </div>

            <CardHeader className="text-center pb-8 pt-8">
              <CardTitle className="text-3xl mb-2">Basic Access</CardTitle>
              <CardDescription className="text-lg">
                Everything you need to find your perfect match
              </CardDescription>
              <div className="mt-6">
                <span className="text-5xl font-bold text-primary">₹491</span>
                <span className="text-muted-foreground text-lg">/month</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Features List */}
              <div className="space-y-4">
                {[
                  "View full profiles",
                  "See detailed biodata",
                  "Access contact details",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full mt-8 button-shadow"
              >
                Upgrade Now
              </Button>

              {/* Support Note */}
              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  💚 Your support helps us keep this platform safe and secure for everyone.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center text-muted-foreground">
          <p className="text-sm">
            Secure payment processing • Cancel anytime • Questions?{" "}
            <a href="/#contact" className="text-primary hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
