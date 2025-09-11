import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Users, Facebook, Instagram, ExternalLink } from "lucide-react";

export function CommunityLinksSection() {
  const communityLinks = [
    {
      name: "WhatsApp Channel",
      description: "Get updates and announcements",
      descriptionHindi: "अपडेट और घोषणाएं प्राप्त करें",
      icon: MessageCircle,
      url: "https://www.whatsapp.com/channel/0029Vb6AIqPC1FuDwWaJVx0B",
      color: "whatsapp",
      available: true
    },
    {
      name: "WhatsApp Community",
      description: "Join group discussions",
      descriptionHindi: "समूह चर्चा में शामिल हों",
      icon: Users,
      url: "https://chat.whatsapp.com/F0Sdw8mYaZ550w7vpcqqLi?mode=ems_wa_t",
      color: "whatsapp",
      available: true
    },
    {
      name: "Facebook Group",
      description: "Connect on Facebook",
      descriptionHindi: "फेसबुक पर जुड़ें",
      icon: Facebook,
      url: "#facebook-group",
      color: "community",
      available: false
    },
    {
      name: "Instagram Community",
      description: "Follow us on Instagram",
      descriptionHindi: "इंस्टाग्राम पर फॉलो करें",
      icon: Instagram,
      url: "#instagram-community",
      color: "community",
      available: false
    }
  ];

  const handleLinkClick = (url: string, available: boolean) => {
    if (available && url.startsWith('http')) {
      window.open(url, '_blank');
    }
  };

  return (
    <section className="py-20 section-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Join Our Communities
            </h2>
            <p className="text-lg text-muted-foreground">
              Connect with us on different platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityLinks.map((link, index) => (
              <Card key={index} className="shadow-card border-0 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    link.available ? 'bg-primary/20' : 'bg-muted/50'
                  }`}>
                    <link.icon className={`w-8 h-8 ${
                      link.available ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {link.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    {link.description}
                  </p>

                  <Button
                    variant={link.available ? link.color as any : "outline"}
                    size="sm"
                    onClick={() => handleLinkClick(link.url, link.available)}
                    disabled={!link.available}
                    className="w-full"
                  >
                    {link.available ? (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        Join Now
                      </>
                    ) : (
                      "Coming Soon"
                    )}
                  </Button>

                  {!link.available && (
                    <p className="text-xs text-muted-foreground mt-2 opacity-70">
                      Coming Soon
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Admin Note */}
          <div className="mt-12 p-6 bg-accent/20 rounded-xl border border-accent/30 text-center">
            <h3 className="font-semibold text-foreground mb-2">
              📝 Admin Note
            </h3>
            <p className="text-sm text-muted-foreground">
              More community platforms will be added soon. Stay connected with our WhatsApp channel for updates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}