import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, GraduationCap, Briefcase, Heart, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

const Profiles = () => {
  const navigate = useNavigate();

  const profiles = [
    {
      id: 1,
      name: "Taheera Ansari",
      gender: "Female",
      age: "31",
      dob: "10/16/1993",
      location: "Deoria, Uttar Pradesh",
      height: "5'2\"",
      complexion: "Fair",
      education: "PhD in Zoology",
      profession: "Teaching (Assistant Professor in degree College)",
      maritalStatus: "Single",
      caste: "Momin Ansar",
      maslak: "Sunni Muslim",
      family: "Father – (Late) M.A. Ansari (Assistant Manager at L&T); Mother – Housewife; 2 Brothers (Both Engineers); 2 Sisters (Both Teachers)",
      preferredPartner: "Well-educated (Graduate / Postgraduate / Professional), Teacher/Engineer/Professor/Doctor/Businessman, Practicing Muslim with good Islamic values, decent personality, non-smoker, non-drinker, respectful, caring, family-oriented, good character, height more than 5'5 or 5'6",
      preferredLocation: "UP or nearby areas",
      preferredAge: "32–36"
    },
    {
      id: 2,
      name: "Shaima Perween",
      gender: "Female",
      age: "25",
      dob: "6/12/2000",
      location: "Bihar Sharif, Nalanda, Bihar",
      height: "5.1 ft",
      complexion: "Fair",
      education: "M.Sc, D.El.Ed, CTET Qualified",
      profession: "No",
      maritalStatus: "Single",
      caste: "Rayeen",
      maslak: "Sunni Muslim",
      family: "Father – Businessman; Mother – Homemaker; 2 Sisters",
      preferredPartner: "Government service person, well-reputed family",
      preferredLocation: "Bihar State",
      preferredAge: "30–35 yrs"
    }
  ];

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

        {/* Alert Note */}
        <div className="max-w-4xl mx-auto mb-8 bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            <strong>⚠️ Note:</strong> Detailed biodata and photos available only for verified paid members.
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {profiles.map((profile) => (
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

                {/* Marital & Religious Info */}
                <div className="space-y-3 pt-2 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">💒</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">Marital Status</p>
                        <p className="text-sm text-muted-foreground">{profile.maritalStatus}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-2xl">🏷️</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">Caste</p>
                        <p className="text-sm text-muted-foreground">{profile.caste}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-2xl">🕌</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">Maslak</p>
                      <p className="text-sm text-muted-foreground">{profile.maslak}</p>
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

                {/* Action Button */}
                <Button className="w-full mt-4" size="lg" asChild>
                  <a 
                    href={`https://wa.me/919128719875?text=Assalamu%20Alaikum%2C%20I%20would%20like%20to%20request%20the%20detailed%20profile%20of%20${encodeURIComponent(profile.name)}%20from%20your%20platform.%20Kindly%20share%20the%20details.%20JazakAllahu%20Khair.`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Request Detailed Profile
                  </a>
                </Button>
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
