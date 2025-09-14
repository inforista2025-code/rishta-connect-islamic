import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export function CallToActionSection() {
  const handleStartJourney = () => {
    document.getElementById('steps')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Find Your Life Partner?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of Muslims who found their perfect match through our platform
          </p>
          
          <Button
            onClick={handleStartJourney}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-12 py-6 text-xl font-semibold rounded-xl shadow-button transform hover:scale-105 transition-all duration-300"
          >
            <Heart className="w-6 h-6 mr-2" />
            Start Your Journey Now
          </Button>
        </div>
      </div>
    </section>
  );
}