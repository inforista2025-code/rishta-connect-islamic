import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "./Logo";

const navLinks = [{
  name: "Home",
  path: "/"
}, {
  name: "Profiles",
  path: "/profiles"
}, {
  name: "Pricing",
  path: "/pricing"
}, {
  name: "Register",
  path: "/register"
}, {
  name: "Contact",
  path: "/contact"
}];
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAdminLogin = () => {
    navigate("/auth");
    setIsOpen(false);
  };
  return <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center">
            <Logo size="md" showText={true} />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => <Link key={link.path} to={link.path} className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors", isActive(link.path) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted hover:text-primary")}>
                {link.name}
              </Link>)}
            {!user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAdminLogin}
                className="ml-2"
              >
                Admin Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && <div className="md:hidden pb-4 border-t border-border">
            <div className="flex flex-col space-y-2 pt-4">
              {navLinks.map(link => <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={cn("px-4 py-3 rounded-md text-sm font-medium transition-colors", isActive(link.path) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted hover:text-primary")}>
                  {link.name}
                </Link>)}
              {!user && (
                <Button
                  variant="ghost"
                  onClick={handleAdminLogin}
                  className="justify-start px-4 py-3 h-auto text-sm font-medium"
                >
                  Admin Login
                </Button>
              )}
            </div>
          </div>}
      </div>
    </nav>;
}