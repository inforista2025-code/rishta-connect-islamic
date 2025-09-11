import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MessageCircle, Send } from "lucide-react";

export function ContactSection() {
  const handleWhatsAppContact = () => {
    const message = encodeURIComponent("Assalamualaikum! I need help with Rishta Matrimony.");
    window.open(`https://wa.me/918709675950?text=${message}`, '_blank');
  };

  const handleEmailContact = () => {
    window.open('mailto:info.rista2025@gmail.com?subject=Rishta Matrimony Inquiry', '_blank');
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Contact Us
            </h2>
            <p className="text-lg text-muted-foreground">
              Have questions? We're here to help
            </p>
          </div>

          <div className="flex justify-center">
            {/* Contact Information */}
            <Card className="shadow-card border-0 bg-card/80 backdrop-blur-sm max-w-lg w-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground text-center">
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Phone/WhatsApp */}
                <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Phone / WhatsApp</h3>
                    <p className="text-muted-foreground">+91 870 967 5950</p>
                  </div>
                  <Button variant="whatsapp" size="sm" onClick={handleWhatsAppContact}>
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </Button>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-muted-foreground">info.rista2025@gmail.com</p>
                  </div>
                  <Button variant="community" size="sm" onClick={handleEmailContact}>
                    <Send className="w-4 h-4" />
                    Mail
                  </Button>
                </div>

                {/* Support Hours */}
                <div className="p-4 bg-accent/20 rounded-lg border border-accent/30">
                  <h3 className="font-semibold text-foreground mb-2">Support Hours</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                    <p>Saturday: 10:00 AM - 6:00 PM</p>
                    <p>Sunday: 12:00 PM - 4:00 PM</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    सोमवार - शुक्रवार: सुबह 9 - शाम 8 बजे तक
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}