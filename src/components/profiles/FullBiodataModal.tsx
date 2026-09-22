import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Users, 
  MessageCircle, 
  Share2, 
  Copy, 
  Printer, 
  Check, 
  Send, 
  HeartHandshake, 
  Sparkles, 
  Calendar, 
  ShieldCheck,
  X 
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
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
  planType?: string;
  photoUrls?: string[];
}

interface FullBiodataModalProps {
  profile: ProfileData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FullBiodataModal({ profile, open, onOpenChange }: FullBiodataModalProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!profile) return null;

  const profileCode = `RM-${profile.gender === "Female" ? "BR" : "GR"}-${profile.id}`;

  const getFullBiodataText = () => {
    return `﷽
ISLAMIC MATRIMONIAL BIODATA
Profile ID: #${profileCode}
---------------------------------
📋 PERSONAL DETAILS:
• Full Name: ${profile.name}
• Gender: ${profile.gender === "Female" ? "Bride 👰" : "Groom 🤵"}
• Age: ${profile.age} years
• Date of Birth: ${profile.dob}
• Height: ${profile.height}
• Complexion: ${profile.complexion}
• Location: ${profile.location}
• Marital Status: ${profile.maritalStatus}

🎓 EDUCATION & OCCUPATION:
• Highest Education: ${profile.education}
• Profession / Job: ${profile.profession}

🕌 RELIGIOUS & DEENI INFO:
${profile.maslak ? `• Maslak / Sect: ${profile.maslak}\n` : ""}${profile.caste ? `• Caste: ${profile.caste}\n` : ""}${profile.islamicKnowledge ? `• Islamic Knowledge: ${profile.islamicKnowledge}\n` : ""}
👨‍👩‍👧‍👦 FAMILY BACKGROUND:
${profile.family}

💑 PARTNER PREFERENCES:
• Preferred Partner: ${profile.preferredPartner}
• Preferred Location: ${profile.preferredLocation}
• Preferred Age: ${profile.preferredAge}

---------------------------------
📩 Inquire via Official WhatsApp: +91-9128719875
🔗 Website: https://rishtamatrimony.vercel.app/profiles?id=${profile.id}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFullBiodataText());
    setCopied(true);
    toast({
      title: "✅ Biodata Copied!",
      description: `Full biodata of ${profile.name} copied to clipboard.`,
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppInquire = () => {
    const text = `Assalamu Alaikum, I am inquiring about Profile ID: #${profileCode} (${profile.name}, ${profile.age} yrs, ${profile.location}) from Rishta Matrimony. Kindly share full contact and guardian details. JazakAllahu Khair.`;
    window.open(`https://wa.me/919128719875?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleWhatsAppShare = () => {
    const text = getFullBiodataText();
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleTelegramShare = () => {
    const text = getFullBiodataText();
    const url = `https://rishtamatrimony.vercel.app/profiles?id=${profile.id}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[calc(100vw-1.5rem)] max-h-[90vh] overflow-y-auto p-0 rounded-2xl border border-primary/20 shadow-2xl relative [&>button]:hidden">
        {/* Hidden Dialog Header for screen readers & Radix UI requirements */}
        <DialogHeader className="sr-only">
          <DialogTitle>Islamic Matrimonial Biodata - {profile.name}</DialogTitle>
          <DialogDescription>Full biodata, family background and preferences for {profile.name} (ID: #{profileCode})</DialogDescription>
        </DialogHeader>

        {/* Prominent High-Contrast Close (Cut) Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-50 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center border border-white/40 backdrop-blur-md shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
          title="Close Biodata"
          aria-label="Close"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Top Islamic Aesthetic Header */}
        <div className="bg-gradient-to-br from-primary via-emerald-800 to-teal-900 text-white p-6 sm:p-8 rounded-t-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="text-2xl sm:text-3xl font-serif tracking-wide text-amber-200 mb-1">
            ﷽
          </div>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium tracking-wider uppercase mb-3">
            Islamic Matrimonial Biodata
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/30 backdrop-blur-md px-3.5 py-1 rounded-full border border-emerald-300/40 text-emerald-100 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>🛡️ 100% Verified Profile</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 text-white text-xs font-semibold">
              <span>Profile ID: #{profileCode}</span>
            </div>
            <Badge variant="secondary" className="bg-white text-primary text-xs font-bold">
              {profile.gender === "Female" ? "👰 Bride" : "🤵 Groom"}
            </Badge>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {profile.name}
          </h2>
          <p className="text-sm text-emerald-100 mt-1">
            {profile.age} Yrs • {profile.maritalStatus} • {profile.location}
          </p>
        </div>

        {/* Biodata Body Content */}
        <div className="p-5 sm:p-7 space-y-6 bg-background">
          {/* Section 1: Basic & Physical Details */}
          <div className="bg-muted/40 rounded-xl p-4 sm:p-5 border border-border/60">
            <div className="flex items-center gap-2 text-primary font-bold text-base mb-4 pb-2 border-b border-border/60">
              <User className="w-5 h-5" />
              <span>Personal & Physical Details</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-sm">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Age / DOB</p>
                <p className="font-semibold text-foreground mt-0.5">{profile.age} yrs / {profile.dob}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Height</p>
                <p className="font-semibold text-foreground mt-0.5">{profile.height}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Complexion</p>
                <p className="font-semibold text-foreground mt-0.5">{profile.complexion}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Marital Status</p>
                <p className="font-semibold text-foreground mt-0.5">{profile.maritalStatus}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Location</p>
                <p className="font-semibold text-foreground mt-0.5">{profile.location}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Gender</p>
                <p className="font-semibold text-foreground mt-0.5">{profile.gender}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Education & Career */}
          <div className="bg-muted/40 rounded-xl p-4 sm:p-5 border border-border/60">
            <div className="flex items-center gap-2 text-primary font-bold text-base mb-4 pb-2 border-b border-border/60">
              <GraduationCap className="w-5 h-5" />
              <span>Education & Profession</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-background rounded-lg p-3 border">
                <div className="flex items-start gap-2.5">
                  <GraduationCap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Highest Education</p>
                    <p className="font-semibold text-foreground mt-0.5">{profile.education}</p>
                  </div>
                </div>
              </div>
              <div className="bg-background rounded-lg p-3 border">
                <div className="flex items-start gap-2.5">
                  <Briefcase className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Profession / Job</p>
                    <p className="font-semibold text-foreground mt-0.5">{profile.profession}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Religious & Deeni Background */}
          {(profile.maslak || profile.caste || profile.islamicKnowledge) && (
            <div className="bg-muted/40 rounded-xl p-4 sm:p-5 border border-border/60">
              <div className="flex items-center gap-2 text-primary font-bold text-base mb-4 pb-2 border-b border-border/60">
                <Sparkles className="w-5 h-5" />
                <span>Religious & Deeni Information</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {profile.maslak && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Maslak / Sect</p>
                    <p className="font-semibold text-foreground mt-0.5">{profile.maslak}</p>
                  </div>
                )}
                {profile.caste && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Caste / Community</p>
                    <p className="font-semibold text-foreground mt-0.5">{profile.caste}</p>
                  </div>
                )}
                {profile.islamicKnowledge && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground font-medium">Islamic Knowledge</p>
                    <p className="font-semibold text-foreground mt-0.5">{profile.islamicKnowledge}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 4: Family Details */}
          <div className="bg-muted/40 rounded-xl p-4 sm:p-5 border border-border/60">
            <div className="flex items-center gap-2 text-primary font-bold text-base mb-3 pb-2 border-b border-border/60">
              <Users className="w-5 h-5" />
              <span>Family Background</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed bg-background p-3.5 rounded-lg border">
              {profile.family}
            </p>
          </div>

          {/* Section 5: Partner Preferences */}
          <div className="bg-primary/5 rounded-xl p-4 sm:p-5 border border-primary/20">
            <div className="flex items-center gap-2 text-primary font-bold text-base mb-3 pb-2 border-b border-primary/10">
              <HeartHandshake className="w-5 h-5" />
              <span>Partner Preferences & Expectations</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed mb-4">
              {profile.preferredPartner}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-background">
                📍 Preferred Location: {profile.preferredLocation}
              </Badge>
              <Badge variant="outline" className="bg-background">
                🎂 Preferred Age: {profile.preferredAge}
              </Badge>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="bg-muted/60 p-4 sm:p-6 border-t flex flex-col sm:flex-row gap-3 items-center justify-between rounded-b-2xl">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex-1 sm:flex-initial gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy Biodata"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleWhatsAppShare}
              className="flex-1 sm:flex-initial gap-1.5 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-950/30"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share WhatsApp</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTelegramShare}
              className="flex-1 sm:flex-initial gap-1.5 text-sky-700 dark:text-sky-400 border-sky-300 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-950/30"
            >
              <Send className="w-4 h-4" />
              <span>Share Telegram</span>
            </Button>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="whatsapp"
              size="default"
              onClick={handleWhatsAppInquire}
              className="flex-1 sm:flex-initial gap-2 font-semibold shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire on WhatsApp</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
