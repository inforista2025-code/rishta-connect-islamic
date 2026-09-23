// Rishta Matrimony - Official Contact & Community Support (Updated)
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Mail,
  Clock,
  Send,
  Users,
  Instagram,
  ShieldCheck,
  HeartHandshake,
  HelpCircle,
  Sparkles,
  PhoneCall,
  UserPlus
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    queryType: "General Inquiry",
    message: "",
  });

  const communityChannels = [
    {
      name: "WhatsApp Channel",
      tag: "Broadcasts",
      description: "Get instant announcements, new feature updates & notices.",
      icon: MessageCircle,
      url: "https://www.whatsapp.com/channel/0029Vb6AIqPC1FuDwWaJVx0B",
      buttonText: "Join WhatsApp Channel",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      btnClass: "bg-[#25D366] hover:bg-[#20bd5a] text-white",
    },
    {
      name: "WhatsApp Community",
      tag: "Community",
      description: "Connect with serious families, discussions & matrimonial help.",
      icon: Users,
      url: "https://chat.whatsapp.com/F0Sdw8mYaZ550w7vpcqqLi?mode=ems_wa_t",
      buttonText: "Join WhatsApp Community",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    {
      name: "Telegram Channel",
      tag: "Daily Matches",
      description: "Daily verified rishta alerts, biodata updates & instant alerts.",
      icon: Send,
      url: "https://t.me/Rishtamatrimony",
      buttonText: "Join Telegram Channel",
      iconBg: "bg-sky-100 dark:bg-sky-900/30",
      iconColor: "text-sky-600 dark:text-sky-400",
      btnClass: "bg-sky-600 hover:bg-sky-700 text-white",
    },
    {
      name: "Instagram Official",
      tag: "Stories & Tips",
      description: "Follow us for marriage advice, sunnah reminders & success stories.",
      icon: Instagram,
      url: "https://www.instagram.com/rishtamatrimony786?stkn=MXBjajltZWFwMXdrdQ==",
      buttonText: "Follow on Instagram",
      iconBg: "bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30",
      iconColor: "text-pink-600 dark:text-pink-400",
      btnClass: "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:opacity-90 text-white border-0",
    },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      toast({
        title: "Please fill all fields",
        description: "Name, phone number, and message are required.",
        variant: "destructive",
      });
      return;
    }

    const messageText = `Assalamu Alaikum Rishta Matrimony Team,%0A%0A*Name:* ${encodeURIComponent(formData.name)}%0A*Phone:* ${encodeURIComponent(formData.phone)}%0A*Subject:* ${encodeURIComponent(formData.queryType)}%0A*Message:* ${encodeURIComponent(formData.message)}`;
    window.open(`https://wa.me/919128719875?text=${messageText}`, "_blank");
    
    toast({
      title: "Opening WhatsApp...",
      description: "Redirecting to WhatsApp to send your inquiry directly.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
          <Badge className="bg-primary/15 text-primary border-primary/20 px-3.5 py-1 mb-4 text-xs font-semibold rounded-full inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> We're Here to Help Your Halal Journey
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            Get in Touch with <span className="text-primary">Rishta Matrimony</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have questions about profile verification, premium matchmaking, biodata updates, or wali assistance? Our dedicated support team is here to guide you with sincerity.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl pb-20 space-y-16">
        
        {/* 1. Quick Direct Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* WhatsApp Direct */}
          <Card className="border-2 border-primary/20 hover:border-primary hover:-translate-y-1.5 transition-all duration-300 ease-out shadow-sm hover:shadow-xl bg-card flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center mb-3 text-[#25D366] transition-transform duration-300 group-hover:scale-110">
                <MessageCircle className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">WhatsApp Support</CardTitle>
              <CardDescription className="text-sm">Fastest replies for verifications, match assistance & premium plans.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-primary" /> +91 9128719875
              </p>
              <Button
                variant="whatsapp"
                size="lg"
                className="w-full h-11 rounded-full shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200"
                onClick={() => window.open("https://wa.me/919128719875", "_blank")}
              >
                <MessageCircle className="w-4 h-4 mr-2" /> Chat on WhatsApp
              </Button>
            </CardContent>
          </Card>

          {/* Email Support */}
          <Card className="border border-border hover:border-primary/50 hover:-translate-y-1.5 transition-all duration-300 ease-out shadow-sm hover:shadow-xl bg-card flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary transition-transform duration-300 group-hover:scale-110">
                <Mail className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">Email Support</CardTitle>
              <CardDescription className="text-sm">For official queries, biodata submission & partnership inquiries.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <p className="text-sm font-semibold text-foreground truncate">
                info.rista2025@gmail.com
              </p>
              <Button
                variant="outline"
                size="lg"
                className="w-full h-11 rounded-full border-primary/30 hover:bg-primary/10 active:scale-[0.98] text-primary transition-all duration-200"
                onClick={() => window.open("mailto:info.rista2025@gmail.com", "_blank")}
              >
                <Mail className="w-4 h-4 mr-2" /> Send an Email
              </Button>
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card className="border border-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out bg-muted/30 flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-3 text-amber-600 dark:text-amber-400">
                <Clock className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">Support Timings</CardTitle>
              <CardDescription className="text-sm">Our team is active during working hours to assist families.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <div className="bg-background border rounded-lg p-3 text-xs space-y-1.5 shadow-2xs">
                <div className="flex justify-between font-medium">
                  <span className="text-foreground">Monday – Friday:</span>
                  <span className="text-primary font-semibold">9:00 AM – 8:00 PM IST</span>
                </div>
                <div className="flex justify-between text-muted-foreground border-t pt-1.5">
                  <span>Saturday – Sunday:</span>
                  <span>WhatsApp Queue Support</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2. Stay Connected Channels Section (Fully integrated into Contact Page) */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 md:p-10 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <Users className="w-3.5 h-3.5" /> Official Matrimonial Communities
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Stay Connected With Us
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Join our active community channels to get daily verified biodata alerts, marriage guidance, and instant support directly on your mobile.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {communityChannels.map((channel, i) => (
              <div
                key={i}
                className="group bg-background border border-border/70 rounded-xl p-5 text-center flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5 hover:border-primary/40 transition-all duration-300 ease-out"
              >
                <div>
                  <div className="flex justify-center mb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {channel.tag}
                    </span>
                  </div>
                  <div className={`w-12 h-12 mx-auto mb-3 ${channel.iconBg} rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 ease-out`}>
                    <channel.icon className={`w-6 h-6 ${channel.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-foreground text-base mb-1 group-hover:text-primary transition-colors duration-200">{channel.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{channel.description}</p>
                </div>
                <Button
                  className={`w-full h-10 rounded-full text-xs font-semibold shadow-xs hover:shadow-md active:scale-[0.98] transition-all duration-200 ${channel.btnClass}`}
                  onClick={() => window.open(channel.url, "_blank")}
                >
                  <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                  {channel.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Send Direct Message & FAQs Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Inquiry Form (7 cols) */}
          <Card className="lg:col-span-7 border shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">Send an Instant Message</CardTitle>
              <CardDescription className="text-sm">
                Fill out the quick details below to connect directly with our matchmaking coordinator.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Your Full Name *</label>
                    <Input
                      placeholder="e.g. Mohammad Bilal"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">WhatsApp Number *</label>
                    <Input
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Topic of Inquiry</label>
                  <select
                    className="w-full h-10 px-3 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.queryType}
                    onChange={(e) => setFormData({ ...formData, queryType: e.target.value })}
                  >
                    <option value="Profile Verification Status">Profile Verification Status</option>
                    <option value="Premium Membership Plan (Rs 491)">Premium Membership Plan (₹491)</option>
                    <option value="Update or Edit Biodata">Update or Edit My Biodata</option>
                    <option value="Delete / Deactivate Profile">Delete / Deactivate Profile (Married/Found Match)</option>
                    <option value="Wali / Family Assistance">Wali / Family Discussion Assistance</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Your Message / Requirement *</label>
                  <Textarea
                    placeholder="Tell us how we can help you find your life partner..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full h-11 rounded-full font-semibold bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Message via WhatsApp
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Trust Assurances & Quick Info (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> Privacy & Shariah Trust
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5 text-xs text-muted-foreground leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p><strong className="text-foreground">100% Privacy Protected:</strong> Sister's photos stay blurred and contact details are never exposed to random visitors.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p><strong className="text-foreground">Wali & Family Friendly:</strong> We encourage parents, guardians, and walis to lead discussions for a blessed nikah.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p><strong className="text-foreground">No Spam Policy:</strong> Your contact number is strictly utilized for matchmaking and verified member introductions.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary" /> Common Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground">How long does verification take?</p>
                  <p className="mt-0.5">Most profiles are manually reviewed and approved within 24 business hours.</p>
                </div>
                <div className="border-t pt-2">
                  <p className="font-semibold text-foreground">How do I remove my profile after Nikah?</p>
                  <p className="mt-0.5">Simply WhatsApp our admin team and your biodata will be deactivated immediately with our heartfelt dua for your marriage.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
