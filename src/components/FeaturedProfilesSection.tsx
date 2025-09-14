import { MessageCircle, MapPin, Calendar, Crown } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function FeaturedProfilesSection() {
  const featuredProfiles = [
    {
      id: 1,
      name: "Ayesha Khan",
      age: 26,
      city: "Mumbai",
      bio: "Software Engineer with a passion for travel and reading. Looking for a life partner who shares similar values.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      whatsapp: "+911234567890"
    },
    {
      id: 2,
      name: "Fatima Ahmed",
      age: 24,
      city: "Delhi",
      bio: "Doctor by profession, love cooking and helping others. Seeking someone who values family and faith.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      whatsapp: "+911234567891"
    },
    {
      id: 3,
      name: "Zara Sheikh",
      age: 28,
      city: "Bangalore",
      bio: "Teacher with a love for art and culture. Looking for someone who appreciates simple joys of life.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
      whatsapp: "+911234567892"
    }
  ];

  const handleWhatsAppConnect = (whatsapp: string, name: string) => {
    const message = encodeURIComponent(`Hi ${name}, I saw your profile on Rishta Matrimony and would like to connect.`);
    window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-accent/5 via-background to-primary/5">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="secondary">
            <Crown className="w-4 h-4 mr-2 text-yellow-600" />
            Premium
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Featured Profiles
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with our verified premium members who are serious about finding their life partner
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProfiles.map((profile) => (
            <Card 
              key={profile.id} 
              className="relative bg-gradient-to-br from-background to-accent/5 border-2 border-yellow-200 hover:border-yellow-300 transition-all duration-300 hover:shadow-elegant group"
            >
              <div className="absolute -top-3 -right-3">
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 border-yellow-300">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>
              
              <CardContent className="p-6 text-center">
                <div className="mb-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-yellow-200">
                    <AvatarImage src={profile.image} alt={profile.name} />
                    <AvatarFallback className="text-lg font-semibold bg-primary/10">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {profile.name}
                  </h3>
                  <div className="flex items-center justify-center gap-4 text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{profile.age} years</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.city}</span>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {profile.bio}
                </p>

                <Button 
                  variant="whatsapp"
                  size="default"
                  onClick={() => handleWhatsAppConnect(profile.whatsapp, profile.name)}
                  className="w-full"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}