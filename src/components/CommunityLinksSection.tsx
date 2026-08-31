import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Users, UserPlus } from "lucide-react";

export function CommunityLinksSection() {
  const communityLinks = [
    {
      name: "WhatsApp Channel",
      description: "Latest updates & announcements",
      icon: MessageCircle,
      url: "https://www.whatsapp.com/channel/0029Vb6AIqPC1FuDwWaJVx0B",
      available: true,
      buttonText: "Join Channel",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      btnVariant: "whatsapp" as const,
    },
    {
      name: "WhatsApp Community",
      description: "Group discussions & support",
      icon: Users,
      url: "https://chat.whatsapp.com/F0Sdw8mYaZ550w7vpcqqLi?mode=ems_wa_t",
      available: true,
      buttonText: "Join Community",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      btnVariant: "whatsapp" as const,
    },
  ];

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Stay <span className="uppercase">Our Communities</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {communityLinks.map((link, index) => (
            <Card
              key={index}
              className="text-center border shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <CardContent className="p-5">
                <div className={`w-14 h-14 mx-auto mb-3 ${link.iconBg} rounded-full flex items-center justify-center`}>
                  <link.icon className={`w-7 h-7 ${link.iconColor}`} />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">
                  {link.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {link.description}
                </p>
                <Button
                  variant={link.btnVariant}
                  size="sm"
                  className="w-full text-xs"
                  disabled={!link.available}
                  onClick={() => {
                    if (link.available && link.url.startsWith("http")) {
                      window.open(link.url, "_blank");
                    }
                  }}
                >
                  {link.available ? (
                    <>
                      <UserPlus className="w-3 h-3" />
                      {link.buttonText}
                    </>
                  ) : (
                    link.buttonText
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
