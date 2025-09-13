import { Button } from "@/components/ui/button";

interface HeaderSectionProps {
  onScrollToSteps: () => void;
}

export function HeaderSection({ onScrollToSteps }: HeaderSectionProps) {
  return (
    <header className="bg-white py-16 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">RC</span>
            </div>
            <span className="text-xl font-bold text-foreground">Rishta Connect</span>
          </div>
        </div>
        
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Find Your Perfect Match with{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Rishta Connect Islamic Matrimony
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Simple • Secure • Islamic Way to Connect
          </p>
          
          <Button 
            variant="default" 
            size="lg" 
            onClick={onScrollToSteps}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-button"
          >
            Join Now
          </Button>
        </div>
      </div>
    </header>
  );
}