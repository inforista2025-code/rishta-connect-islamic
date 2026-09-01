import { Button } from "@/components/ui/button";
import { MessageCircle, Users, ShieldCheck } from "lucide-react";
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
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/60 to-background">
      <div className="container mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 rounded-full px-3 py-1 mb-4">
              Assalamualaikum! 🌸
            </p>

            <h1 className="text-[2rem] leading-[1.15] sm:text-4xl lg:text-5xl xl:text-[3.4rem] font-bold text-foreground tracking-tight">
              Find Your Life Partner
              <br />
              <span className="text-primary">with Confidence</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Verified Muslim profiles • Privacy protected • Marriage focused
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button
                variant="whatsapp"
                size="lg"
                onClick={handleWhatsAppClick}
                className="w-full sm:w-auto h-12 rounded-full px-6"
              >
                <MessageCircle className="w-5 h-5" />
                Join WhatsApp Community
              </Button>

              <Button
                size="lg"
                onClick={handleBrowseProfilesClick}
                className="w-full sm:w-auto h-12 rounded-full px-6"
              >
                <Users className="w-5 h-5" />
                Browse Verified Profiles
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Already a member?{" "}
              <button
                onClick={() => navigate('/member/login')}
                className="font-semibold text-primary underline underline-offset-4 hover:opacity-80"
              >
                Login
              </button>
            </p>

            <button
              onClick={onScrollToHowToJoin}
              className="mt-5 inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-primary" />
              Every profile is manually reviewed — see how it works
            </button>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-[0_18px_50px_-24px_hsl(var(--foreground)/0.35)]">
              <img
                src={heroImage}
                alt="Muslim couple on their wedding day — Rishta Matrimony"
                className="w-full h-[240px] sm:h-[340px] lg:h-[440px] object-cover"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
