import { Button } from "@/components/ui/button";
import { MessageCircle, CheckCircle, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-matrimony.jpg";

interface HeroSectionProps {
  onScrollToHowToJoin: () => void;
}

export function HeroSection({ onScrollToHowToJoin }: HeroSectionProps) {
  const navigate = useNavigate();
  
  const handleWhatsAppClick = () => {
    window.open('https://chat.whatsapp.com/F0Sdw8mYaZ550w7vpcqqLi?mode=ems_wa_t', '_blank');
  };

  const handleBrowseProfilesClick = () => {
    navigate('/profiles');
  };

  return (
    <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-end justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Rishta Matrimony - Islamic Marriage Community" 
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 pb-12 pt-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight drop-shadow-lg">
            Assalamualaikum! 🌸
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to Rishta Matrimony
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Join our Muslim Matrimony community to connect with verified profiles
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              variant="whatsapp" 
              size="lg" 
              onClick={handleWhatsAppClick}
              className="w-full sm:w-auto"
            >
              <MessageCircle className="w-6 h-6" />
              Join WhatsApp Community
            </Button>
            
            <Button 
              variant="elegant" 
              size="lg" 
              onClick={onScrollToHowToJoin}
              className="w-full sm:w-auto"
            >
              <CheckCircle className="w-6 h-6" />
              How to Join / Verify
            </Button>
            
            <Button 
              variant="elegant" 
              size="lg" 
              onClick={handleBrowseProfilesClick}
              className="w-full sm:w-auto"
            >
              <User className="w-6 h-6" />
              Browse Profiles
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-card">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-semibold text-foreground mb-2">Verified Profiles</h3>
              <p className="text-sm text-muted-foreground">All profiles are reviewed and verified by our admin team</p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-card">
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-semibold text-foreground mb-2">Secure Member Login</h3>
              <p className="text-sm text-muted-foreground">Login with WhatsApp OTP and manage your own dashboard</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-card">
              <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
              <h3 className="font-semibold text-foreground mb-2">Family Focused</h3>
              <p className="text-sm text-muted-foreground">Building meaningful relationships for marriage and family</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}