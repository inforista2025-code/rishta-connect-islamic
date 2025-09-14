import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import heroImage from "@/assets/hero-matrimony.jpg";

interface NavigationProps {
  onScrollToSection: (sectionId: string) => void;
}

export function Navigation({ onScrollToSection }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { label: "About Us", id: "about" },
    { label: "Browse Profiles", id: "browse" },
    { label: "Success Stories", id: "stories" },
  ];

  const handleNavClick = (id: string) => {
    onScrollToSection(id);
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    // Placeholder for login functionality
    console.log("Login clicked");
  };

  const handleRegister = () => {
    // Scroll to registration section or open registration
    onScrollToSection("register");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      {/* Background Image Overlay when not scrolled */}
      {!isScrolled && (
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={heroImage} 
            alt="" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      )}
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h2 className={`text-2xl font-bold transition-colors duration-300 ${
              isScrolled ? 'text-foreground' : 'text-white'
            }`}>
              Rishta Matrimony
            </h2>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-medium transition-colors duration-300 hover:text-primary ${
                  isScrolled ? 'text-foreground' : 'text-white hover:text-white/80'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-4 ml-6">
              <Button
                variant={isScrolled ? "outline" : "secondary"}
                size="sm"
                onClick={handleLogin}
                className={`transition-colors duration-300 ${
                  !isScrolled ? 'border-white/30 text-white hover:bg-white/10' : ''
                }`}
              >
                Login
              </Button>
              <Button
                variant={isScrolled ? "default" : "hero"}
                size="sm"
                onClick={handleRegister}
                className="transition-colors duration-300"
              >
                Register Free
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md transition-colors duration-300 ${
                isScrolled ? 'text-foreground hover:bg-muted' : 'text-white hover:bg-white/10'
              }`}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-md rounded-lg mt-2 shadow-lg">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="block w-full text-left px-3 py-2 text-foreground hover:bg-muted rounded-md font-medium"
                >
                  {item.label}
                </button>
              ))}
              
              {/* Mobile Action Buttons */}
              <div className="flex flex-col space-y-2 px-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogin}
                  className="w-full"
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleRegister}
                  className="w-full"
                >
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