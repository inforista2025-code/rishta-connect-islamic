import { Button } from "@/components/ui/button";
import { MessageCircle, Users, UserPlus, Instagram } from "lucide-react";

export function CommunityLinksSection() {
  const communityLinks = [
    {
      name: "WhatsApp Channel",
      description: "Latest updates & announcements",
      icon: MessageCircle,
      url: "https://www.whatsapp.com/channel/0029Vb6AIqPC1FuDwWaJVx0B",
      buttonText: "Join Channel",
    },
    {
      name: "WhatsApp Community",
      description: "Group discussions & support",
      icon: Users,
      url: "https://chat.whatsapp.com/F0Sdw8mYaZ550w7vpcqqLi?mode=ems_wa_t",
      buttonText: "Join Community",
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-sage-soft">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              Stay Connected With Us
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Join our WhatsApp channels for updates and community support.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {communityLinks.map((link, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 mx-auto mb-3 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <link.icon className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-foreground text-base mb-1">{link.name}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-4">{link.description}</p>
                <Button
                  variant="whatsapp"
                  className="w-full h-11 rounded-full"
                  onClick={() => window.open(link.url, "_blank")}
                >
                  <UserPlus className="w-4 h-4" />
                  {link.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
