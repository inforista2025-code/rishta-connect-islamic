import { Button } from "@/components/ui/button";
import { MessageCircle, Users, UserPlus, Send, Instagram } from "lucide-react";

export function CommunityLinksSection() {
  const communityLinks = [
    {
      name: "WhatsApp Channel",
      description: "Latest updates & announcements",
      icon: MessageCircle,
      url: "https://www.whatsapp.com/channel/0029Vb6AIqPC1FuDwWaJVx0B",
      buttonText: "Join Channel",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      isCustom: false,
    },
    {
      name: "WhatsApp Community",
      description: "Group discussions & support",
      icon: Users,
      url: "https://chat.whatsapp.com/F0Sdw8mYaZ550w7vpcqqLi?mode=ems_wa_t",
      buttonText: "Join Community",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      isCustom: false,
    },
    {
      name: "Telegram Channel",
      description: "Daily rishta alerts & verified matches",
      icon: Send,
      url: "https://t.me/Rishtamatrimony",
      buttonText: "Join Telegram",
      iconBg: "bg-sky-100 dark:bg-sky-900/30",
      iconColor: "text-sky-600 dark:text-sky-400",
      isCustom: true,
      customClass: "bg-sky-600 hover:bg-sky-700 text-white border-0",
    },
    {
      name: "Instagram",
      description: "Follow us for stories & updates",
      icon: Instagram,
      url: "https://www.instagram.com/rishtamatrimony786?stkn=MXBjajltZWFwMXdrdQ==",
      buttonText: "Follow Us",
      iconBg: "bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30",
      iconColor: "text-pink-600 dark:text-pink-400",
      isCustom: true,
      customClass: "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:opacity-90 text-white border-0",
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-sage-soft">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              Stay Connected With Us
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Join our WhatsApp, Telegram & social channels for verified profiles, updates, and community support.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {communityLinks.map((link, index) => (
              <div
                key={index}
                className="group bg-card border border-border rounded-2xl p-6 text-center shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 mx-auto mb-3 ${link.iconBg} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xs`}>
                    <link.icon className={`w-7 h-7 ${link.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-foreground text-base mb-1 group-hover:text-primary transition-colors duration-200">{link.name}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-4">{link.description}</p>
                </div>
                <Button
                  variant={link.isCustom ? "default" : "whatsapp"}
                  className={`w-full h-11 rounded-full ${link.customClass || ""}`}
                  onClick={() => window.open(link.url, "_blank")}
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
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
