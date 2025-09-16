import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Shield, Users, Star, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

export function AboutUsContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const features = [
    {
      icon: Heart,
      title: "Islamic Values",
      description: "We prioritize Islamic principles and values in our matchmaking process"
    },
    {
      icon: Shield,
      title: "Verified Profiles",
      description: "All profiles go through strict verification to ensure authenticity"
    },
    {
      icon: Users,
      title: "Trusted Community",
      description: "Join thousands of families who have found their perfect matches"
    },
    {
      icon: Star,
      title: "Success Stories",
      description: "Hundreds of successful marriages have been formed through our platform"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  const socialLinks = [
    { name: "WhatsApp", icon: MessageCircle, link: "https://wa.me/", color: "text-green-600" },
    { name: "Email", icon: Mail, link: "mailto:contact@rishtamatrimony.com", color: "text-blue-600" },
    { name: "Phone", icon: Phone, link: "tel:+1234567890", color: "text-purple-600" }
  ];

  return (
    <section id="about-us" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* About Us Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              About Rishta Matrimony
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Rishta Matrimony is a trusted Muslim matrimonial platform dedicated to helping 
              individuals find their perfect life partners while adhering to Islamic values and traditions. 
              Our mission is to create meaningful connections that lead to blessed marriages.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div id="contact" className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="card-shadow border-0 bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Get In Touch</CardTitle>
                <p className="text-muted-foreground text-center">
                  Have questions? We'd love to hear from you.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us how we can help you..."
                      className="min-h-[120px]"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="card-shadow border-0 bg-card/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <MapPin className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Address</p>
                      <p className="text-muted-foreground">123 Islamic Center, Mumbai, India</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Phone</p>
                      <p className="text-muted-foreground">+91 12345 67890</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Email</p>
                      <p className="text-muted-foreground">contact@rishtamatrimony.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="card-shadow border-0 bg-card/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Connect With Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="lg"
                        className="flex-1 flex flex-col gap-2 h-20"
                        onClick={() => window.open(social.link, "_blank")}
                      >
                        <social.icon className={`w-6 h-6 ${social.color}`} />
                        <span className="text-sm">{social.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}