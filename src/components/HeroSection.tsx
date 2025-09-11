import { Button } from "@/components/ui/button";
import { MessageCircle, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-matrimony.jpg";

interface HeroSectionProps {
  onScrollToHowToJoin: () => void;
}

export function HeroSection({ onScrollToHowToJoin }: HeroSectionProps) {
  const handleWhatsAppClick = () => {
    window.open('https://www.whatsapp.com/channel/0029Vb6AIqPC1FuDwWaJVx0B', '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/20 islamic-pattern">
      <div className="absolute inset-0 bg-black/5"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Hero Image */}
          <div className="mb-8 relative">
            <img 
              src={heroImage} 
              alt="Rishta Matrimony - Islamic Marriage Community" 
              className="w-full max-w-2xl mx-auto rounded-2xl shadow-card"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-2xl"></div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
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
              Join WhatsApp Channel
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
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-card">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-semibold text-foreground mb-2">Verified Profiles</h3>
              <p className="text-sm text-muted-foreground">All profiles are reviewed and verified by our admin team</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-card">
              <div className="text-3xl mb-2">🤝</div>
              <h3 className="font-semibold text-foreground mb-2">Islamic Values</h3>
              <p className="text-sm text-muted-foreground">Connect with Muslims who share your faith and values</p>
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