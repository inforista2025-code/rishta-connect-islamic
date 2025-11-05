import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, GraduationCap, Briefcase, Users, AlertCircle, GripVertical, ShieldCheck, LogIn, LogOut, Pencil, Trash2, Undo2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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
  onEdit: (profile: Profile) => void;
  onDelete: (profile: Profile) => void;
}

const SortableProfileCard = memo(({ profile, isAdmin, onEdit, onDelete }: SortableProfileCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: profile.id, disabled: !isAdmin });

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }), [transform, transition, isDragging]);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(profile);
  }, [onEdit, profile]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(profile);
  }, [onDelete, profile]);

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
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{profile.gender}</Badge>
              {isAdmin && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleEditClick}
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                  >
                    <Pencil className="w-4 h-4 text-primary" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDeleteClick}
                    className="h-8 w-8 p-0 hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              )}
            </div>
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
              href={`https://wa.me/919128719875?text=Assalamu%20Alaikum%2C%20I%20would%20like%20to%20request%20the%20detailed%20profile%20of%20${encodeURIComponent(profile.name)}%20from%20your%20platform.%20Kindly%20share%20the%20details.%20JazakAllahu%20Khair.`}
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
});

const Profiles = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeGender, setActiveGender] = useState<"Male" | "Female">("Male");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Admin features state
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  const [newProfileData, setNewProfileData] = useState<Partial<Profile>>({
    gender: "Male",
    maritalStatus: "Single"
  });
  
  // Undo functionality
  const [history, setHistory] = useState<{ action: string; data: any }[]>([]);

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

  // Check authentication and admin status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Check if user is admin
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();
        
        if (roleData) {
          setIsAdmin(true);
        }
      }
    };

    checkAuth();

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load profiles from database
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const { data: dbProfiles, error } = await supabase
          .from('profiles_data')
          .select('*')
          .order('display_order', { ascending: false });

        if (error) throw error;

        if (dbProfiles && dbProfiles.length > 0) {
          const formattedProfiles = dbProfiles.map(p => ({
            id: p.id,
            name: p.name,
            gender: p.gender,
            age: p.age,
            dob: p.dob,
            location: p.location,
            height: p.height,
            complexion: p.complexion,
            education: p.education,
            profession: p.profession,
            maritalStatus: p.marital_status,
            caste: p.caste || undefined,
            maslak: p.maslak || undefined,
            islamicKnowledge: p.islamic_knowledge || undefined,
            family: p.family,
            preferredPartner: p.preferred_partner,
            preferredLocation: p.preferred_location,
            preferredAge: p.preferred_age,
            order: p.display_order
          }));
          setProfiles(formattedProfiles);
        } else {
          // Use initial profiles if database is empty
          setProfiles(initialProfiles);
        }
      } catch (error) {
        console.error('Error loading profiles:', error);
        setProfiles(initialProfiles);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfiles();
  }, []);

  // Real-time subscription for profile changes
  useEffect(() => {
    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles_data'
        },
        async () => {
          // Reload profiles
          const { data: dbProfiles } = await supabase
            .from('profiles_data')
            .select('*')
            .order('display_order', { ascending: false });

          if (dbProfiles) {
            const formattedProfiles = dbProfiles.map(p => ({
              id: p.id,
              name: p.name,
              gender: p.gender,
              age: p.age,
              dob: p.dob,
              location: p.location,
              height: p.height,
              complexion: p.complexion,
              education: p.education,
              profession: p.profession,
              maritalStatus: p.marital_status,
              caste: p.caste || undefined,
              maslak: p.maslak || undefined,
              islamicKnowledge: p.islamic_knowledge || undefined,
              family: p.family,
              preferredPartner: p.preferred_partner,
              preferredLocation: p.preferred_location,
              preferredAge: p.preferred_age,
              order: p.display_order
            }));
            setProfiles(formattedProfiles);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredProfiles.findIndex((item) => item.id === active.id);
      const newIndex = filteredProfiles.findIndex((item) => item.id === over.id);
      const reorderedItems = arrayMove(filteredProfiles, oldIndex, newIndex);
      
      // Recalculate order values
      const updatedItems = reorderedItems.map((item, index) => ({
        ...item,
        order: reorderedItems.length - index
      }));

      // Save to history for undo
      setHistory(prev => [...prev, { 
        action: 'reorder', 
        data: profiles 
      }]);

      setProfiles(prev => {
        const newProfiles = [...prev];
        updatedItems.forEach(item => {
          const index = newProfiles.findIndex(p => p.id === item.id);
          if (index !== -1) {
            newProfiles[index] = item;
          }
        });
        return newProfiles;
      });

      // Update database
      try {
        for (const profile of updatedItems) {
          await supabase
            .from('profiles_data')
            .update({ display_order: profile.order })
            .eq('id', profile.id);
        }
      } catch (error) {
        console.error('Error updating order:', error);
        toast({
          title: "Error",
          description: "Failed to save new order",
          variant: "destructive"
        });
      }
    }
  };

  const filteredProfiles = useMemo(() => 
    profiles
      .filter(profile => 
        profile.gender === activeGender &&
        (profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.age.toString().includes(searchTerm) ||
        profile.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.profession.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => b.order - a.order),
    [profiles, activeGender, searchTerm]
  );

  const handleEdit = useCallback((profile: Profile) => {
    setEditingProfile(profile);
    setNewProfileData(profile);
    setShowEditDialog(true);
  }, []);

  const handleDelete = useCallback((profile: Profile) => {
    setProfileToDelete(profile);
    setShowDeleteDialog(true);
  }, []);

  const confirmDelete = async () => {
    if (!profileToDelete) return;

    // Save to history
    setHistory(prev => [...prev, { 
      action: 'delete', 
      data: profileToDelete 
    }]);

    try {
      const { error } = await supabase
        .from('profiles_data')
        .delete()
        .eq('id', profileToDelete.id);

      if (error) throw error;

      setProfiles(prev => prev.filter(p => p.id !== profileToDelete.id));
      
      toast({
        title: "✅ Profile Deleted",
        description: "Profile has been removed successfully",
      });
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message,
        variant: "destructive"
      });
    }

    setShowDeleteDialog(false);
    setProfileToDelete(null);
  };

  const handleSaveEdit = async () => {
    if (!editingProfile) return;

    // Save to history
    setHistory(prev => [...prev, { 
      action: 'edit', 
      data: editingProfile 
    }]);

    try {
      const { error } = await supabase
        .from('profiles_data')
        .update({
          name: newProfileData.name,
          gender: newProfileData.gender,
          age: newProfileData.age,
          dob: newProfileData.dob,
          location: newProfileData.location,
          height: newProfileData.height,
          complexion: newProfileData.complexion,
          education: newProfileData.education,
          profession: newProfileData.profession,
          marital_status: newProfileData.maritalStatus,
          caste: newProfileData.caste,
          maslak: newProfileData.maslak,
          islamic_knowledge: newProfileData.islamicKnowledge,
          family: newProfileData.family,
          preferred_partner: newProfileData.preferredPartner,
          preferred_location: newProfileData.preferredLocation,
          preferred_age: newProfileData.preferredAge,
        })
        .eq('id', editingProfile.id);

      if (error) throw error;

      toast({
        title: "✅ Profile Updated",
        description: "Changes saved successfully",
      });

      setShowEditDialog(false);
      setEditingProfile(null);
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleAddProfile = async () => {
    if (!newProfileData.name || !newProfileData.gender) {
      toast({
        title: "❌ Validation Error",
        description: "Name and Gender are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const maxOrder = Math.max(...profiles.map(p => p.order), 0);
      
      const { data, error } = await supabase
        .from('profiles_data')
        .insert({
          name: newProfileData.name!,
          gender: newProfileData.gender!,
          age: newProfileData.age || "N/A",
          dob: newProfileData.dob || "N/A",
          location: newProfileData.location || "N/A",
          height: newProfileData.height || "N/A",
          complexion: newProfileData.complexion || "N/A",
          education: newProfileData.education || "N/A",
          profession: newProfileData.profession || "N/A",
          marital_status: newProfileData.maritalStatus || "Single",
          caste: newProfileData.caste,
          maslak: newProfileData.maslak,
          islamic_knowledge: newProfileData.islamicKnowledge,
          family: newProfileData.family || "N/A",
          preferred_partner: newProfileData.preferredPartner || "N/A",
          preferred_location: newProfileData.preferredLocation || "Any",
          preferred_age: newProfileData.preferredAge || "N/A",
          display_order: maxOrder + 1
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "✅ Profile Added",
        description: "New profile created successfully",
      });

      setShowAddDialog(false);
      setNewProfileData({ gender: "Male", maritalStatus: "Single" });
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleUndo = async () => {
    if (history.length === 0) {
      toast({
        title: "Nothing to Undo",
        description: "No recent actions to revert",
      });
      return;
    }

    const lastAction = history[history.length - 1];
    
    try {
      if (lastAction.action === 'delete') {
        // Re-add deleted profile
        const profile = lastAction.data;
        await supabase
          .from('profiles_data')
          .insert({
            name: profile.name,
            gender: profile.gender,
            age: profile.age,
            dob: profile.dob,
            location: profile.location,
            height: profile.height,
            complexion: profile.complexion,
            education: profile.education,
            profession: profile.profession,
            marital_status: profile.maritalStatus,
            caste: profile.caste,
            maslak: profile.maslak,
            islamic_knowledge: profile.islamicKnowledge,
            family: profile.family,
            preferred_partner: profile.preferredPartner,
            preferred_location: profile.preferredLocation,
            preferred_age: profile.preferredAge,
            display_order: profile.order
          });
      } else if (lastAction.action === 'edit') {
        // Restore previous profile data
        const profile = lastAction.data;
        await supabase
          .from('profiles_data')
          .update({
            name: profile.name,
            gender: profile.gender,
            age: profile.age,
            dob: profile.dob,
            location: profile.location,
            height: profile.height,
            complexion: profile.complexion,
            education: profile.education,
            profession: profile.profession,
            marital_status: profile.maritalStatus,
            caste: profile.caste,
            maslak: profile.maslak,
            islamic_knowledge: profile.islamicKnowledge,
            family: profile.family,
            preferred_partner: profile.preferredPartner,
            preferred_location: profile.preferredLocation,
            preferred_age: profile.preferredAge,
          })
          .eq('id', profile.id);
      } else if (lastAction.action === 'reorder') {
        // Restore previous order
        const oldProfiles = lastAction.data;
        for (const profile of oldProfiles) {
          await supabase
            .from('profiles_data')
            .update({ display_order: profile.order })
            .eq('id', profile.id);
        }
        setProfiles(oldProfiles);
      }

      setHistory(prev => prev.slice(0, -1));
      
      toast({
        title: "✅ Undo Successful",
        description: "Last action has been reverted",
      });
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    toast({
      title: "✅ Logged Out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />

      {/* Admin Mode Badge */}
      {user && isAdmin && (
        <div className="fixed top-20 right-4 z-50 animate-fade-in">
          <Badge className="bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold shadow-lg">
            🔧 Admin Mode Active
          </Badge>
        </div>
      )}

      {/* Floating Admin Buttons */}
      {user && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
          {isAdmin && (
            <>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Add Profile</span>
              </Button>
              {history.length > 0 && (
                <Button
                  onClick={handleUndo}
                  variant="secondary"
                  className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center gap-2"
                >
                  <Undo2 className="w-5 h-5" />
                  <span className="font-semibold">Undo</span>
                </Button>
              )}
            </>
          )}
          <button
            onClick={handleLogout}
            className="bg-destructive text-destructive-foreground p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      )}

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Available Profiles</h2>
          <p className="text-muted-foreground text-lg">Browse verified profiles from our community</p>
        </div>

        {/* Admin Toggle */}
        {user && (
          <div className="max-w-4xl mx-auto mb-6 transition-all duration-300 ease-in-out animate-fade-in">
            <Button
              variant={isAdmin ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAdmin(!isAdmin)}
              className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
              disabled={!user}
            >
              <ShieldCheck className="w-4 h-4" />
              {isAdmin ? "Admin Mode: ON" : "Enable Admin Mode"}
            </Button>
          </div>
        )}

        {/* Alert Note */}
        <div className="max-w-4xl mx-auto mb-8 bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            <strong>⚠️ Note:</strong> Detailed biodata and contact details are available only to verified registered members.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-7xl mx-auto px-4 mb-8 space-y-6">
          <Input
            type="text"
            placeholder="Search profiles by name, age, location, or profession..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md mx-auto"
          />
          
          {/* Gender Filter Tabs */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setActiveGender("Male")}
              className={`
                px-8 py-3 rounded-full font-semibold text-base
                transition-all duration-300 ease-in-out
                transform hover:scale-105
                ${activeGender === "Male" 
                  ? "bg-primary text-primary-foreground shadow-button" 
                  : "bg-muted text-muted-foreground hover:bg-primary/20"
                }
              `}
            >
              Male
            </button>
            <button
              onClick={() => setActiveGender("Female")}
              className={`
                px-8 py-3 rounded-full font-semibold text-base
                transition-all duration-300 ease-in-out
                transform hover:scale-105
                ${activeGender === "Female" 
                  ? "bg-primary text-primary-foreground shadow-button" 
                  : "bg-muted text-muted-foreground hover:bg-primary/20"
                }
              `}
            >
              Female
            </button>
          </div>
        </div>

        {/* Profiles Grid */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={isAdmin ? filteredProfiles.map(p => p.id) : []}
            strategy={verticalListSortingStrategy}
            disabled={!isAdmin}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto transition-all duration-300">
              {filteredProfiles.map((profile) => (
                <SortableProfileCard
                  key={profile.id}
                  profile={profile}
                  isAdmin={isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Bottom CTA */}
        <div className="text-center mt-12 bg-card border rounded-lg p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-4">Want to Add Your Profile?</h3>
          <p className="text-muted-foreground mb-6">Register free and let us help you find your perfect match</p>
          <Button size="lg" onClick={() => window.open("https://forms.gle/sY4jHKFHWTqb6yfD9", "_blank")}>
            Register Now
          </Button>
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Make changes to the profile below</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newProfileData.name || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  value={newProfileData.gender || "Male"}
                  onChange={(e) => setNewProfileData({...newProfileData, gender: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  value={newProfileData.age || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, age: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  value={newProfileData.dob || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, dob: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newProfileData.location || ""}
                onChange={(e) => setNewProfileData({...newProfileData, location: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  value={newProfileData.height || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, height: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="complexion">Complexion</Label>
                <Input
                  id="complexion"
                  value={newProfileData.complexion || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, complexion: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="education">Education</Label>
              <Input
                id="education"
                value={newProfileData.education || ""}
                onChange={(e) => setNewProfileData({...newProfileData, education: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="profession">Profession</Label>
              <Input
                id="profession"
                value={newProfileData.profession || ""}
                onChange={(e) => setNewProfileData({...newProfileData, profession: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Input
                  id="maritalStatus"
                  value={newProfileData.maritalStatus || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, maritalStatus: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="caste">Caste</Label>
                <Input
                  id="caste"
                  value={newProfileData.caste || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, caste: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maslak">Maslak</Label>
                <Input
                  id="maslak"
                  value={newProfileData.maslak || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, maslak: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="islamicKnowledge">Islamic Knowledge</Label>
                <Input
                  id="islamicKnowledge"
                  value={newProfileData.islamicKnowledge || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, islamicKnowledge: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="family">Family</Label>
              <Textarea
                id="family"
                value={newProfileData.family || ""}
                onChange={(e) => setNewProfileData({...newProfileData, family: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="preferredPartner">Preferred Partner</Label>
              <Textarea
                id="preferredPartner"
                value={newProfileData.preferredPartner || ""}
                onChange={(e) => setNewProfileData({...newProfileData, preferredPartner: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferredLocation">Preferred Location</Label>
                <Input
                  id="preferredLocation"
                  value={newProfileData.preferredLocation || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, preferredLocation: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="preferredAge">Preferred Age</Label>
                <Input
                  id="preferredAge"
                  value={newProfileData.preferredAge || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, preferredAge: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog - Same structure as Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Profile</DialogTitle>
            <DialogDescription>Fill in the details below to create a new profile</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Same form fields as Edit Dialog */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-name">Name *</Label>
                <Input
                  id="add-name"
                  value={newProfileData.name || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="add-gender">Gender *</Label>
                <select
                  id="add-gender"
                  value={newProfileData.gender || "Male"}
                  onChange={(e) => setNewProfileData({...newProfileData, gender: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-age">Age</Label>
                <Input
                  id="add-age"
                  value={newProfileData.age || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, age: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="add-dob">Date of Birth</Label>
                <Input
                  id="add-dob"
                  value={newProfileData.dob || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, dob: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="add-location">Location</Label>
              <Input
                id="add-location"
                value={newProfileData.location || ""}
                onChange={(e) => setNewProfileData({...newProfileData, location: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-height">Height</Label>
                <Input
                  id="add-height"
                  value={newProfileData.height || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, height: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="add-complexion">Complexion</Label>
                <Input
                  id="add-complexion"
                  value={newProfileData.complexion || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, complexion: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="add-education">Education</Label>
              <Input
                id="add-education"
                value={newProfileData.education || ""}
                onChange={(e) => setNewProfileData({...newProfileData, education: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="add-profession">Profession</Label>
              <Input
                id="add-profession"
                value={newProfileData.profession || ""}
                onChange={(e) => setNewProfileData({...newProfileData, profession: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-maritalStatus">Marital Status</Label>
                <Input
                  id="add-maritalStatus"
                  value={newProfileData.maritalStatus || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, maritalStatus: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="add-caste">Caste</Label>
                <Input
                  id="add-caste"
                  value={newProfileData.caste || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, caste: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-maslak">Maslak</Label>
                <Input
                  id="add-maslak"
                  value={newProfileData.maslak || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, maslak: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="add-islamicKnowledge">Islamic Knowledge</Label>
                <Input
                  id="add-islamicKnowledge"
                  value={newProfileData.islamicKnowledge || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, islamicKnowledge: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="add-family">Family</Label>
              <Textarea
                id="add-family"
                value={newProfileData.family || ""}
                onChange={(e) => setNewProfileData({...newProfileData, family: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="add-preferredPartner">Preferred Partner</Label>
              <Textarea
                id="add-preferredPartner"
                value={newProfileData.preferredPartner || ""}
                onChange={(e) => setNewProfileData({...newProfileData, preferredPartner: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-preferredLocation">Preferred Location</Label>
                <Input
                  id="add-preferredLocation"
                  value={newProfileData.preferredLocation || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, preferredLocation: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="add-preferredAge">Preferred Age</Label>
                <Input
                  id="add-preferredAge"
                  value={newProfileData.preferredAge || ""}
                  onChange={(e) => setNewProfileData({...newProfileData, preferredAge: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddProfile}>Add Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the profile of <strong>{profileToDelete?.name}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profiles;
