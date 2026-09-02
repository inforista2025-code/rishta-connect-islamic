import { Button } from "@/components/ui/button";
import { MessageCircle, Users, ArrowRight } from "lucide-react";
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

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="absolute inset-0 islamic-pattern opacity-60" aria-hidden="true" />
      <div className="container mx-auto px-5 sm:px-6 relative">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 md:py-16 lg:py-20">
          {/* Copy */}
          <div className="fade-up text-center lg:text-left">
            <p className="text-sm md:text-base font-medium text-primary mb-3">
              Assalamualaikum! 🌸
            </p>
            <h1 className="text-[2rem] leading-[1.15] sm:text-4xl lg:text-5xl xl:text-[3.4rem] font-bold text-foreground tracking-tight">
              Find Your Life Partner
              <br />
              <span className="text-primary">with Confidence</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Verified Muslim profiles • Privacy protected • Marriage focused
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button
                variant="whatsapp"
                size="lg"
                onClick={handleWhatsAppClick}
                className="w-full sm:w-auto h-12 rounded-full"
              >
                <MessageCircle className="w-5 h-5" />
                Join WhatsApp Community
              </Button>
              <Button
                size="lg"
                onClick={() => navigate('/profiles')}
                className="w-full sm:w-auto h-12 rounded-full"
              >
                <Users className="w-5 h-5" />
                Browse Verified Profiles
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-1 text-sm text-muted-foreground">
              <span>Already a member?</span>
              <button
                onClick={() => navigate('/member/login')}
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                Login <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onScrollToHowToJoin}
              className="mt-5 text-xs md:text-sm font-medium text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
            >
              How to Join / Verify
            </button>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-card border border-border/70">
              <img
                src={heroImage}
                alt="Muslim wedding couple — Rishta Matrimony Islamic marriage community"
                className="w-full h-[240px] sm:h-[340px] lg:h-[440px] object-cover"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand/35 via-transparent to-transparent" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
