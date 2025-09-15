import { Heart, MessageCircle, Mail, Facebook, Instagram } from "lucide-react";

export function NewFooter() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Terms of Service", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Support", href: "#" },
    { name: "FAQ", href: "#" }
  ];

  const socialLinks = [
    { name: "WhatsApp", icon: MessageCircle, href: "https://wa.me/", color: "hover:text-green-500" },
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/", color: "hover:text-blue-500" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/", color: "hover:text-pink-500" },
    { name: "Email", icon: Mail, href: "mailto:contact@rishtamatrimony.com", color: "hover:text-blue-600" }
  ];

  const handleLinkClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.open(href, "_blank");
    }
  };

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold">Rishta Matrimony</h3>
              </div>
              <p className="text-background/80 mb-4 max-w-md">
                Your trusted Muslim matrimonial platform. Find your perfect match 
                through our secure, verified, and value-based community.
              </p>
              <p className="text-background/60 text-sm">
                🔒 100% Secure • ✅ Verified Profiles • ☪️ Islamic Values
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className="text-background/80 hover:text-background transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-background/80">
                <p>📍 Mumbai, India</p>
                <p>📞 +91 12345 67890</p>
                <p>✉️ contact@rishtamatrimony.com</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t border-background/20 pt-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="text-lg font-semibold mb-4 md:mb-0">Follow Us</h4>
              </div>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <button
                    key={index}
                    onClick={() => handleLinkClick(social.href)}
                    className={`p-3 bg-background/10 rounded-full transition-all duration-200 ${social.color} hover:bg-background/20`}
                    title={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="border-t border-background/20 pt-6 mb-6">
            <div className="text-center text-background/60 text-sm">
              <p className="mb-2">
                🛡️ Trusted by 10,000+ families • 💑 500+ successful marriages • ⭐ 4.8/5 rating
              </p>
              <p>
                "In the name of Allah, the Most Gracious, the Most Merciful"
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-background/20 pt-6 text-center">
            <p className="text-background/60 text-sm">
              © {currentYear} Rishta Matrimony. All rights reserved. Made with ❤️ for the Muslim community.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}