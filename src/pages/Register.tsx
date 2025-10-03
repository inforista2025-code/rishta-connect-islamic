import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Moon, Shield, CheckCircle, Users, Heart, Award } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export default function Register() {
  const handleRegisterClick = () => {
    window.open("https://forms.gle/HdQgKBAVbVAoT9N47", "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Menu */}
      <Navbar />
      
      {/* Header Section */}
      <div className="hero-gradient py-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
          Registration Form
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto italic">
          Fill the registration form to join our verified and halal matrimonial community.
        </p>
      </div>

      {/* Main Content */}
      <div className="container max-w-3xl mx-auto px-4 py-12 space-y-8">
        
        {/* Main Call-to-Action Button */}
        <div className="text-center">
          <Button 
            onClick={handleRegisterClick}
            size="lg"
            className="w-full md:w-auto px-12 py-8 text-xl font-bold rounded-xl hover:scale-105 transition-transform duration-300 card-shadow"
          >
            Register Now
          </Button>
        </div>

        {/* Islamic Assurance Section */}
        <Card className="border-primary/30 card-shadow overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
              <div className="flex items-center gap-2">
                <Moon className="w-8 h-8 text-primary" />
                <Badge variant="default" className="text-sm px-3 py-1">
                  100% Halal Process
                </Badge>
              </div>
              <div className="hidden md:block text-primary">•</div>
              <p className="text-sm md:text-base text-foreground">
                All profiles verified with Government ID – Trust & Transparency assured.
              </p>
            </div>
          </div>
        </Card>

        {/* Privacy & Security Note */}
        <Card className="bg-primary/5 border-primary/20 card-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Privacy & Security Note</h3>
                <p className="text-sm text-muted-foreground">
                  All details remain private. Contact details are only shared after ID verification.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trust Counters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary mb-1">500+</div>
            <div className="text-sm text-muted-foreground">Verified Profiles</div>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary mb-1">100+</div>
            <div className="text-sm text-muted-foreground">Successful Matches</div>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <Award className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary mb-1">100%</div>
            <div className="text-sm text-muted-foreground">Community Trust</div>
          </Card>
        </div>

        {/* Islamic Quote Section */}
        <div className="text-center py-8">
          <p className="text-base md:text-lg italic text-muted-foreground">
            "Nikah is half of faith – Prophet Muhammad ﷺ"
          </p>
        </div>

      </div>
    </div>
  );
}
