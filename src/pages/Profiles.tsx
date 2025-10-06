import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, GraduationCap, Briefcase, Users, AlertCircle, GripVertical, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  caste?: string;
  maslak?: string;
  islamicKnowledge?: string;
  family: string;
  preferredPartner: string;
  preferredLocation: string;
  preferredAge: string;
  order: number;
}

interface SortableProfileCardProps {
  profile: Profile;
  isAdmin: boolean;
}

const SortableProfileCard = ({ profile, isAdmin }: SortableProfileCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: profile.id, disabled: !isAdmin });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02]">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isAdmin && (
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
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
                <p className="text-sm text-muted-foreground">{profile.age} yrs / {profile.dob}</p>
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

          {/* Caste */}
          {profile.caste && (
            <div className="pt-2 border-t">
              <div className="flex items-start gap-2">
                <span className="text-2xl">🏷️</span>
                <div>
                  <p className="text-sm font-medium text-foreground">Caste</p>
                  <p className="text-sm text-muted-foreground">{profile.caste}</p>
                </div>
              </div>
            </div>
          )}

          {/* Maslak */}
          {profile.maslak && (
            <div className="pt-2 border-t">
              <div className="flex items-start gap-2">
                <span className="text-2xl">🕌</span>
                <div>
                  <p className="text-sm font-medium text-foreground">Maslak</p>
                  <p className="text-sm text-muted-foreground">{profile.maslak}</p>
                </div>
              </div>
            </div>
          )}

          {/* Islamic Knowledge */}
          {profile.islamicKnowledge && (
            <div className="pt-2 border-t">
              <div className="flex items-start gap-2">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="text-sm font-medium text-foreground">Islamic Knowledge</p>
                  <p className="text-sm text-muted-foreground">{profile.islamicKnowledge}</p>
                </div>
              </div>
            </div>
          )}

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
          <Button className="w-full" size="lg" asChild>
            <a 
              href={`https://wa.me/919182719875?text=Assalamu%20Alaikum%2C%20I%20would%20like%20to%20request%20the%20detailed%20profile%20of%20${encodeURIComponent(profile.name)}%20from%20your%20platform.%20Kindly%20share%20the%20details.%20JazakAllahu%20Khair.`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Request Detailed Profile
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const Profiles = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);

  // Check admin authorization on mount
  useEffect(() => {
    const adminKey = localStorage.getItem('adminKey');
    setIsAuthorizedAdmin(adminKey === 'approved');
  }, []);

  const initialProfiles: Profile[] = [
    {
      id: 1,
      name: "Mohammad Hasib",
      gender: "Male",
      age: "32",
      dob: "03/01/1993",
      location: "Ranchi, Jharkhand",
      height: "5'7\"",
      complexion: "Fair",
      education: "Bachelor of Computer Application",
      profession: "IT Support",
      maritalStatus: "Single",
      caste: "Khan",
      maslak: "Salafi (Ahle Hadees)",
      family: "Father – Mohammad Hafiz",
      preferredPartner: "Height 5.5+, Deeni knowledge, practicing Muslimah",
      preferredLocation: "Any location",
      preferredAge: "25–28",
      order: 13
    },
    {
      id: 2,
      name: "Afshaa Bharde",
      gender: "Female",
      age: "24",
      dob: "14/08/2000",
      location: "Navi Mumbai",
      height: "5'5\"",
      complexion: "Fair",
      education: "BCA",
      profession: "Working in HR in Qatar (Private Company)",
      maritalStatus: "Single",
      caste: "Kokani",
      maslak: "Sunni",
      family: "Father working in Qatar, Mother is a homemaker, Two younger brothers studying",
      preferredPartner: "Smart, well-dressed, well-behaved, good values, conscious of halal earning",
      preferredLocation: "Gulf and Abroad",
      preferredAge: "25–29",
      order: 12
    },
    {
      id: 3,
      name: "Shamsuzzama Hashmi",
      gender: "Male",
      age: "32",
      dob: "08/04/1992",
      location: "Saudi Arabia, Tabuk",
      height: "5'8\"",
      complexion: "Whitish",
      education: "B.Tech Civil Engineer",
      profession: "Assistant Technical Manager at Red Sea Global, Saudi Arabia",
      maritalStatus: "Single",
      caste: "Shaikh",
      family: "Well-settled, educated siblings, supportive environment",
      preferredPartner: "Looking for bride to join in Saudi Arabia, good family environment, no dowry",
      preferredLocation: "Bihar",
      preferredAge: "25–29",
      order: 11
    },
    {
      id: 4,
      name: "Shadma Khatoon",
      gender: "Female",
      age: "25",
      dob: "01/01/1999",
      location: "Darbhanga, Bihar",
      height: "5'4\"",
      complexion: "Fair",
      education: "B.Sc. Mathematics + D.El.Ed + NTT",
      profession: "No",
      maritalStatus: "Single",
      maslak: "Sunni Deobandi",
      family: "Father – Assistant Professor, Mithila B.Ed College, Darbhanga; Mother – Homemaker; Siblings – Well-settled in engineering, medical, research, and education fields",
      preferredPartner: "Educated, religious, settled professional from a good family",
      preferredLocation: "Bihar",
      preferredAge: "30–34",
      order: 10
    },
    {
      id: 5,
      name: "MD Sarwar Alam",
      gender: "Male",
      age: "31",
      dob: "05/05/1993",
      location: "Ranchi",
      height: "5'9\"",
      complexion: "Wheatish",
      education: "MBA",
      profession: "Sales & Marketing, Private Sector",
      maritalStatus: "Single",
      caste: "Ansari",
      family: "Respected and educated family, siblings well-settled in private and professional sectors",
      preferredPartner: "5'3\"+ height, fair complexion, bachelor's degree, knowledge of Quran",
      preferredLocation: "Jharkhand",
      preferredAge: "23–28",
      order: 9
    },
    {
      id: 6,
      name: "Shaima Perween",
      gender: "Female",
      age: "25",
      dob: "06/12/2000",
      location: "Bihar Sharif, Nalanda, Bihar",
      height: "5'1\"",
      complexion: "Fair",
      education: "M.Sc, D.El.Ed, CTET Qualified",
      profession: "No",
      maritalStatus: "Single",
      caste: "Rayeen",
      family: "Father – Businessman; Mother – Homemaker; 2 Sisters",
      preferredPartner: "Government service person, well-reputed family",
      preferredLocation: "Bihar State",
      preferredAge: "30–35",
      order: 8
    },
    {
      id: 7,
      name: "Wasil Khan",
      gender: "Male",
      age: "29",
      dob: "06/05/1995",
      location: "Rahmat Colony, Doranda, Ranchi",
      height: "5'6\"",
      complexion: "Fair",
      education: "MBA (Finance & Marketing)",
      profession: "N/A",
      maritalStatus: "Single",
      caste: "Khan",
      family: "Father – Late Shakil Ahmed Khan, Mother – Akbari Khatoon (Housewife), 2 Brothers, 3 Sisters (All Married)",
      preferredPartner: "Islamic, Namazi, No Dowry",
      preferredLocation: "Kashmir, Pune, Delhi, Himachal",
      preferredAge: "N/A",
      order: 7
    },
    {
      id: 8,
      name: "Md Rahim Khan",
      gender: "Male",
      age: "26",
      dob: "20/07/1998",
      location: "Dhanbad",
      height: "5'10\"",
      complexion: "Fair",
      education: "M.Com",
      profession: "Private Job at SBI (Loan Department)",
      maritalStatus: "Single",
      caste: "Khan",
      maslak: "Sunni",
      family: "Father – Late Md Nasim Khan, Mother – Rehana Khatoon (Housewife), 4 Elder Brothers (Married), 1 Younger Brother (Student), 4 Elder Sisters (Married)",
      preferredPartner: "Well-educated, simple, family-oriented, recites Quran, has deeni-taalim knowledge, and cooks well",
      preferredLocation: "Dhanbad, Bokaro, Ranchi",
      preferredAge: "21–25",
      order: 6
    },
    {
      id: 9,
      name: "Taheera Ansari",
      gender: "Female",
      age: "31",
      dob: "16/10/1993",
      location: "Deoria, Uttar Pradesh",
      height: "5'2\"",
      complexion: "Fair",
      education: "PhD in Zoology",
      profession: "Teaching (Assistant Professor in degree college)",
      maritalStatus: "Single",
      caste: "Momin Ansar",
      maslak: "Sunni Muslim",
      family: "Father – (Late) M.A. Ansari (Assistant Manager at L&T); Mother – Housewife; 2 Brothers (Both Engineers); 2 Sisters (Both Teachers)",
      preferredPartner: "Well-educated (Graduate/Postgraduate/Professional), Teacher/Engineer/Professor/Doctor/Businessman, Practicing Muslim with good Islamic values, decent personality, non-smoker, non-drinker, respectful, caring, family-oriented, good character, height more than 5'5\" or 5'6\"",
      preferredLocation: "UP or nearby areas",
      preferredAge: "32–36",
      order: 5
    },
    {
      id: 10,
      name: "MD Shabbir Akhtar",
      gender: "Male",
      age: "33",
      dob: "25/12/1991",
      location: "Patna City",
      height: "5'11\"",
      complexion: "Fair",
      education: "B.Tech (ECE)",
      profession: "Principal",
      maritalStatus: "Divorced",
      maslak: "Sunni Islam",
      islamicKnowledge: "Alhamdulillah, well-versed in Islamic knowledge",
      family: "Father – Late Md Subhan, Mother – Mobina Khatoon, Brothers – 3 (all married), Sisters – 4 (all married)",
      preferredPartner: "Single, Beautiful and should be fair",
      preferredLocation: "Patna, Kolkata or any",
      preferredAge: "20–25",
      order: 4
    },
    {
      id: 11,
      name: "Samreen Fatima",
      gender: "Female",
      age: "26",
      dob: "17/01/1999",
      location: "Patna City",
      height: "5'3\"",
      complexion: "Fair",
      education: "Graduation (Bachelor in Commerce)",
      profession: "No",
      maritalStatus: "Single",
      caste: "Shah",
      maslak: "Sunni Islam",
      islamicKnowledge: "Alhamdulillah, Well knowledgeable about Islam",
      family: "Father – Md Sohail Akhtar, Mother – Sanjeeda Perween, Brother – Md Shahnawaz Akhtar",
      preferredPartner: "Well-settled",
      preferredLocation: "Bihar, Patna, Kolkata or any",
      preferredAge: "25–28",
      order: 3
    },
    {
      id: 12,
      name: "Sania Akhtar",
      gender: "Female",
      age: "21",
      dob: "16/10/2003",
      location: "Patna City",
      height: "5'4\"",
      complexion: "Fair",
      education: "Graduation",
      profession: "No",
      maritalStatus: "Single",
      caste: "Shah",
      maslak: "Sunni (Islam)",
      family: "Father – (Late) Md Zahid Akhtar, Mother – Shabina Akhtar, 2 Sisters, 1 Brother",
      preferredPartner: "Well Settled",
      preferredLocation: "Patna, Kolkata or Any",
      preferredAge: "25–30",
      order: 2
    },
    {
      id: 13,
      name: "Kamran Ansari",
      gender: "Male",
      age: "27",
      dob: "02/04/1997",
      location: "Ranchi, Jharkhand",
      height: "5'7\"",
      complexion: "Fair",
      education: "MBA (Marketing & HR)",
      profession: "Assistant Manager, Bhutani Infra (Private Job)",
      maritalStatus: "Single",
      caste: "Ansari",
      family: "Father (Businessman), Mother (Homemaker), Siblings (4 Brothers, 1 Sister – All Married)",
      preferredPartner: "Graduate, Age 20–25, From Jharkhand/Bihar",
      preferredLocation: "Jharkhand/Bihar",
      preferredAge: "20–25",
      order: 1
    }
  ];

  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('matrimony_profiles');
    if (saved) {
      const parsedProfiles = JSON.parse(saved);
      // If localStorage has fewer profiles than initialProfiles, reset to initialProfiles
      if (parsedProfiles.length < initialProfiles.length) {
        return initialProfiles;
      }
      return parsedProfiles;
    }
    return initialProfiles;
  });

  useEffect(() => {
    localStorage.setItem('matrimony_profiles', JSON.stringify(profiles));
  }, [profiles]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProfiles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        
        // Recalculate order values based on new positions
        const updatedItems = reorderedItems.map((item, index) => ({
          ...item,
          order: reorderedItems.length - index // Higher order = appears first
        }));
        
        return updatedItems;
      });
    }
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

        {/* Admin Toggle - Only visible to authorized admin */}
        {isAuthorizedAdmin && (
          <div className="max-w-4xl mx-auto mb-6 transition-all duration-300 ease-in-out">
            <Button
              variant={isAdmin ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAdmin(!isAdmin)}
              className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <ShieldCheck className="w-4 h-4" />
              {isAdmin ? "Admin Mode: ON" : "Enable Admin Mode"}
            </Button>
          </div>
        )}

        {/* Alert Note */}
        <div className="max-w-4xl mx-auto mb-8 bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start gap-3 transition-all duration-300">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            <strong>⚠️ Note:</strong> Detailed biodata and contact details are available only to verified registered members.
          </p>
        </div>

        {/* Profiles Grid */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={isAdmin ? sortedProfiles.map(p => p.id) : []}
            strategy={verticalListSortingStrategy}
            disabled={!isAdmin}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {sortedProfiles.map((profile) => (
                <SortableProfileCard
                  key={profile.id}
                  profile={profile}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

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
