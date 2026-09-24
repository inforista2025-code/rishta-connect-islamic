import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, GraduationCap, Briefcase, Users, AlertCircle, GripVertical, ShieldCheck, LogIn, LogOut, Pencil, Trash2, Undo2, Plus, Share2, Copy, MessageCircle, Send, X, Eye, Lock, Heart, Sparkles, Search, SlidersHorizontal, UserX, RotateCcw, ArrowRight, UserPlus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { MemberProfileActions } from "@/components/member/MemberProfileActions";
import { ProfileCardPhoto } from "@/components/profiles/ProfileCardPhoto";
import { FullBiodataModal } from "@/components/profiles/FullBiodataModal";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { calculateAge } from "@/lib/ageCalculator";
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
  planType?: string;
  premiumExpiry?: string;
  photoUrls?: string[];
}

interface SortableProfileCardProps {
  profile: Profile;
  isAdmin: boolean;
  viewerIsPremium: boolean;
  onEdit: (profile: Profile) => void;
  onDelete: (profile: Profile) => void;
  onViewBiodata: (profile: Profile) => void;
}

const SortableProfileCard = memo(({ profile, isAdmin, viewerIsPremium, onEdit, onDelete, onViewBiodata }: SortableProfileCardProps) => {
  const isPremium = profile.planType === 'premium' && (!profile.premiumExpiry || new Date(profile.premiumExpiry) > new Date());
  const [showShareModal, setShowShareModal] = useState(false);
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  
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

  const getShareText = useCallback(() => {
    return `Assalamu Alaikum, here is a profile you may be interested in:

📋 Personal Details:
Name: ${profile.name}
Age: ${profile.age} yrs
DOB: ${profile.dob}
Location: ${profile.location}
Height: ${profile.height}
Complexion: ${profile.complexion}

🎓 Education & Career:
Education: ${profile.education}
Profession: ${profile.profession}
Marital Status: ${profile.maritalStatus}

🕌 Religious Information:${profile.caste ? `\nCaste: ${profile.caste}` : ''}${profile.maslak ? `\nMaslak: ${profile.maslak}` : ''}${profile.islamicKnowledge ? `\nIslamic Knowledge: ${profile.islamicKnowledge}` : ''}

👨‍👩‍👧‍👦 Family:
${profile.family}

💑 Partner Preferences:
Preferred Partner: ${profile.preferredPartner}
Preferred Location: ${profile.preferredLocation}
Preferred Age: ${profile.preferredAge}

📩 For Request Detailed Profile, message on WhatsApp: +91-9128719875

View full profile here:`;
  }, [profile]);

  const getProfileUrl = useCallback(() => {
    return `${window.location.origin}/profiles?id=${profile.id}`;
  }, [profile.id]);

  const handleShare = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const shareData = {
      title: `Rishta Profile – ${profile.name}`,
      text: getShareText(),
      url: getProfileUrl(),
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // If user cancelled, do nothing. For any other error, show fallback modal
        if ((err as Error).name === 'AbortError') {
          return;
        }
        // Show fallback modal for permission denied or other errors
        setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  }, [profile.name, getShareText, getProfileUrl]);

  const handleCopyLink = useCallback(() => {
    const textToCopy = `${getShareText()}\n${getProfileUrl()}`;
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied!",
      description: "Profile details copied to clipboard",
    });
    setShowShareModal(false);
  }, [getShareText, getProfileUrl, toast]);

  const handleWhatsAppShare = useCallback(() => {
    const text = `${getShareText()}\n${getProfileUrl()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    setShowShareModal(false);
  }, [getShareText, getProfileUrl]);

  const handleTelegramShare = useCallback(() => {
    const text = `${getShareText()}\n${getProfileUrl()}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(getProfileUrl())}&text=${encodeURIComponent(getShareText())}`, '_blank');
    setShowShareModal(false);
  }, [getShareText, getProfileUrl]);

  const profileCode = `RM-${profile.gender === "Female" ? "BR" : "GR"}-${profile.id}`;

  return (
    <div ref={setNodeRef} style={style} className="animate-fade-in" id={`profile-${profile.id}`}>
      {isPremium && (
        <div className="flex justify-start mb-[-1px]">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-t-lg text-xs font-bold text-white shadow-sm" style={{ backgroundColor: '#6C4DF6' }}>
            ⭐ Premium Featured
          </span>
        </div>
      )}
      <Card 
        className={`group hover:-translate-y-1.5 hover:shadow-2xl active:scale-[0.99] transition-all duration-300 ease-out border rounded-2xl overflow-hidden bg-card ${isPremium ? 'border-[#6C4DF6]' : 'border-border/80'}`}
        style={isPremium ? { 
          boxShadow: '0 0 12px rgba(108,77,246,0.25)',
          backgroundColor: '#FCFBFF'
        } : undefined}
      >
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onViewBiodata(profile);
          }} 
          className="cursor-pointer"
        >
          <ProfileCardPhoto
            photoUrls={profile.photoUrls}
            name={profile.name}
            viewerIsPremium={viewerIsPremium}
          />
        </div>

        <CardHeader className="bg-primary/5 pb-3 pt-4 border-b">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/50">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>🛡️ Verified Profile</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground border">
                  ID: #{profileCode}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isAdmin && (
                  <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <h3 
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewBiodata(profile);
                  }} 
                  className="font-bold text-xl text-foreground hover:text-primary transition-colors cursor-pointer truncate"
                >
                  {profile.name}
                </h3>
                <Badge variant="secondary" className="text-xs font-semibold shrink-0">
                  {profile.gender === "Female" ? "👰 Bride" : "🤵 Groom"}
                </Badge>
              </div>
            </div>

            {isAdmin && (
              <div className="flex gap-1 shrink-0">
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
        </CardHeader>
        
        <CardContent className="p-5 space-y-4">
          {/* Quick Snapshot Badges (Compact Chips) */}
          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 bg-muted/40 p-2.5 rounded-xl border border-border/60">
              <span className="text-base">🎂</span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Age / Height</p>
                <p className="font-semibold text-foreground truncate">{profile.age} yrs • {profile.height}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-muted/40 p-2.5 rounded-xl border border-border/60">
              <span className="text-base">📍</span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Location</p>
                <p className="font-semibold text-foreground truncate">{profile.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-muted/40 p-2.5 rounded-xl border border-border/60">
              <span className="text-base">🎓</span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Education</p>
                <p className="font-semibold text-foreground truncate">{profile.education}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-muted/40 p-2.5 rounded-xl border border-border/60">
              <span className="text-base">💼</span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Profession</p>
                <p className="font-semibold text-foreground truncate">{profile.profession}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-muted/40 p-2.5 rounded-xl border border-border/60">
              <span className="text-base">💒</span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Status</p>
                <p className="font-semibold text-foreground truncate">{profile.maritalStatus}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-muted/40 p-2.5 rounded-xl border border-border/60">
              <span className="text-base">🕌</span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Maslak / Sect</p>
                <p className="font-semibold text-foreground truncate">{profile.maslak || profile.caste || "Muslim"}</p>
              </div>
            </div>
          </div>

          {/* Quick Partner Preference Teaser */}
          {profile.preferredPartner && (
            <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 text-xs">
              <p className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
                <span>💑</span> Partner Preference:
              </p>
              <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                {profile.preferredPartner}
              </p>
            </div>
          )}

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <Button 
              className="flex-1 font-semibold gap-1.5 h-11 text-xs sm:text-sm shadow-sm" 
              size="default" 
              onClick={(e) => {
                e.stopPropagation();
                onViewBiodata(profile);
              }}
            >
              <Eye className="w-4 h-4" />
              <span>View Full Biodata</span>
            </Button>
            <div className="flex gap-2 flex-1">
              <Button 
                variant="whatsapp"
                className="flex-1 font-semibold gap-1.5 h-11 text-xs sm:text-sm shadow-sm" 
                size="default" 
                asChild
              >
                <a 
                  href={`https://wa.me/919128719875?text=Assalamu%20Alaikum%2C%20I%20would%20like%20to%20inquire%20about%20Profile%20ID%3A%20%23${profileCode}%20(${encodeURIComponent(profile.name)})%20from%20Rishta%20Matrimony.%20Kindly%20share%20details.%20JazakAllahu%20Khair.`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </Button>
              <Button 
                type="button"
                className="px-3 h-11 shrink-0" 
                size="default"
                variant="outline"
                onClick={handleShare}
                title="Share Profile"
              >
                <Share2 className="w-4 h-4 text-primary" />
              </Button>
            </div>
          </div>

          <MemberProfileActions profileId={profile.id} compact />
        </CardContent>
      </Card>

      {/* Share Modal for Desktop Fallback */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Profile</DialogTitle>
            <DialogDescription>
              Share this profile with others
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg text-sm">
              <p className="font-semibold mb-2">{profile.name}</p>
              <p className="text-muted-foreground whitespace-pre-line">{getShareText()}</p>
              <p className="text-primary mt-2 break-all">{getProfileUrl()}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={handleCopyLink} className="w-full">
                <Copy className="w-4 h-4 mr-2" />
                Copy All
              </Button>
              <Button onClick={handleWhatsAppShare} className="w-full" variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Share on WhatsApp
              </Button>
              <Button onClick={handleTelegramShare} className="w-full" variant="outline">
                <Send className="w-4 h-4 mr-2" />
                Share on Telegram
              </Button>
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button type="button" variant="ghost" onClick={() => setShowShareModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

const ProfileSkeleton = () => (
  <Card className="animate-fade-in">
    <CardHeader className="bg-primary/5 border-b">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="h-6 w-16" />
      </CardTitle>
    </CardHeader>
    
    <CardContent className="pt-6 space-y-4">
      {/* Basic Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Education & Profession */}
      <div className="space-y-3 pt-2 border-t">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-start gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Marital Status */}
      <div className="pt-2 border-t">
        <div className="flex items-start gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>

      {/* Family Info */}
      <div className="pt-2 border-t">
        <div className="flex items-start gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="pt-2 border-t bg-muted/30 -mx-6 px-6 py-4 rounded-b-lg space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>

      {/* Action Button */}
      <Skeleton className="w-full h-11 rounded-md" />
    </CardContent>
  </Card>
);

const Profiles = () => {
  const { member } = useMemberAuth();
  const viewerIsPremium =
    member?.plan_type === "premium" &&
    (!member?.premium_expiry || new Date(member.premium_expiry) > new Date());
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeGender, setActiveGender] = useState<"Male" | "Female">("Female");
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [maslakFilter, setMaslakFilter] = useState("all");
  
  // Full Biodata Modal state
  const [selectedBiodataProfile, setSelectedBiodataProfile] = useState<Profile | null>(null);
  const [isBiodataOpen, setIsBiodataOpen] = useState(false);

  const handleViewBiodata = useCallback((profile: Profile) => {
    setSelectedBiodataProfile(profile);
    setIsBiodataOpen(true);
  }, []);

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
  ].map(p => ({ ...p, age: calculateAge(p.dob, p.age) }));

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
          .eq('verification_status', 'verified')
          .eq('is_live', true)
          .order('display_order', { ascending: false });

        if (error) throw error;

        if (dbProfiles && dbProfiles.length > 0) {
          const formattedProfiles = dbProfiles.map(p => ({
            id: p.id,
            name: p.name,
            gender: p.gender,
            age: calculateAge(p.dob, p.age),
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
            order: p.display_order,
            planType: (p as any).plan_type || 'free',
            premiumExpiry: (p as any).premium_expiry || undefined,
            photoUrls: p.photo_urls || undefined,
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
            .eq('verification_status', 'verified')
            .eq('is_live', true)
            .order('display_order', { ascending: false });

          if (dbProfiles) {
            const formattedProfiles = dbProfiles.map(p => ({
              id: p.id,
              name: p.name,
              gender: p.gender,
              age: calculateAge(p.dob, p.age),
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
              order: p.display_order,
              planType: (p as any).plan_type || 'free',
              premiumExpiry: (p as any).premium_expiry || undefined,
              photoUrls: p.photo_urls || undefined,
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

  // Parse URL search parameters on mount or URL change
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const paramGender = urlParams.get('gender');
    const paramAge = urlParams.get('age');
    const paramLocation = urlParams.get('location');
    const paramMaslak = urlParams.get('maslak');
    const paramSearch = urlParams.get('search');
    const profileId = urlParams.get('id');

    if (paramGender === "Male" || paramGender === "Female") {
      setActiveGender(paramGender);
    }
    if (paramAge) setAgeFilter(paramAge);
    if (paramLocation) setLocationFilter(paramLocation);
    if (paramMaslak) setMaslakFilter(paramMaslak);
    if (paramSearch) setSearchTerm(paramSearch);
    
    if (profileId && profiles.length > 0) {
      // Find the profile to get its gender
      const targetProfile = profiles.find(p => p.id === parseInt(profileId));
      
      if (targetProfile) {
        // Set the correct gender tab
        setActiveGender(targetProfile.gender as "Male" | "Female");
        
        // Smoothly scroll to the target profile card and highlight it
        setTimeout(() => {
          const profileElement = document.getElementById(`profile-${profileId}`);
          if (profileElement) {
            profileElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a prominent highlight ring effect
            profileElement.classList.add('ring-4', 'ring-primary', 'ring-offset-4', 'transition-all', 'duration-500');
            setTimeout(() => {
              profileElement.classList.remove('ring-4', 'ring-primary', 'ring-offset-4');
            }, 3500);
          }
        }, 400);
      }
    }
  }, [profiles, location.search]);

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
      .filter(profile => {
        // Gender filter
        if (profile.gender !== activeGender) return false;

        // Search term filter
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchSearch =
            profile.name.toLowerCase().includes(term) ||
            profile.age.toString().includes(term) ||
            profile.location.toLowerCase().includes(term) ||
            profile.profession.toLowerCase().includes(term) ||
            (profile.caste && profile.caste.toLowerCase().includes(term)) ||
            (profile.maslak && profile.maslak.toLowerCase().includes(term));
          if (!matchSearch) return false;
        }

        // Location filter
        if (locationFilter !== "all" && locationFilter.trim()) {
          if (!profile.location.toLowerCase().includes(locationFilter.toLowerCase())) {
            return false;
          }
        }

        // Maslak filter (Clean categorized matching)
        if (maslakFilter !== "all" && maslakFilter.trim()) {
          if (!profile.maslak) return false;
          const pMaslak = profile.maslak.toLowerCase();
          const filter = maslakFilter.toLowerCase();

          if (filter.includes("sunni")) {
            const isMatch = pMaslak.includes("sunni") || pMaslak.includes("hanafi") || pMaslak.includes("ahle sunnat") || pMaslak === "muslim";
            if (!isMatch) return false;
          } else if (filter.includes("salafi") || filter.includes("hadees") || filter.includes("hadith")) {
            const isMatch = pMaslak.includes("salafi") || pMaslak.includes("hadees") || pMaslak.includes("hadith");
            if (!isMatch) return false;
          } else if (filter.includes("deoband")) {
            const isMatch = pMaslak.includes("deoband") || pMaslak.includes("tabligh");
            if (!isMatch) return false;
          } else if (filter.includes("barelv")) {
            const isMatch = pMaslak.includes("barelv") || pMaslak.includes("razvi");
            if (!isMatch) return false;
          } else if (filter.includes("shafi") || filter.includes("maliki") || filter.includes("hanbali")) {
            const isMatch = pMaslak.includes("shafi") || pMaslak.includes("maliki") || pMaslak.includes("hanbali");
            if (!isMatch) return false;
          } else if (filter.includes("practicing") || filter.includes("general")) {
            const isMatch = pMaslak.includes("muslim") || pMaslak.includes("practicing") || pMaslak.includes("any");
            if (!isMatch) return false;
          } else {
            if (!pMaslak.includes(filter)) return false;
          }
        }

        // Age range filter
        if (ageFilter !== "all" && ageFilter.trim()) {
          const numAge = parseInt(profile.age);
          if (!isNaN(numAge)) {
            if (ageFilter === "18-24" && (numAge < 18 || numAge > 24)) return false;
            if (ageFilter === "25-30" && (numAge < 25 || numAge > 30)) return false;
            if (ageFilter === "31-35" && (numAge < 31 || numAge > 35)) return false;
            if (ageFilter === "36-45" && (numAge < 36 || numAge > 45)) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // Premium profiles first
        const aIsPremium = a.planType === 'premium' && (!a.premiumExpiry || new Date(a.premiumExpiry) > new Date()) ? 1 : 0;
        const bIsPremium = b.planType === 'premium' && (!b.premiumExpiry || new Date(b.premiumExpiry) > new Date()) ? 1 : 0;
        if (bIsPremium !== aIsPremium) return bIsPremium - aIsPremium;
        return b.order - a.order;
      }),
    [profiles, activeGender, searchTerm, locationFilter, maslakFilter, ageFilter]
  );

  // Clean, non-repeating Standard Maslak Options
  const standardMaslakOptions = useMemo(() => [
    "Sunni",
    "Salafi (Ahle Hadees)",
    "Deobandi",
    "Barelvi",
    "Shafi'i / Maliki / Hanbali",
    "Practicing Muslim (General)",
  ], []);

  // Extract dynamic filter options from profiles
  const availableLocations = useMemo(() => {
    const locSet = new Set<string>();
    profiles.forEach(p => {
      if (p.location && p.location !== "N/A") {
        // Split locations by comma if applicable to get primary cities
        const parts = p.location.split(',').map(s => s.trim());
        parts.forEach(part => {
          if (part.length > 2) locSet.add(part);
        });
      }
    });
    return Array.from(locSet).sort();
  }, [profiles]);

  const femaleCount = useMemo(() => profiles.filter(p => p.gender === "Female").length, [profiles]);
  const maleCount = useMemo(() => profiles.filter(p => p.gender === "Male").length, [profiles]);
  const isAnyFilterActive = locationFilter !== "all" || ageFilter !== "all" || maslakFilter !== "all" || searchTerm.trim() !== "";

  // Pagination Logic (12 profiles per page)
  const PROFILES_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to Page 1 when any filter or gender changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeGender, searchTerm, locationFilter, ageFilter, maslakFilter]);

  const totalPages = Math.ceil(filteredProfiles.length / PROFILES_PER_PAGE) || 1;

  const paginatedProfiles = useMemo(() => {
    const start = (currentPage - 1) * PROFILES_PER_PAGE;
    return filteredProfiles.slice(start, start + PROFILES_PER_PAGE);
  }, [filteredProfiles, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    const targetElement = document.getElementById("profiles-grid-section");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 400, behavior: "smooth" });
    }
  }, [currentPage, totalPages]);

  const handleResetFilters = useCallback(() => {
    setLocationFilter("all");
    setAgeFilter("all");
    setMaslakFilter("all");
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

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
          display_order: maxOrder + 1,
          verification_status: 'verified',
          is_live: true,
        } as any)
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

      {/* Islamic Premium Header Section - Compact */}
      <div className="relative bg-gradient-to-b from-primary/10 via-muted/20 to-background pt-6 pb-6 px-4 text-center overflow-hidden border-b mb-6">
        <div className="max-w-3xl mx-auto relative z-10">
          {/* Bismillah Calligraphy */}
          <div className="text-2xl font-serif text-primary/80 mb-1">
            ﷽
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-2">
            Verified Islamic Profiles
          </h1>
          
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Find your ideal Muslim life partner according to the Quran & Sunnah. Browse authentic rishta proposals.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 pb-10">
        {/* Admin Toggle */}
        {user && (
          <div className="max-w-4xl mx-auto mb-4 transition-all duration-300 ease-in-out animate-fade-in">
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
        <div className="max-w-4xl mx-auto mb-6 bg-primary/10 border border-primary/20 rounded-xl p-3.5 flex items-start gap-2.5 shadow-xs">
          <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-foreground">
            <strong>⚠️ Note:</strong> Detailed biodata and contact details are available only to verified registered members.
          </p>
        </div>

        {/* Search, Filter Bar & Gender Switcher */}
        <div className="max-w-6xl mx-auto px-4 mb-10 space-y-6">
          {/* Gender Switcher Tabs with Live Badges (Single Row on Mobile & Desktop) */}
          <div className="flex gap-2 sm:gap-3 justify-center items-center max-w-md mx-auto">
            <button
              onClick={() => setActiveGender("Female")}
              className={`
                flex-1 py-2.5 sm:py-3 px-3 sm:px-6 rounded-full font-bold text-xs sm:text-base flex items-center justify-center gap-1.5 sm:gap-2.5
                transition-all duration-300 ease-in-out shadow-xs
                transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap
                ${activeGender === "Female" 
                  ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30" 
                  : "bg-card text-foreground hover:bg-muted border"
                }
              `}
            >
              <span className="text-sm sm:text-base">👰</span>
              <span>Brides</span>
              <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${activeGender === "Female" ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                {femaleCount}
              </span>
            </button>
            <button
              onClick={() => setActiveGender("Male")}
              className={`
                flex-1 py-2.5 sm:py-3 px-3 sm:px-6 rounded-full font-bold text-xs sm:text-base flex items-center justify-center gap-1.5 sm:gap-2.5
                transition-all duration-300 ease-in-out shadow-xs
                transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap
                ${activeGender === "Male" 
                  ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30" 
                  : "bg-card text-foreground hover:bg-muted border"
                }
              `}
            >
              <span className="text-sm sm:text-base">🤵</span>
              <span>Grooms</span>
              <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${activeGender === "Male" ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                {maleCount}
              </span>
            </button>
          </div>

          {/* Search Bar & Multi-Filter Dropdown Controls */}
          <div className="bg-card border rounded-2xl p-3.5 sm:p-5 shadow-xs space-y-3 sm:space-y-4">
            {/* Top Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, city, caste, education, or profession..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 sm:h-11 rounded-xl bg-background border-muted-foreground/20 text-xs sm:text-sm focus-visible:ring-primary"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns Grid (Single Row 3-Column on Mobile & Desktop) */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
              {/* Location Select */}
              <div className="space-y-1 min-w-0">
                <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-primary shrink-0" />
                  <span className="truncate">City/State</span>
                </label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="h-9 sm:h-10 rounded-xl bg-background text-[11px] sm:text-sm px-2 sm:px-3">
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🌍 All Locations</SelectItem>
                    {availableLocations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Maslak / Sect Select */}
              <div className="space-y-1 min-w-0">
                <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 truncate">
                  <SlidersHorizontal className="w-3 h-3 text-primary shrink-0" />
                  <span className="truncate">Maslak</span>
                </label>
                <Select value={maslakFilter} onValueChange={setMaslakFilter}>
                  <SelectTrigger className="h-9 sm:h-10 rounded-xl bg-background text-[11px] sm:text-sm px-2 sm:px-3">
                    <SelectValue placeholder="All Maslaks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🕌 All Maslaks</SelectItem>
                    {standardMaslakOptions.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Age Range Select */}
              <div className="space-y-1 min-w-0">
                <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 truncate">
                  <User className="w-3 h-3 text-primary shrink-0" />
                  <span className="truncate">Age</span>
                </label>
                <Select value={ageFilter} onValueChange={setAgeFilter}>
                  <SelectTrigger className="h-9 sm:h-10 rounded-xl bg-background text-[11px] sm:text-sm px-2 sm:px-3">
                    <SelectValue placeholder="All Ages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🎂 All Ages</SelectItem>
                    <SelectItem value="18-24">18 – 24 yrs</SelectItem>
                    <SelectItem value="25-30">25 – 30 yrs</SelectItem>
                    <SelectItem value="31-35">31 – 35 yrs</SelectItem>
                    <SelectItem value="36-45">36 – 45 yrs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filter Chips & Reset */}
            {isAnyFilterActive && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-muted-foreground font-semibold">Active:</span>
                  {locationFilter !== "all" && (
                    <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-0.5 text-xs rounded-lg">
                      Location: {locationFilter}
                      <button onClick={() => setLocationFilter("all")} className="hover:bg-muted-foreground/20 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {maslakFilter !== "all" && (
                    <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-0.5 text-xs rounded-lg">
                      Maslak: {maslakFilter}
                      <button onClick={() => setMaslakFilter("all")} className="hover:bg-muted-foreground/20 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {ageFilter !== "all" && (
                    <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-0.5 text-xs rounded-lg">
                      Age: {ageFilter} yrs
                      <button onClick={() => setAgeFilter("all")} className="hover:bg-muted-foreground/20 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {searchTerm.trim() && (
                    <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-0.5 text-xs rounded-lg">
                      "{searchTerm}"
                      <button onClick={() => setSearchTerm("")} className="hover:bg-muted-foreground/20 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-8 text-xs text-primary hover:text-primary/80 gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </Button>
              </div>
            )}
          </div>

          {/* Results Summary Bar */}
          <div id="profiles-grid-section" className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs sm:text-sm text-muted-foreground px-1 pt-1">
            <p>
              Showing <span className="font-bold text-foreground">
                {filteredProfiles.length === 0 ? 0 : (currentPage - 1) * PROFILES_PER_PAGE + 1}–{Math.min(currentPage * PROFILES_PER_PAGE, filteredProfiles.length)}
              </span> of <span className="font-bold text-foreground">{filteredProfiles.length}</span> verified {activeGender === "Female" ? "Bride" : "Groom"} {filteredProfiles.length === 1 ? "profile" : "profiles"}
            </p>
            {totalPages > 1 && (
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full w-fit">
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>
        </div>

        {/* Profiles Grid or Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProfileSkeleton key={i} />
            ))}
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="max-w-md mx-auto my-12 p-8 bg-card border rounded-2xl text-center shadow-sm space-y-4 animate-fade-in">
            <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <UserX className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">No Profiles Found</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                We couldn't find any {activeGender.toLowerCase()} profile matching your search or filter criteria.
              </p>
            </div>
            {isAnyFilterActive && (
              <Button onClick={handleResetFilters} variant="outline" className="text-xs h-9 rounded-xl gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear All Filters</span>
              </Button>
            )}
          </div>
        ) : (
          <>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={isAdmin ? paginatedProfiles.map(p => p.id) : []}
                strategy={verticalListSortingStrategy}
                disabled={!isAdmin}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto transition-all duration-300">
                  {paginatedProfiles.map((profile) => (
                    <SortableProfileCard
                      key={profile.id}
                      profile={profile}
                      isAdmin={isAdmin}
                      viewerIsPremium={!!viewerIsPremium}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onViewBiodata={handleViewBiodata}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs max-w-7xl mx-auto">
                <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                  Showing <span className="font-bold text-foreground">{(currentPage - 1) * PROFILES_PER_PAGE + 1}–{Math.min(currentPage * PROFILES_PER_PAGE, filteredProfiles.length)}</span> of <span className="font-bold text-foreground">{filteredProfiles.length}</span> profiles
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-10 px-3.5 rounded-xl text-xs font-semibold gap-1.5 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        // Show first, last, current, and surrounding pages
                        return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                      })
                      .map((page, idx, arr) => {
                        const prevPage = arr[idx - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;

                        return (
                          <div key={page} className="flex items-center">
                            {showEllipsis && <span className="px-1.5 text-xs text-muted-foreground font-bold select-none">...</span>}
                            <Button
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className={`h-10 w-10 p-0 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                currentPage === page 
                                  ? "shadow-sm ring-2 ring-primary/20 scale-105" 
                                  : "hover:bg-muted"
                              }`}
                            >
                              {page}
                            </Button>
                          </div>
                        );
                      })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-10 px-3.5 rounded-xl text-xs font-semibold gap-1.5 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Premium Islamic Bottom Registration Banner - Compact */}
        <div className="mt-12 bg-gradient-to-br from-emerald-900 via-primary to-teal-950 text-white rounded-2xl p-5 sm:p-7 shadow-lg border border-emerald-500/30 relative overflow-hidden text-center max-w-3xl mx-auto">
          {/* Subtle Background Glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-emerald-200 border border-white/15 backdrop-blur-sm shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>100% Free Matrimonial Network</span>
            </span>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Looking for a Righteous Life Partner?
            </h3>

            <p className="text-xs text-emerald-100/90 leading-relaxed max-w-lg mx-auto">
              Create your verified matrimonial profile in under 2 minutes with complete privacy protection.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <Button
                size="default"
                onClick={() => navigate("/register")}
                className="w-full sm:w-auto bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-xs sm:text-sm px-6 h-10 rounded-xl shadow-md transition-all duration-200 gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-emerald-800" />
                <span>Register Profile Free</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-800" />
              </Button>

              <Button
                size="default"
                variant="outline"
                asChild
                className="w-full sm:w-auto border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-5 h-10 rounded-xl backdrop-blur-sm transition-all duration-200 gap-1.5 cursor-pointer"
              >
                <a
                  href="https://wa.me/919128719875?text=Assalamu%20Alaikum%2C%20I%20have%20an%20inquiry%20regarding%20Rishta%20Matrimony."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>WhatsApp Inquiry</span>
                </a>
              </Button>
            </div>
          </div>
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

      {/* Full Islamic Biodata Modal */}
      <FullBiodataModal
        profile={selectedBiodataProfile}
        open={isBiodataOpen}
        onOpenChange={setIsBiodataOpen}
      />

      <Footer />
    </div>
  );
};

export default Profiles;
