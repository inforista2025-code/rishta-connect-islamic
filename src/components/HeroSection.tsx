import { Button } from "@/components/ui/button";
import { MessageCircle, User, LogIn } from "lucide-react";
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

  const handleLoginClick = () => {
    navigate('/member-login');
  };

  const stats = [
    { number: "500+", label: "Verified Profiles" },
    { number: "50+", label: "Successful Marriages" },
    { number: "100%", label: "Profiles Reviewed" },
    { number: "Privacy First", label: "Your Safety Matters" },
  ];

  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-end justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Rishta Matrimony - Islamic Nikah Ceremony"
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pb-10 pt-16 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Greeting */}
          <p className="text-lg md:text-xl font-medium text-primary mb-3">
            Assalamualaikum! 🌸
          </p>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight drop-shadow-lg">
            Find Your Life Partner
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              with Confidence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Verified Muslim profiles. Privacy protected. Marriage-focused.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              variant="whatsapp"
              size="lg"
              onClick={handleWhatsAppClick}
              className="w-full sm:w-auto rounded-full"
            >
              <MessageCircle className="w-5 h-5" />
              Join WhatsApp Community
            </Button>

            <Button
              variant="elegant"
              size="lg"
              onClick={handleBrowseProfilesClick}
              className="w-full sm:w-auto rounded-full"
            >
              <User className="w-5 h-5" />
              Browse Profiles
            </Button>
          </div>

          {/* Login Link */}
          <button
            onClick={handleLoginClick}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10"
          >
            <LogIn className="w-4 h-4" />
            Already a member? Login
          </button>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-card/70 backdrop-blur-sm border rounded-xl px-4 py-3 text-center shadow-sm"
              >
                <p className="text-lg md:text-xl font-bold text-primary">{stat.number}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
