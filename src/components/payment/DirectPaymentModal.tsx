import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Crown,
  Copy,
  ShieldCheck,
  Zap,
  Smartphone,
  MessageCircle,
  QrCode,
} from "lucide-react";

interface DirectPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: "single" | "premium";
  hidePlanSwitcher?: boolean;
  profileCode?: string;
  profileName?: string;
  memberPhone?: string;
  targetProfileId?: number;
}

export const DirectPaymentModal: React.FC<DirectPaymentModalProps> = ({
  isOpen,
  onClose,
  defaultPlan = "premium",
  hidePlanSwitcher = false,
  profileCode: initialProfileCode = "",
  profileName: initialProfileName = "",
  memberPhone = "",
  targetProfileId,
}) => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<"single" | "premium">(defaultPlan);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [targetProfileInput, setTargetProfileInput] = useState(initialProfileCode || initialProfileName || "");

  useEffect(() => {
    setSelectedPlan(defaultPlan);
    setTargetProfileInput(initialProfileCode || initialProfileName || "");
  }, [defaultPlan, initialProfileCode, initialProfileName, isOpen]);

  const upiId = "8789428096@upi";
  const payeeName = "Rishta Matrimony";

  const amount = selectedPlan === "premium" ? 491 : 48;
  const planTitle = selectedPlan === "premium" ? "Premium Rishta Plan (2 Months)" : "Single Profile Unlock";

  const targetCodeOrName = targetProfileInput.trim() || initialProfileCode || initialProfileName || "Selected Profile";

  const tnText = selectedPlan === "premium"
    ? "Premium Membership Upgrade"
    : `Single Unlock Profile ${targetCodeOrName}`;

  const genericUpiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(tnText)}`;
  const phonepeUrl = `phonepe://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(tnText)}`;
  const paytmUrl = `paytmmp://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(tnText)}`;
  const gpayUrl = `tez://upi/pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(tnText)}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    genericUpiUrl
  )}&margin=10`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    toast({
      title: "✅ UPI ID Copied!",
      description: `${upiId} copied to clipboard. Open any UPI app to pay.`,
    });
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleAppLaunch = (appSchemeUrl: string) => {
    const start = Date.now();
    window.location.href = appSchemeUrl;
    setTimeout(() => {
      if (Date.now() - start < 1500) {
        window.location.href = genericUpiUrl;
      }
    }, 800);
  };

  const handleNotifyWhatsApp = async () => {
    const isSingle = selectedPlan === "single";
    const fieldName = isSingle ? `SINGLE_PROFILE_UNLOCK_₹48` : `PREMIUM_UPGRADE_₹491`;
    const reqVal = isSingle
      ? `₹48 Payment for Target Profile: [${targetCodeOrName}] (Paid via Barcode)`
      : `₹491 Premium Plan Payment (Paid via Barcode)`;

    // Resolve target profile id if single unlock
    let resolvedTargetId = targetProfileId;
    if (!resolvedTargetId && isSingle) {
      const match = targetCodeOrName.match(/(\d+)/);
      if (match) {
        resolvedTargetId = parseInt(match[1]);
      }
    }

    // Log request into Database for Admin Panel in background
    try {
      const memberToken = typeof window !== "undefined" ? localStorage.getItem("member_session_token") : null;
      if (memberToken) {
        await supabase.functions.invoke("member-dashboard", {
          body: {
            session_token: memberToken,
            action: "submit_payment_request",
            plan: selectedPlan,
            target_id: resolvedTargetId || undefined,
            note: `Paid via Barcode QR (${upiId}) for ${targetCodeOrName}`,
          },
        });
      } else {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          const { data: prof } = await supabase
            .from("profiles_data")
            .select("id")
            .eq("email", userData.user.email)
            .maybeSingle();

          if (prof) {
            await supabase.from("profile_update_requests").insert({
              profile_id: prof.id,
              request_type: isSingle ? "single_unlock" : "premium_upgrade",
              target_profile_id: resolvedTargetId || null,
              amount: isSingle ? 48 : 491,
              field_name: fieldName,
              current_value: isSingle ? targetCodeOrName : "Free Plan",
              requested_value: reqVal,
              reason: `Paid via Barcode QR (${upiId})`,
              status: "pending",
            });
          }
        }
      }
    } catch (e) {
      console.error("Background request log error:", e);
    }

    // WhatsApp Message
    const msg = isSingle
      ? `Assalamu Alaikum Admin Team 🌸,\n\nMaine Rs. 48 ka payment single profile unlock ke liye complete kar diya hai.\n\n📋 Request Details:\n• My Name / Member: ${initialProfileName || "Registered Member"}\n• Target Profile ID / Name: ${targetCodeOrName}\n${memberPhone ? `• Registered Mobile: ${memberPhone}\n` : ""}• Payment Plan: Single Profile Unlock (Rs. 48)\n• Mode: Paid via Barcode / UPI\n\nPlease verify karke is profile ki verified contact details & photos WhatsApp par send kar dein.\nJazakAllahu Khair 🤍`
      : `Assalamu Alaikum Admin Team 🌸,\n\nMaine Rs. 491 ka payment complete kar diya hai. Please meri profile ko Premium Profile me convert kar dein.\n\n📋 Member Details:\n• Name: ${initialProfileName || "Registered Member"}\n• Profile ID: ${initialProfileCode || "Registered Profile"}\n${memberPhone ? `• Registered Mobile: ${memberPhone}\n` : ""}• Payment Plan: Premium Rishta Plan (Rs. 491 - 2 Months Access)\n• Mode: Paid via Barcode / UPI\n\nPlease verify karke meri profile ko Premium bana dein aur details confirm karein.\nJazakAllahu Khair 🤍`;

    window.open(`https://wa.me/919128719875?text=${encodeURIComponent(msg)}`, "_blank");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-[95vw] sm:w-[90vw] max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-2 border-emerald-500/40 z-[110]">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-emerald-700 via-primary to-teal-800 text-white p-5 text-center relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white mb-2 shadow-xs backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Direct UPI Payment (Zero Extra Fees)</span>
          </div>
          <DialogTitle className="text-xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            <span>Direct Payment Barcode</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-emerald-100 mt-1 max-w-xs mx-auto">
            Scan barcode using Google Pay, PhonePe, Paytm or any UPI app.
          </DialogDescription>
        </div>

        <div className="p-5 space-y-4">
          {/* Plan Selector / Summary Card */}
          {!hidePlanSwitcher ? (
            <div className="grid grid-cols-2 gap-2 bg-muted p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setSelectedPlan("single")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPlan === "single"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Single Unlock (₹48)
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlan("premium")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPlan === "premium"
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Premium 2-Mo (₹491)
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/40 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  {selectedPlan === "premium" ? (
                    <Crown className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Zap className="w-4 h-4 text-emerald-600" />
                  )}
                  <span className="text-xs font-bold text-foreground">
                    {planTitle}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {selectedPlan === "premium"
                    ? "Unlimited profiles, direct contacts & 1st page feature"
                    : `Unlock verified contact number & photos for ${targetCodeOrName}`}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  ₹{amount}
                </span>
              </div>
            </div>
          )}

          {/* Target Profile Code Input (If single profile and no pre-filled code) */}
          {selectedPlan === "single" && !initialProfileCode && (
            <div className="space-y-1">
              <Label className="text-xs font-bold text-foreground">
                Target Profile ID / Name for ₹48 Unlock
              </Label>
              <Input
                type="text"
                placeholder="e.g. RM-BR-13 or Kamran Ansari"
                value={targetProfileInput}
                onChange={(e) => setTargetProfileInput(e.target.value)}
                className="text-xs h-9 bg-background rounded-lg"
              />
            </div>
          )}

          {/* Direct QR Code + Mobile UPI Apps */}
          <div className="space-y-4">
            {/* Barcode Scanner Display */}
            <div className="bg-card border-2 border-dashed border-emerald-500/40 rounded-2xl p-4 text-center space-y-3 shadow-xs">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-foreground">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Scan QR Code to Pay ₹{amount}</span>
              </div>

              {/* QR Barcode Image */}
              <div className="relative inline-block bg-white p-3 rounded-2xl border shadow-md">
                <img
                  src={qrImageUrl}
                  alt={`UPI Payment QR Code for ₹${amount}`}
                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain mx-auto rounded-lg"
                />
                <div className="mt-2 pt-2 border-t text-[11px] font-bold text-emerald-800 flex items-center justify-center gap-1">
                  <span>Pay Exact Amount:</span>
                  <span className="text-base font-black text-emerald-700">₹{amount}</span>
                </div>
              </div>

              {/* Copy UPI ID Box */}
              <div className="bg-muted/70 rounded-xl p-2.5 border flex items-center justify-between gap-2 max-w-sm mx-auto">
                <div className="text-left min-w-0">
                  <span className="text-[10px] text-muted-foreground font-semibold block">Official UPI ID:</span>
                  <span className="text-xs font-mono font-bold text-foreground truncate block">{upiId}</span>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyUpi}
                  className="h-8 text-xs font-bold gap-1 rounded-lg shrink-0 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedUpi ? "Copied!" : "Copy ID"}</span>
                </Button>
              </div>
            </div>

            {/* Direct Mobile Apps Launcher with App-Specific Deep Links */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-muted-foreground text-center uppercase tracking-wider">
                Or Tap Below to Pay via Installed App (Mobile Only)
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleAppLaunch(phonepeUrl)}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-purple-200 dark:border-purple-800/40 bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors shadow-xs group text-center cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-purple-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-extrabold text-purple-950 dark:text-purple-300">PhonePe</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAppLaunch(paytmUrl)}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-sky-200 dark:border-sky-800/40 bg-sky-50/50 dark:bg-sky-950/20 hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors shadow-xs group text-center cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-sky-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-extrabold text-sky-950 dark:text-sky-300">Paytm</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAppLaunch(genericUpiUrl)}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors shadow-xs group text-center cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-extrabold text-emerald-950 dark:text-emerald-300">GPay / Any App</span>
                </button>
              </div>
            </div>

            {/* Direct WhatsApp Action Button */}
            <div className="space-y-2.5 pt-1">
              <Button
                onClick={handleNotifyWhatsApp}
                size="lg"
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white/20" />
                <span>Send Payment Receipt to Admin on WhatsApp</span>
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% Verified & Secure Payment Confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
