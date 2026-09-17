import { MessageCircle, Users, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer({ minimal = false }: { minimal?: boolean }) {
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
  ];

  const handleSocialClick = (url: string, available: boolean) => {
    if (available && url.startsWith('http')) {
      window.open(url, '_blank');
    }
  };

  return (
    <footer className={`bg-foreground text-background ${minimal ? 'py-12' : 'py-8 md:py-12'}`}>
      <div className="container mx-auto px-4">
        {minimal ? (
          <div className="flex flex-col items-center text-center gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Rishta Matrimony 🌸</h3>
              <p className="text-sm text-background/80">
                Connecting Muslim hearts with Islamic values
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-background/90">
              <Link to="/privacy-policy" className="hover:text-background/70 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-background/40">|</span>
              <Link to="/terms" className="hover:text-background/70 transition-colors">
                Terms & Conditions
              </Link>
              <span className="text-background/40">|</span>
              <Link to="/contact" className="hover:text-background/70 transition-colors">
                Contact
              </Link>
            </div>

            <div className="text-sm text-background/70">
              <p>© {currentYear} Rishta Matrimony</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Brand Section */}
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
                  Rishta Matrimony 🌸
                </h3>
                <p className="text-background/80 mb-3 md:mb-4">
                  Connecting Muslim hearts with Islamic values
                </p>
                <p className="text-sm text-background/70">
                  مسلم دلوں کو اسلامی اقدار کے ساتھ جوڑنا
                </p>
              </div>

              {/* Quick Links */}
              <div className="text-center">
                <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Quick Links</h4>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                  <Link to="/about-us" className="text-sm text-white hover:text-white/80 transition-colors">
                    About Us
                  </Link>
                  <Link to="/" className="text-sm text-white hover:text-white/80 transition-colors cursor-pointer">
                    Home
                  </Link>
                  <Link to="/profiles" className="text-sm text-white hover:text-white/80 transition-colors">
                    Profiles
                  </Link>
                  <Link to="/pricing" className="text-sm text-white hover:text-white/80 transition-colors">
                    Pricing
                  </Link>
                  <Link to="/register" className="text-sm text-white hover:text-white/80 transition-colors">
                    Register
                  </Link>
                  <Link to="/blog" className="text-sm text-white hover:text-white/80 transition-colors">
                    Blog
                  </Link>
                  <Link to="/terms" className="text-sm text-white hover:text-white/80 transition-colors">
                    Terms & Conditions
                  </Link>
                  <Link to="/privacy-policy" className="text-sm text-white hover:text-white/80 transition-colors">
                    Privacy Policy
                  </Link>
                  <Link to="/contact" className="text-sm text-white hover:text-white/80 transition-colors">
                    Contact
                  </Link>
                  <Link to="/auth" className="text-sm text-white hover:text-white/80 transition-colors">
                    Admin Login
                  </Link>
                </div>
              </div>

              {/* Contact & Social */}
              <div className="text-center md:text-right">
                <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Connect With Us</h4>
                
                {/* Contact Info */}
                <div className="space-y-1 md:space-y-2 mb-3 md:mb-4 text-background/80">
                  <div className="flex items-center justify-center md:justify-end gap-2">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">+91 9128719875</span>
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
            <div className="border-t border-background/20 mt-6 pt-6 md:mt-8 md:pt-8 text-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 items-center">
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
          </>
        )}
      </div>
    </footer>
  );
}