import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, 
  Check, 
  Phone, 
  Image as ImageIcon, 
  FileText, 
  Zap, 
  ShieldCheck, 
  MessageCircle, 
  ArrowRight,
  Sparkles,
  QrCode
} from "lucide-react";
import { DirectPaymentModal } from "@/components/payment/DirectPaymentModal";

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
  const [directPaymentOpen, setDirectPaymentOpen] = useState(false);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<"single" | "premium">("single");

  if (!profile) return null;

  const prefix = profile.gender === "Female" ? "RM-BR" : "RM-GR";
  const numPart = profile.order !== undefined && profile.order !== null ? profile.order : profile.id;
  const profileCode = `${prefix}-${numPart}`;

  const handleOpenDirectPayment = (plan: "single" | "premium" = "single") => {
    setSelectedPaymentPlan(plan);
    onClose();
    setDirectPaymentOpen(true);
  };

  const handleProceedToWhatsApp = () => {
    const text = `Assalamu Alaikum, I would like to unlock verified contact details and clear photos for Profile ID: #${profileCode} (${profile.name}) for Rs. 48. Kindly share the payment UPI / QR details. JazakAllahu Khair.`;
    window.open(`https://wa.me/919128719875?text=${encodeURIComponent(text)}`, "_blank");
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-2 border-emerald-500/30">
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
            <div className="bg-muted/40 border border-border/80 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px] font-bold border-primary/40 text-primary">
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

            {/* What will be delivered */}
            <div className="space-y-2 bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-3.5">
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-2">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>What will be delivered instantly:</span>
              </p>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Direct Guardian & Personal Phone / WhatsApp</span>
                    <p className="text-[11px] text-muted-foreground">Talk directly to the family with full trust & sincerity.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Clear Original Unblurred HD Photos</span>
                    <p className="text-[11px] text-muted-foreground">High-resolution verified photos delivered directly.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why ₹48 Anti-Spam Protection Filter */}
            <div className="bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3 text-[11px] leading-relaxed">
              <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-1 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Why is there a ₹48 Charge? (Anti-Spam Filter)</span>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                This small charge acts as a <strong className="text-foreground font-semibold">Security & Privacy Filter</strong> to stop non-serious visitors from misusing contact numbers & photos of honorable families.
              </p>
            </div>

            {/* Payment info note */}
            <div className="text-[11px] text-muted-foreground bg-muted/60 p-3 rounded-xl border leading-relaxed">
              <span className="font-semibold text-foreground">💳 Direct Payment:</span> Scan QR barcode on screen using Google Pay, PhonePe, Paytm or UPI.
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={() => handleOpenDirectPayment("single")}
                size="lg"
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md gap-2 transition-all cursor-pointer"
              >
                <QrCode className="w-5 h-5 text-amber-300" />
                <span>Pay Direct via Barcode / UPI (₹48)</span>
              </Button>

              <button
                onClick={handleProceedToWhatsApp}
                className="w-full py-2 text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Or Pay via WhatsApp Assistance</span>
              </button>
            </div>

            {/* Premium Alternative Link */}
            <div className="text-center pt-1 pb-1">
              <button
                onClick={() => handleOpenDirectPayment("premium")}
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

      <DirectPaymentModal
        isOpen={directPaymentOpen}
        onClose={() => setDirectPaymentOpen(false)}
        defaultPlan={selectedPaymentPlan}
        profileCode={profileCode}
        profileName={profile.name}
      />
    </>
  );
};
