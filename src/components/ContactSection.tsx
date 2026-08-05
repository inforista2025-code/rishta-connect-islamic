import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageCircle, Send, Clock } from "lucide-react";

export function ContactSection() {
  const handleWhatsAppContact = () => {
    const message = encodeURIComponent("Assalamualaikum! I need help with Rishta Matrimony.");
    window.open(`https://wa.me/917672933587?text=${message}`, "_blank");
  };

  const handleEmailContact = () => {
    window.open("mailto:info.rista2025@gmail.com?subject=Rishta Matrimony Inquiry", "_blank");
  };

  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
              GET IN TOUCH
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              We're Here to Help You
            </h2>
            <p className="text-muted-foreground">
              Have questions or need assistance? Contact us anytime!
            </p>
          </div>

          {/* Contact Cards - Horizontal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Phone / WhatsApp */}
            <div className="bg-card border rounded-xl p-5 flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Phone / WhatsApp</h3>
                  <p className="text-sm text-muted-foreground">+91 7672933587</p>
                </div>
              </div>
              <Button variant="whatsapp" size="sm" className="w-full" onClick={handleWhatsAppContact}>
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </Button>
            </div>

            {/* Email */}
            <div className="bg-card border rounded-xl p-5 flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Email Us</h3>
                  <p className="text-sm text-muted-foreground">info.rishta2025@gmail.com</p>
                </div>
              </div>
              <Button variant="community" size="sm" className="w-full" onClick={handleEmailContact}>
                <Send className="w-4 h-4" />
                Send Email
              </Button>
            </div>

            {/* Support Hours */}
            <div className="bg-card border rounded-xl p-5 flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Support Hours</h3>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Mon - Fri: 9:00 AM - 8:00 PM</p>
                <p>Sat: 10:00 AM - 6:00 PM</p>
                <p>Sun: 12:00 PM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
