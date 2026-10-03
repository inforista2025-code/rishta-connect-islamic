import React from "react";
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
  Crown, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  MessageCircle, 
  Phone, 
  Star,
  Users
} from "lucide-react";

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const handleProceedToWhatsApp = () => {
    const text = "Assalamu Alaikum Team Rishta Matrimony, I would like to upgrade to the Premium Rishta Plan (Rs. 491 for 2 Months) for unlimited profile access & Premium Badge. Kindly share payment UPI / QR details. JazakAllahu Khair.";
    window.open(`https://wa.me/919128719875?text=${encodeURIComponent(text)}`, "_blank");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-2 border-primary/40">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground p-5 text-center relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white mb-2 shadow-xs backdrop-blur-xs">
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>Exclusive Matrimonial Access</span>
          </div>
          <DialogTitle className="text-xl font-extrabold tracking-tight text-white">
            Upgrade to Premium Rishta Plan
          </DialogTitle>
          <DialogDescription className="text-xs text-primary-foreground/80 mt-1 max-w-xs mx-auto">
            Get 2 months of unlimited profile views, direct family contacts & priority matching.
          </DialogDescription>
        </div>

        <div className="p-5 space-y-4">
          {/* Price & Plan Highlight Card */}
          <div className="bg-gradient-to-br from-primary/10 via-card to-card border-2 border-primary/30 rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Full Membership</span>
              <h4 className="text-lg font-black text-foreground">2 Months Full Access</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Includes all future proposal listings</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl sm:text-3xl font-black text-primary">₹491</span>
              <span className="text-[10px] text-muted-foreground block">/ 2 Months</span>
            </div>
          </div>

          {/* Premium Benefits List */}
          <div className="space-y-2 bg-muted/40 rounded-2xl p-3.5 border border-border/80 text-xs">
            <p className="font-bold text-foreground flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Premium Membership Benefits:</span>
            </p>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <span className="font-semibold text-foreground">Unlimited Direct Contacts & WhatsApp Numbers</span>
                  <p className="text-[11px] text-muted-foreground">Unlock contacts for all brides/grooms across India & Abroad.</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <span className="font-semibold text-foreground">Unblurred High-Resolution Photos</span>
                  <p className="text-[11px] text-muted-foreground">View full clarity photos of all profiles without restriction.</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <span className="font-semibold text-foreground">⭐ Premium Gold Badge & 1st Page Priority</span>
                  <p className="text-[11px] text-muted-foreground">Your registered profile is pinned on Page 1 for 5x faster responses.</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <span className="font-semibold text-foreground">1-on-1 Matchmaking Assistance</span>
                  <p className="text-[11px] text-muted-foreground">Direct priority support from our team on WhatsApp.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Family Contact & Conduct Rules Notice */}
          <div className="space-y-2 bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 rounded-2xl p-3.5 text-xs">
            <p className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-1 text-[12px]">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Direct Family Contact & Conduct Rules</span>
            </p>
            <div className="space-y-1.5 text-[11px] leading-relaxed text-foreground/90">
              <p>
                <strong className="text-foreground font-semibold">1. Direct Communication:</strong> Platform provides verified contacts. Families initiate direct contact independently with adab & sincerity.
              </p>
              <p>
                <strong className="text-foreground font-semibold">2. Respectful Conduct:</strong> Forced messaging, harassment, repeated calls, or pushing for urgent replies is strictly forbidden.
              </p>
              <p>
                <strong className="text-foreground font-semibold">3. Graceful Refusal:</strong> If not a match, decline politely (e.g. <em>"JazakAllahu Khair, not a match"</em>).
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-amber-500/20 text-[10px] font-bold text-red-600 dark:text-red-400">
              ⚠️ Penalty Notice: Misconduct or harassment results in immediate permanent account ban.
            </div>
          </div>

          {/* Instructions Note */}
          <div className="text-[11px] text-muted-foreground bg-muted/60 p-3 rounded-xl border leading-relaxed">
            <span className="font-semibold text-foreground">💡 How to upgrade:</span> Click below to open WhatsApp. Complete your ₹491 payment via UPI (Google Pay, PhonePe, Paytm, or QR Code). If you have a registered profile, our team will activate your Premium badge and 1st page priority within minutes.
          </div>

          {/* Primary CTA Button */}
          <Button
            onClick={handleProceedToWhatsApp}
            size="lg"
            className="w-full h-12 text-primary-foreground font-bold text-sm rounded-xl shadow-md gap-2 transition-all cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white/20" />
            <span>Proceed to Upgrade on WhatsApp (₹491)</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
