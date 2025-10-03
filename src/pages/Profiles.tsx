import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, GraduationCap, Briefcase, Users, AlertCircle, ArrowUp, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";

interface Profile {
  id: number;
  name: string;
  gender: string;
  age: string;
  dob: string;
  location: string;
  height: string;
  complexion: string;
  education: string;
  profession: string;
  maritalStatus: string;
  family: string;
  preferredPartner: string;
  preferredLocation: string;
  preferredAge: string;
  order: number;
}

const Profiles = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const initialProfiles: Profile[] = [
    {
      id: 1,
      name: "Kamran Ansari",
      gender: "Male",
      age: "27",
      dob: "2 April 1997",
      location: "Ranchi, Jharkhand",
      height: "5'7\"",
      complexion: "Fair",
      education: "MBA (Marketing & HR)",
      profession: "Assistant Manager, Bhutani Infra (Private Job)",
      maritalStatus: "Single",
      family: "Father (Businessman), Mother (Homemaker), Siblings (4 Brothers, 1 Sister – All Married)",
      preferredPartner: "Graduate, Age 20–25, From Jharkhand/Bihar",
      preferredLocation: "Jharkhand/Bihar",
      preferredAge: "20–25",
      order: 1
    }
  ];

  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('matrimony_profiles');
    return saved ? JSON.parse(saved) : initialProfiles;
  });

  useEffect(() => {
    localStorage.setItem('matrimony_profiles', JSON.stringify(profiles));
  }, [profiles]);

  const moveToTop = (profileId: number) => {
    setProfiles(prevProfiles => {
      const maxOrder = Math.max(...prevProfiles.map(p => p.order));
      return prevProfiles.map(p => 
        p.id === profileId ? { ...p, order: maxOrder + 1 } : p
      );
    });
  };

  const sortedProfiles = [...profiles].sort((a, b) => b.order - a.order);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation Menu */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Available Profiles</h2>
          <p className="text-muted-foreground text-lg">Browse verified profiles from our community</p>
        </div>

        {/* Admin Toggle */}
        <div className="max-w-4xl mx-auto mb-6">
          <Button
            variant={isAdmin ? "default" : "outline"}
            size="sm"
            onClick={() => setIsAdmin(!isAdmin)}
            className="flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {isAdmin ? "Admin Mode: ON" : "Enable Admin Mode"}
          </Button>
        </div>

        {/* Alert Note */}
        <div className="max-w-4xl mx-auto mb-8 bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            <strong>⚠️ Note:</strong> Detailed biodata and photos available only for verified paid members.
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {sortedProfiles.map((profile) => (
            <Card key={profile.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <span>{profile.name}</span>
                  </div>
                  <Badge variant="secondary">{profile.gender}</Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-6 space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">🎂</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">Age / DOB</p>
                      <p className="text-sm text-muted-foreground">{profile.age} yrs ({profile.dob})</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Location</p>
                      <p className="text-sm text-muted-foreground">{profile.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-2xl">📏</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">Height</p>
                      <p className="text-sm text-muted-foreground">{profile.height}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-2xl">🌟</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">Complexion</p>
                      <p className="text-sm text-muted-foreground">{profile.complexion}</p>
                    </div>
                  </div>
                </div>

                {/* Education & Profession */}
                <div className="space-y-3 pt-2 border-t">
                  <div className="flex items-start gap-2">
                    <GraduationCap className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Education</p>
                      <p className="text-sm text-muted-foreground">{profile.education}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Briefcase className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Profession</p>
                      <p className="text-sm text-muted-foreground">{profile.profession}</p>
                    </div>
                  </div>
                </div>

                {/* Marital Status */}
                <div className="pt-2 border-t">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">💒</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">Marital Status</p>
                      <p className="text-sm text-muted-foreground">{profile.maritalStatus}</p>
                    </div>
                  </div>
                </div>

                {/* Family Info */}
                <div className="pt-2 border-t">
                  <div className="flex items-start gap-2">
                    <Users className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Family</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{profile.family}</p>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="pt-2 border-t bg-muted/30 -mx-6 px-6 py-4 rounded-b-lg">
                  <p className="text-sm font-semibold text-foreground mb-2">📜 Partner Preferences:</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{profile.preferredPartner}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">📍 {profile.preferredLocation}</Badge>
                    <Badge variant="outline">🎂 {profile.preferredAge}</Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button className="w-full" size="lg" asChild>
                    <a 
                      href={`https://wa.me/919128719875?text=Assalamu%20Alaikum%2C%20I%20would%20like%20to%20request%20the%20detailed%20profile%20of%20${encodeURIComponent(profile.name)}%20from%20your%20platform.%20Kindly%20share%20the%20details.%20JazakAllahu%20Khair.`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Request Detailed Profile
                    </a>
                  </Button>
                  
                  {isAdmin && (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      size="lg"
                      onClick={() => moveToTop(profile.id)}
                    >
                      <ArrowUp className="w-4 h-4 mr-2" />
                      Move to Top
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 bg-card border rounded-lg p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-4">Want to Add Your Profile?</h3>
          <p className="text-muted-foreground mb-6">Register free and let us help you find your perfect match</p>
          <Button size="lg" onClick={() => navigate("/")}>
            Register Now
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Profiles;
