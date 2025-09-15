import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, User } from "lucide-react";

export function BrowseProfilesSection() {
  const profiles = [
    {
      id: 1,
      name: "Ahmed Khan",
      age: 28,
      location: "Mumbai, India",
      profession: "Software Engineer",
      image: "/placeholder.svg",
      isPremium: false
    },
    // ADD NEW PROFILES HERE - Example:
    {
      id: 7,
      name: "Sara Ahmed",
      age: 23,
      location: "Lahore, Pakistan",
      profession: "Graphic Designer",
      image: "/placeholder.svg",
      isPremium: true
    },
    {
      id: 2,
      name: "Fatima Ali",
      age: 25,
      location: "Delhi, India",
      profession: "Doctor",
      image: "/placeholder.svg",
      isPremium: true
    },
    {
      id: 3,
      name: "Omar Sheikh",
      age: 30,
      location: "Karachi, Pakistan",
      profession: "Business Owner",
      image: "/placeholder.svg",
      isPremium: false
    },
    {
      id: 4,
      name: "Aisha Rahman",
      age: 26,
      location: "Dhaka, Bangladesh",
      profession: "Teacher",
      image: "/placeholder.svg",
      isPremium: true
    },
    {
      id: 5,
      name: "Hassan Ahmed",
      age: 32,
      location: "Lahore, Pakistan",
      profession: "Engineer",
      image: "/placeholder.svg",
      isPremium: false
    },
    {
      id: 6,
      name: "Zara Khan",
      age: 24,
      location: "Bangalore, India",
      profession: "Designer",
      image: "/placeholder.svg",
      isPremium: true
    }
  ];

  const handleViewDetails = (profileId: number) => {
    // Placeholder action
    alert(`Viewing details for profile ${profileId}. Contact details available for Premium members only.`);
  };

  return (
    <section id="browse-profiles" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Browse Profiles
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover verified profiles of potential matches from our trusted community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profiles.map((profile) => (
              <Card key={profile.id} className="card-shadow border-0 bg-card/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative">
                  {profile.isPremium && (
                    <Badge className="absolute top-4 right-4 bg-amber-500 text-amber-900 z-10">
                      Premium
                    </Badge>
                  )}
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <User className="w-16 h-16 text-muted-foreground" />
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {profile.name}
                    </h3>
                    <p className="text-muted-foreground font-medium">
                      Age: {profile.age}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm">{profile.profession}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleViewDetails(profile.id)}
                    >
                      View Details
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground border rounded-md p-3 bg-muted/50">
                        📞 Contact details visible to Premium Members only – 
                        <Button variant="link" className="p-0 h-auto text-xs text-primary font-medium">
                          Upgrade to Premium
                        </Button>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              View More Profiles
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}