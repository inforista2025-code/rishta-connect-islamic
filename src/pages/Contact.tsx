import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Menu */}
      <Navbar />
      
      {/* Header */}
      <div className="hero-gradient py-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Get in Touch
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We're here to help you find your perfect match
        </p>
      </div>

      {/* Contact Options */}
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <div className="space-y-6">
          {/* WhatsApp Card */}
          <Card className="card-shadow border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-[#25D366]" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">WhatsApp</CardTitle>
                  <CardDescription className="text-base">
                    Quick and instant responses to your queries
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                variant="whatsapp" 
                size="lg" 
                className="w-full"
                onClick={() => {
                  window.open('https://wa.me/919128719875', '_blank');
                }}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat on WhatsApp
              </Button>
            </CardContent>
          </Card>

          {/* Email Card */}
          <Card className="card-shadow border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">Email</CardTitle>
                  <CardDescription className="text-base">
                    Send us your queries via email
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <a 
                href="mailto:info.rista2025@gmail.com"
                className="block"
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  info.rista2025@gmail.com
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Response Time Note */}
          <Card className="bg-muted/50 border-muted">
            <CardContent className="py-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">For faster response</strong>, please connect via WhatsApp. We typically respond within a few hours during business hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Available: Monday to Saturday, 9 AM - 9 PM IST
          </p>
        </div>
      </div>
    </div>
  );
}
