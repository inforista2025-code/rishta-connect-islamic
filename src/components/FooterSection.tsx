import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Shield, FileText } from "lucide-react";

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  const handleCallClick = () => {
    window.open('tel:+919811631653', '_self');
  };

  const handleEmailClick = () => {
    window.open('mailto:rishtamatrimony2024@gmail.com', '_self');
  };

  return (
    <footer className="py-16 bg-muted/30 border-t">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Contact Info */}
            <Card className="shadow-card border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={handleCallClick}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-full text-left"
                  >
                    <Phone className="w-4 h-4" />
                    +91 98116 31653
                  </button>
                  <button 
                    onClick={handleEmailClick}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-full text-left"
                  >
                    <Mail className="w-4 h-4" />
                    rishtamatrimony2024@gmail.com
                  </button>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    India
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="shadow-card border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => document.getElementById('steps')?.scrollIntoView({ behavior: 'smooth' })}
                    className="block text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    How to Join
                  </button>
                  <button 
                    onClick={() => window.open('https://forms.gle/HdQgKBAVbVAoT9N47', '_blank')}
                    className="block text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    Register Profile
                  </button>
                  <button 
                    onClick={() => window.open('https://chat.whatsapp.com/F0Sdw8mYaZ550w7vpcqqLi?mode=ems_wa_t', '_blank')}
                    className="block text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    WhatsApp Community
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Legal */}
            <Card className="shadow-card border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Legal & Privacy
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    Privacy Policy
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    Terms of Service
                  </div>
                  <div className="text-sm text-muted-foreground">
                    All profiles are verified and secure
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Copyright */}
          <div className="border-t pt-8 text-center">
            <p className="text-muted-foreground">
              © {currentYear} Rishta Connect Islamic Matrimony. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Made with ❤️ for the Muslim Community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}