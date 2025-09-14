import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  onScrollToSection: (section: string) => void;
}

export function Navigation({ onScrollToSection }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (section: string) => {
    onScrollToSection(section);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-primary">Rishta Connect</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavClick("community")}
              className="text-foreground hover:text-primary transition-colors duration-200"
            >
              Browse Profiles
            </button>
            <button
              onClick={() => handleNavClick("how-it-works")}
              className="text-foreground hover:text-primary transition-colors duration-200"
            >
              Success Stories
            </button>
            <button
              onClick={() => handleNavClick("why-choose-us")}
              className="text-foreground hover:text-primary transition-colors duration-200"
            >
              About Us
            </button>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                Login
              </Button>
              <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                Register Free
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground hover:text-primary p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => handleNavClick("community")}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors duration-200"
              >
                Browse Profiles
              </button>
              <button
                onClick={() => handleNavClick("how-it-works")}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors duration-200"
              >
                Success Stories
              </button>
              <button
                onClick={() => handleNavClick("why-choose-us")}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors duration-200"
              >
                About Us
              </button>
              
              {/* Mobile Action Buttons */}
              <div className="flex flex-col space-y-2 px-3 pt-4">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
                <Button variant="default" className="w-full bg-primary hover:bg-primary/90">
                  Register Free
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}