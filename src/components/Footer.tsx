import { MessageCircle, Users, Facebook, Instagram, Mail, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "WhatsApp Channel",
      icon: MessageCircle,
      url: "https://www.whatsapp.com/channel/0029Vb6AIqPC1FuDwWaJVx0B",
      available: true
    },
    {
      name: "WhatsApp Community",
      icon: Users,
      url: "https://chat.whatsapp.com/F0Sdw8mYaZ550w7vpcqqLi?mode=ems_wa_t",
      available: true
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "#facebook",
      available: false
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "#instagram",
      available: false
    }
  ];

  const handleSocialClick = (url: string, available: boolean) => {
    if (available && url.startsWith('http')) {
      window.open(url, '_blank');
    }
  };

  return (
    <footer className="bg-foreground text-background py-8">
      <div className="container mx-auto px-4">
        {/* Center Navigation Links */}
        <div className="flex flex-col items-center justify-center">
          <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <a 
              href="/" 
              className="text-sm text-white hover:text-white/80 transition-colors"
            >
              Home
            </a>
            <a 
              href="/profiles" 
              className="text-sm text-white hover:text-white/80 transition-colors"
            >
              Profiles
            </a>
            <a 
              href="/pricing" 
              className="text-sm text-white hover:text-white/80 transition-colors"
            >
              Pricing
            </a>
            <a 
              href="/register" 
              className="text-sm text-white hover:text-white/80 transition-colors"
            >
              Register
            </a>
            <a 
              href="/contact" 
              className="text-sm text-white hover:text-white/80 transition-colors"
            >
              Contact
            </a>
          </nav>
          
          {/* Copyright */}
          <div className="text-xs text-white/60 mt-6">
            © {currentYear} Rishta Matrimony. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}