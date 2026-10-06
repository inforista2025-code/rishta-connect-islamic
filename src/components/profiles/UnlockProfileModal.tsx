import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  MessageCircle, 
  ArrowRight,
  Sparkles,
  Send,
  CheckCircle2
} from "lucide-react";

interface UnlockProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    id: number | string;
    name: string;
    gender?: string;
    age?: string;
    location?: string;
    order?: number;
  } | null;
}

export const UnlockProfileModal: React.FC<UnlockProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  if (!profile) return null;

  const prefix = profile.gender === "Female" ? "RM-BR" : "RM-GR";
  const numPart = profile.order !== undefined && profile.order !== null ? profile.order : profile.id;
  const profileCode = `${prefix}-${numPart}`;

  const handleProceedToWhatsApp = () => {
    const text = `Assalamu Alaikum, I would like to unlock verified contact details and clear photos for Profile ID: #${profileCode} (${profile.name}) for Rs. 48. Kindly share the payment UPI / QR details. JazakAllahu Khair.`;
    window.open(`https://wa.me/919128719875?text=${encodeURIComponent(text)}`, "_blank");
    onClose();
  };

  const handleProceedToPremium = () => {
    const text = `Assalamu Alaikum, I am inquiring about Profile ID: #${profileCode} (${profile.name}) and would like to upgrade to the Premium Rishta Plan (Rs. 491 for 2 Months) for unlimited profile access. Kindly share payment details. JazakAllahu Khair.`;
    window.open(`https://wa.me/919128719875?text=${encodeURIComponent(text)}`, "_blank");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0 rounded-3xl border border-emerald-500/30 shadow-2xl">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white p-5 text-center relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white mb-2 shadow-xs backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Islamic Privacy Protected</span>
          </div>
          <DialogTitle className="text-xl font-extrabold tracking-tight text-white">
            Unlock Contact & Photos
          </DialogTitle>
          <DialogDescription className="text-xs text-emerald-100 mt-1 max-w-xs mx-auto">
            Get direct family contact details and unblurred HD photos of this proposal.
          </DialogDescription>
        </div>

        <div className="p-5 space-y-4">
          {/* Target Profile Card Summary */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-[10px] font-bold border-emerald-500/50 text-emerald-700 dark:text-emerald-300 bg-white/60 dark:bg-emerald-900/50">
                  ID: #{profileCode}
                </Badge>
                {profile.gender && (
                  <Badge variant="secondary" className="text-[10px] font-medium">
                    {profile.gender === "Female" ? "Bride" : "Groom"}
                  </Badge>
                )}
              </div>
              <h4 className="font-extrabold text-base text-foreground truncate">
                {profile.name}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {profile.age ? `${profile.age} yrs` : ""} {profile.location ? `• ${profile.location}` : ""}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-semibold text-muted-foreground block">Single Unlock</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹48</span>
            </div>
          </div>

          {/* Point-wise Clean Information Box */}
          <div className="border border-border/80 rounded-2xl p-4 bg-muted/20 space-y-4">
            {/* What will be delivered */}
            <div>
              <h5 className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>What Will Be Delivered:</span>
              </h5>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span><strong className="text-foreground font-semibold">Direct Guardian & Personal Contact:</strong> Phone & WhatsApp details to connect directly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span><strong className="text-foreground font-semibold">Original HD Photos:</strong> Clear, unblurred high-resolution photos sent to WhatsApp.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span><strong className="text-foreground font-semibold">Complete Verified Biodata:</strong> Family background, education & Deeni details.</span>
                </li>
              </ul>
            </div>

            <hr className="border-border/60" />

            {/* How it works - Point wise 1, 2, 3 */}
            <div>
              <h5 className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-2.5">
                <Send className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>How It Works (Unlock Process):</span>
              </h5>
              <ol className="space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    1
                  </span>
                  <div>
                    <strong className="text-foreground font-semibold">Profile Registration:</strong> Pehle aapko apna profile register karna hoga.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    2
                  </span>
                  <div>
                    <strong className="text-foreground font-semibold">ID Verification:</strong> Profile & ID verification process complete hone ke baad.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    3
                  </span>
                  <div>
                    <strong className="text-foreground font-semibold">₹48 Payment & Delivery:</strong> ₹48 payment karne ke baad aapko profile send ki jayegi.
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* Anti-Spam Protection Note */}
          <p className="text-[11px] text-muted-foreground text-center px-2">
            🛡️ <span className="font-semibold text-foreground">Anti-Spam Filter:</span> Small ₹48 charge protects family privacy and ensures genuine inquiries.
          </p>

          {/* Primary Action Button: WhatsApp Prefilled */}
          <Button
            onClick={handleProceedToWhatsApp}
            size="lg"
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md gap-2 transition-all cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white/20" />
            <span>Proceed to Unlock on WhatsApp (₹48)</span>
          </Button>

          {/* Premium Alternative Link */}
          <div className="text-center pt-1 pb-1">
            <button
              onClick={handleProceedToPremium}
              className="text-xs text-primary hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Want unlimited profiles? Upgrade to Premium (₹491)</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
