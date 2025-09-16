import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Facebook, Instagram } from "lucide-react";

export function NewHeroSection() {
  const handleSocialClick = (platform: string) => {
    // Placeholder links - can be easily updated
    const links = {
      whatsapp_channel: "https://wa.me/", // Add channel link
      whatsapp_community: "https://wa.me/", // Add community link
      facebook: "https://facebook.com/", // Add Facebook group link
      instagram: "https://instagram.com/" // Add Instagram link
    };
    
    window.open(links[platform as keyof typeof links] || "#", "_blank");
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center hero-gradient">
      <div className="absolute inset-0 islamic-pattern opacity-20"></div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Find Your Perfect Match
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Simple, Easy & Trusted Muslim Matrimony Platform
          </p>

          {/* Social Media Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Button
              size="lg"
              className="h-16 bg-green-600 hover:bg-green-700 text-white button-shadow flex items-center gap-3"
              onClick={() => handleSocialClick('whatsapp_channel')}
            >
              <MessageCircle className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">Join WhatsApp</div>
                <div className="text-sm opacity-90">Channel</div>
              </div>
            </Button>

            <Button
              size="lg"
              className="h-16 bg-green-500 hover:bg-green-600 text-white button-shadow flex items-center gap-3"
              onClick={() => handleSocialClick('whatsapp_community')}
            >
              <Users className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">Join WhatsApp</div>
                <div className="text-sm opacity-90">Community</div>
              </div>
            </Button>

            <Button
              size="lg"
              className="h-16 bg-blue-600 hover:bg-blue-700 text-white button-shadow flex items-center gap-3"
              onClick={() => handleSocialClick('facebook')}
            >
              <Facebook className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">Join Facebook</div>
                <div className="text-sm opacity-90">Group</div>
              </div>
            </Button>

            <Button
              size="lg"
              className="h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white button-shadow flex items-center gap-3"
              onClick={() => handleSocialClick('instagram')}
            >
              <Instagram className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">Join Instagram</div>
                <div className="text-sm opacity-90">Group</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}