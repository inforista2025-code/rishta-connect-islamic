import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Heart, 
  Printer, 
  Share2, 
  MessageCircle, 
  Send, 
  Check, 
  ShieldCheck, 
  Sparkles,
  Calendar,
  Ruler,
  SunMedium,
  BookOpen
} from "lucide-react";
import { useState, useCallback } from "react";

export interface BiodataProfile {
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
  order?: number;
  planType?: string;
  premiumExpiry?: string;
  photoUrls?: string[];
}

interface BiodataModalProps {
  profile: BiodataProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BiodataModal({ profile, isOpen, onClose }: BiodataModalProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!profile) return null;

  const profileCode = `RM-${profile.gender === 'Female' ? 'BRIDE' : 'GROOM'}-${profile.id.toString().padStart(3, '0')}`;
  const isPremium = profile.planType === 'premium' && (!profile.premiumExpiry || new Date(profile.premiumExpiry) > new Date());
  const whatsappNumber = "919128719875";

  const whatsappMessage = encodeURIComponent(
    `Assalamualaikum Rishta Matrimony,\n\nI am interested in:\n📋 Profile Code: ${profileCode}\n👤 Name: ${profile.name}\n🎂 Age: ${profile.age} yrs (${profile.gender})\n📍 Location: ${profile.location}\n🎓 Education: ${profile.education}\n💼 Profession: ${profile.profession}\n\nPlease share further biodata details and family contact process. JazakAllahu Khair.`
  );

  const shareText = `*Rishta Matrimony – Islamic Biodata*\n\n` +
    `📋 *Profile Code:* ${profileCode}\n` +
    `👤 *Name:* ${profile.name} (${profile.gender === 'Female' ? 'Bride' : 'Groom'})\n` +
    `🎂 *Age / Height:* ${profile.age} yrs | ${profile.height}\n` +
    `📍 *Location:* ${profile.location}\n` +
    `🎓 *Education:* ${profile.education}\n` +
    `💼 *Profession:* ${profile.profession}\n` +
    `💒 *Marital Status:* ${profile.maritalStatus}\n` +
    (profile.maslak ? `🕌 *Maslak:* ${profile.maslak}\n` : '') +
    (profile.caste ? `🏷️ *Caste:* ${profile.caste}\n` : '') +
    `\n👨‍👩‍👧‍👦 *Family:* ${profile.family}\n` +
    `💑 *Partner Preference:* ${profile.preferredPartner}\n\n` +
    `🔗 *View Full Profile:* ${window.location.origin}/profiles?id=${profile.id}\n` +
    `💬 *WhatsApp Inquiry:* https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    toast({
      title: "✅ Biodata Copied",
      description: "Full biodata details copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2500);
  }, [shareText, toast]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-primary/20 bg-background sm:rounded-2xl print:max-w-none print:max-h-none print:shadow-none print:border-none print:p-4">
        
        {/* Islamic Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 text-center relative overflow-hidden print:bg-emerald-800 print:text-black">
          {/* Subtle Islamic Calligraphy ornament */}
          <div className="text-xl sm:text-2xl font-serif tracking-widest text-emerald-100/90 mb-2 font-arabic select-none">
            ﷽
          </div>
          <p className="text-xs sm:text-sm tracking-wider uppercase text-emerald-200 font-medium">
            In the Name of Allah, the Most Gracious, the Most Merciful
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2">
            Matrimonial Biodata
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <Badge className="bg-white/20 hover:bg-white/30 text-white font-mono text-xs px-3 py-1 border-0">
              ID: {profileCode}
            </Badge>
            <Badge className="bg-emerald-500/80 hover:bg-emerald-500 text-white text-xs px-3 py-1 border-0 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Profile
            </Badge>
            {isPremium && (
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-3 py-1 border-0 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Premium Member
              </Badge>
            )}
          </div>
        </div>

        {/* Biodata Body */}
        <div className="p-5 sm:p-7 space-y-6">
          
          {/* Top Profile Summary Bar */}
          <div className="bg-muted/40 border border-border/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500/30 flex items-center justify-center text-3xl flex-shrink-0">
                {profile.gender === "Female" ? "👰" : "🤵"}
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h3 className="text-xl font-bold text-foreground">{profile.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {profile.gender === "Female" ? "Bride" : "Groom"}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {profile.maritalStatus} • {profile.age} Years • {profile.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 sm:flex-none"
                onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, "_blank")}
              >
                <MessageCircle className="w-4 h-4 mr-1.5" />
                Inquire on WhatsApp
              </Button>
            </div>
          </div>

          {/* Section 1: Personal & Physical Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-2 border-b border-border pb-1.5">
              <User className="w-4 h-4" /> Personal & Physical Details
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
              <div className="bg-card border rounded-lg p-3">
                <span className="text-xs text-muted-foreground block">Age</span>
                <span className="font-semibold text-foreground">{profile.age} Years</span>
              </div>
              <div className="bg-card border rounded-lg p-3">
                <span className="text-xs text-muted-foreground block">Date of Birth</span>
                <span className="font-semibold text-foreground">{profile.dob || "Available on request"}</span>
              </div>
              <div className="bg-card border rounded-lg p-3">
                <span className="text-xs text-muted-foreground block">Height</span>
                <span className="font-semibold text-foreground">{profile.height}</span>
              </div>
              <div className="bg-card border rounded-lg p-3">
                <span className="text-xs text-muted-foreground block">Complexion</span>
                <span className="font-semibold text-foreground">{profile.complexion}</span>
              </div>
              <div className="bg-card border rounded-lg p-3">
                <span className="text-xs text-muted-foreground block">Marital Status</span>
                <span className="font-semibold text-foreground">{profile.maritalStatus}</span>
              </div>
              <div className="bg-card border rounded-lg p-3">
                <span className="text-xs text-muted-foreground block">Location / Native</span>
                <span className="font-semibold text-foreground">{profile.location}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Education & Career */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-2 border-b border-border pb-1.5">
              <GraduationCap className="w-4 h-4" /> Education & Career
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div className="bg-card border rounded-lg p-3">
                <span className="text-xs text-muted-foreground block">Highest Qualification</span>
                <span className="font-semibold text-foreground">{profile.education}</span>
              </div>
              <div className="bg-card border rounded-lg p-3">
                <span className="text-xs text-muted-foreground block">Profession / Occupation</span>
                <span className="font-semibold text-foreground">{profile.profession}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Religious & Deeni Background */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-2 border-b border-border pb-1.5">
              <BookOpen className="w-4 h-4" /> Religious & Deeni Background
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
              <div className="bg-card border rounded-lg p-3">
                <span className="text-xs text-muted-foreground block">Maslak / Sect</span>
                <span className="font-semibold text-foreground">{profile.maslak || "Sunni Muslim"}</span>
              </div>
              <div className="bg-card border rounded-lg p-3">
                <span className="text-xs text-muted-foreground block">Caste / Community</span>
                <span className="font-semibold text-foreground">{profile.caste || "Muslim"}</span>
              </div>
              <div className="bg-card border rounded-lg p-3">
                <span className="text-xs text-muted-foreground block">Islamic Knowledge / Deen</span>
                <span className="font-semibold text-foreground">{profile.islamicKnowledge || "Practicing Muslim"}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Family Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-2 border-b border-border pb-1.5">
              <Users className="w-4 h-4" /> Family Background
            </h4>
            <div className="bg-card border rounded-lg p-4 text-sm">
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {profile.family || "Respected family background. Full details available upon verification."}
              </p>
            </div>
          </div>

          {/* Section 5: Partner Expectations */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-2 border-b border-border pb-1.5">
              <Heart className="w-4 h-4" /> Partner Preferences & Expectations
            </h4>
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 rounded-lg p-4 space-y-3 text-sm">
              <div>
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 block mb-1">
                  Requirements & Expectations:
                </span>
                <p className="text-foreground leading-relaxed">
                  {profile.preferredPartner}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-emerald-200/40 dark:border-emerald-800/30 text-xs">
                <Badge variant="outline" className="bg-background">
                  📍 Preferred Cities: {profile.preferredLocation}
                </Badge>
                <Badge variant="outline" className="bg-background">
                  🎂 Preferred Age: {profile.preferredAge} yrs
                </Badge>
              </div>
            </div>
          </div>

          {/* Islamic Verification Note */}
          <div className="bg-muted/50 border rounded-xl p-4 text-xs text-muted-foreground text-center space-y-1">
            <p className="font-medium text-foreground">
              🔒 100% Halal & Guardian (Wali) Supported Matchmaking
            </p>
            <p>
              Direct contact with the candidate's family / guardian is facilitated respectfully through Rishta Matrimony helpline.
            </p>
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t print:hidden">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print / Save PDF</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? "Copied!" : "Copy Details"}</span>
              </Button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none border-sky-300 text-sky-700 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40"
                onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin + '/profiles?id=' + profile.id)}&text=${encodeURIComponent(shareText)}`, '_blank')}
              >
                <Send className="w-4 h-4 mr-1.5" />
                Telegram
              </Button>
              <Button
                size="sm"
                className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, "_blank")}
              >
                <MessageCircle className="w-4 h-4 mr-1.5" />
                WhatsApp Match Inquiry
              </Button>
            </div>
          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}
