import { MessageCircle, Users, Facebook, Instagram, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

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
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-4">
              Rishta Matrimony 🌸
            </h3>
            <p className="text-background/80 mb-4">
              Connecting Muslim hearts with Islamic values
            </p>
            <p className="text-sm text-background/70">
              مسلم دلوں کو اسلامی اقدار کے ساتھ جوڑنا
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-white hover:text-white/80 transition-colors cursor-pointer">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/profiles" className="text-sm text-white hover:text-white/80 transition-colors">
                  Profiles
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-white hover:text-white/80 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-white hover:text-white/80 transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-white hover:text-white/80 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            
            {/* Contact Info */}
            <div className="space-y-2 mb-4 text-background/80">
              <div className="flex items-center justify-center md:justify-end gap-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+91 870 967 5950</span>
              </div>
              <div className="flex items-center justify-center md:justify-end gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">info.rista2025@gmail.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center md:justify-end gap-4">
              {socialLinks.map((social, index) => (
                <button
                  key={index}
                  onClick={() => handleSocialClick(social.url, social.available)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    social.available 
                      ? 'bg-background/20 hover:bg-background/30 text-background cursor-pointer' 
                      : 'bg-background/10 text-background/50 cursor-not-allowed'
                  }`}
                  disabled={!social.available}
                  title={social.available ? social.name : `${social.name} - Coming Soon`}
                >
                  <social.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Trust Notes */}
            <div className="text-sm text-background/70 space-y-1">
              <p>🔒 Profiles are verified before approvals</p>
              <p>🛡️ Privacy: We do not share personal details publicly</p>
            </div>

            {/* Copyright */}
            <div className="text-sm text-background/80">
              <p>© {currentYear} Rishta Matrimony. All rights reserved.</p>
              <p className="text-xs text-background/60 mt-1">
                Built with ❤️ for the Muslim community
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}