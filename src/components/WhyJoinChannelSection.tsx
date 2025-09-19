import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function WhyJoinChannelSection() {
  const handleChannelClick = () => {
    window.open('https://chat.whatsapp.com/F0Sdw8mYaZ550w7vpcqqLi?mode=ems_wa_t', '_blank');
  };

  return (
    <section className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="text-6xl mb-6">💬</div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why Join WhatsApp Channel?
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Pehle ke rishton ka record aur updates ke liye WhatsApp Channel join karein.
            </p>
          </div>

          <Button 
            variant="whatsapp" 
            size="lg" 
            onClick={handleChannelClick}
            className="w-full sm:w-auto text-lg px-8 py-4 hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-6 h-6 mr-2" />
            Join Channel to See Previous Rishtas
          </Button>

          <div className="mt-12 bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-card max-w-md mx-auto">
            <div className="text-4xl mb-4">📱</div>
            <p className="text-muted-foreground">
              Get instant updates about new profiles and success stories directly on WhatsApp
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}