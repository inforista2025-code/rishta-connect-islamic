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
      isInstagram: false,
    },
    {
      name: "WhatsApp Community",
      description: "Group discussions & support",
      icon: Users,
      url: "https://chat.whatsapp.com/F0Sdw8mYaZ550w7vpcqqLi?mode=ems_wa_t",
      buttonText: "Join Community",
      isInstagram: false,
    },
    {
      name: "Instagram",
      description: "Follow us for updates & success stories",
      icon: Instagram,
      url: "https://www.instagram.com/rishtamatrimony786?stkn=MXBjajltZWFwMXdrdQ==",
      buttonText: "Follow",
      isInstagram: true,
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
              Join our WhatsApp channels and follow us on Instagram for updates and community support.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {communityLinks.map((link, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center ${
                    link.isInstagram
                      ? "bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30"
                      : "bg-green-100 dark:bg-green-900/30"
                  }`}
                >
                  <link.icon
                    className={`w-7 h-7 ${
                      link.isInstagram
                        ? "text-pink-600 dark:text-pink-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  />
                </div>
                <h3 className="font-semibold text-foreground text-base mb-1">{link.name}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-4">{link.description}</p>
                <Button
                  variant={link.isInstagram ? "default" : "whatsapp"}
                  className={`w-full h-11 rounded-full ${
                    link.isInstagram
                      ? "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:opacity-90 text-white border-0"
                      : ""
                  }`}
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
