import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  ShieldCheck,
  Check,
  Lock,
  Copy,
  Zap,
  MessageCircle,
  Clock,
  AlertTriangle,
  XCircle,
  UserPlus,
  LogIn,
  ArrowRight,
  Phone,
  Sparkles,
  QrCode,
  Smartphone,
  Info
} from "lucide-react";

export interface TargetProfileInfo {
  id: string | number;
  code?: string;
  name: string;
  age?: string | number;
  location?: string;
  gender?: string;
  photoUrl?: string;
}

export interface UnlockPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purpose: "single_profile" | "premium_plan";
  targetProfile?: TargetProfileInfo | null;
}

type ModalStep =
  | "ask_registration"
  | "enter_phone"
  | "pending_notice"
  | "rejected_notice"
  | "not_found_notice"
  | "payment";

const UPI_ID = "8789428096@upi";
const UPI_PAYEE_NAME = "Rishta Matrimony";
const ADMIN_WHATSAPP = "919128719875";

export function UnlockPaymentModal({
  open,
  onOpenChange,
  purpose,
  targetProfile,
}: UnlockPaymentModalProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { member, loading: authLoading } = useMemberAuth();

  const [step, setStep] = useState<ModalStep>("ask_registration");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState<{
    id?: string | number;
    full_name: string;
    registration_id?: string | null;
    whatsapp_number?: string | null;
    plan_type?: string;
  } | null>(null);

  const amount = purpose === "single_profile" ? 48 : 491;
  const targetCode = targetProfile?.code || (targetProfile?.id ? `RM-BR-${targetProfile.id}` : "");

  // Determine initial step when modal opens
  useEffect(() => {
    if (!open) {
      setStep("ask_registration");
      setPhoneNumber("");
      setIsVerifying(false);
      return;
    }

    if (member) {
      // User is already logged in
      setVerifiedUser({
        id: member.id,
        full_name: member.full_name,
        registration_id: (member as any).registration_id || "RM-Member",
        whatsapp_number: member.whatsapp_number,
        plan_type: member.plan_type,
      });
      setStep("payment");
    } else {
      setStep("ask_registration");
    }
  }, [open, member]);

  // Handle phone verification query against Supabase profiles_data
  const handleVerifyPhone = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanDigits = phoneNumber.replace(/\D/g, "");
    if (cleanDigits.length < 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit registered mobile/WhatsApp number.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const last10 = cleanDigits.slice(-10);

      const { data, error } = await supabase
        .from("profiles_data")
        .select("id, full_name, registration_id, whatsapp_number, verification_status, plan_type")
        .ilike("whatsapp_number", `%${last10}%`)
        .limit(1);

      if (error) {
        console.error("Verification query error:", error);
        toast({
          title: "Verification Error",
          description: "Could not connect to verification server. Please try again or message admin.",
          variant: "destructive",
        });
        return;
      }

      if (!data || data.length === 0) {
        setStep("not_found_notice");
        return;
      }

      const profile = data[0];
      const status = (profile.verification_status || "").toLowerCase();

      if (status === "verified" || status === "approved") {
        setVerifiedUser({
          id: profile.id,
          full_name: profile.full_name,
          registration_id: profile.registration_id || `RM-BR-${profile.id}`,
          whatsapp_number: profile.whatsapp_number,
          plan_type: profile.plan_type,
        });
        toast({
          title: "✅ Member Verified",
          description: `Assalamu Alaikum, ${profile.full_name}!`,
        });
        setStep("payment");
      } else if (status === "pending") {
        setVerifiedUser({
          id: profile.id,
          full_name: profile.full_name,
          registration_id: profile.registration_id || `RM-BR-${profile.id}`,
          whatsapp_number: profile.whatsapp_number,
        });
        setStep("pending_notice");
      } else if (status === "rejected") {
        setStep("rejected_notice");
      } else {
        // Default treat unverified as pending
        setStep("pending_notice");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred during verification.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    toast({
      title: "✅ UPI ID Copied!",
      description: `${UPI_ID} copied to clipboard. Open GPay/PhonePe to pay.`,
    });
  };

  const transactionNote =
    purpose === "single_profile"
      ? `Unlock Profile #${targetCode} (${targetProfile?.name || ""})`
      : `Premium Rishta Plan (${verifiedUser?.full_name || "Member"})`;

  // NPCI Standard UPI Link format
  const upiLink = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
    UPI_PAYEE_NAME
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

  // Construct structured WhatsApp confirmation message
  const handleWhatsAppConfirm = () => {
    let text = "";
    const memberName = verifiedUser?.full_name || "Registered Member";
    const memberId = verifiedUser?.registration_id || "Registered User";
    const memberMobile = verifiedUser?.whatsapp_number || phoneNumber || "Registered Mobile";

    if (purpose === "single_profile") {
      text = `Assalamu Alaikum Team Rishta Matrimony,

I have completed the payment of ₹48 to unlock:
🎯 Target Profile: #${targetCode} (${targetProfile?.name || "Candidate"})

👤 My Registered Member Details:
• Name: ${memberName}
• Profile ID: #${memberId}
• Mobile: ${memberMobile}

📸 Payment Proof: Attached screenshot / UTR.
Kindly verify and send the contact details and clear HD photos. JazakAllahu Khair.`;
    } else {
      text = `Assalamu Alaikum Team Rishta Matrimony,

I have completed the payment of ₹491 for the 2-Month Premium Rishta Plan.

👤 My Registered Member Details:
• Name: ${memberName}
• Profile ID: #${memberId}
• Mobile: ${memberMobile}

📸 Payment Proof: Attached screenshot / UTR.
Kindly activate my ⭐ Premium Gold Badge and 1st Page Priority. JazakAllahu Khair.`;
    }

    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0 rounded-3xl gap-0 border shadow-2xl">
        
        {/* Step 1: Ask Registration */}
        {step === "ask_registration" && (
          <div className="p-6 space-y-5">
            <DialogHeader className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Matrimonial Verification Check
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                To protect family privacy and ensure authentic matchmaking under Islamic guidelines, only registered members can proceed.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-muted/40 rounded-2xl p-4 border border-border/70 space-y-2">
              <p className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>
                  {purpose === "single_profile"
                    ? `Unlocking #${targetCode} (${targetProfile?.name || "Profile"}) • ₹48`
                    : "Upgrading to Premium Rishta Plan • ₹491"}
                </span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                Are you already registered on Rishta Matrimony?
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <Button
                onClick={() => setStep("enter_phone")}
                className="w-full h-12 font-bold text-sm rounded-xl gap-2 shadow-md bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Yes, I am already registered</span>
              </Button>

              <Button
                onClick={() => {
                  onOpenChange(false);
                  navigate("/register");
                }}
                variant="outline"
                className="w-full h-12 font-semibold text-xs sm:text-sm rounded-xl gap-2 border-primary/40 text-primary hover:bg-primary/10 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>No, I am new (Register Free in 2 mins)</span>
              </Button>
            </div>

            <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              <span>100% Free Registration • Strict Privacy Protection</span>
            </p>
          </div>
        )}

        {/* Step 2: Enter Phone Number */}
        {step === "enter_phone" && (
          <div className="p-6 space-y-5">
            <DialogHeader className="text-center space-y-1">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <Phone className="w-6 h-6" />
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Enter Registered Mobile Number
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Enter the WhatsApp or Mobile number used during your profile registration.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleVerifyPhone} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-semibold">
                  Registered WhatsApp / Mobile Number *
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g., 9876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-12 pl-10 text-sm font-medium rounded-xl"
                    autoFocus
                  />
                  <Phone className="w-4 h-4 text-muted-foreground absolute left-3.5 top-4" />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  type="submit"
                  disabled={isVerifying || phoneNumber.trim().length < 7}
                  className="w-full h-12 font-bold text-sm rounded-xl gap-2 shadow-md bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying with Database...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep("ask_registration")}
                  className="w-full h-10 text-xs text-muted-foreground hover:text-foreground rounded-xl"
                >
                  Back
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Pending Verification Notice */}
        {step === "pending_notice" && (
          <div className="p-6 space-y-5 text-center">
            <div className="w-14 h-14 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30">
                ⏳ Profile Pending Verification
              </Badge>
              <h3 className="text-lg font-bold text-foreground">
                Your Profile is Under Review
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Assalamu Alaikum <strong>{verifiedUser?.full_name}</strong>! Your profile registration has been received and is currently being verified by our admin team.
              </p>
            </div>

            <div className="bg-muted/40 rounded-2xl p-3.5 text-[11px] text-muted-foreground text-left space-y-1.5 border">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-primary" />
                <span>Verification Policy:</span>
              </p>
              <p>
                Profiles are usually approved within <strong>12 to 24 hours</strong>. Once your profile is marked <strong>Verified</strong>, you can unlock contacts and upgrade to Premium.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                onClick={() => {
                  const text = `Assalamu Alaikum Team Rishta Matrimony, I have registered my profile (${verifiedUser?.full_name}, Mobile: ${phoneNumber}). Kindly expedite my profile verification so I can unlock contacts. JazakAllahu Khair.`;
                  window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
                }}
                className="w-full h-12 font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Admin on WhatsApp</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full h-10 text-xs rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Rejected / Needs Update Notice */}
        {step === "rejected_notice" && (
          <div className="p-6 space-y-5 text-center">
            <div className="w-14 h-14 bg-rose-500/10 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <XCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <Badge variant="outline" className="bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30">
                ❌ Profile Needs Update
              </Badge>
              <h3 className="text-lg font-bold text-foreground">
                Profile Correction Required
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your profile registration requires correction or updated information before you can proceed with matchmaking payments.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                onClick={() => {
                  onOpenChange(false);
                  navigate("/member-login");
                }}
                className="w-full h-12 font-bold text-sm rounded-xl gap-2 bg-primary text-primary-foreground"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In & Update Biodata</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full h-10 text-xs rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Mobile Number Not Found Notice */}
        {step === "not_found_notice" && (
          <div className="p-6 space-y-5 text-center">
            <div className="w-14 h-14 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-foreground">
                No Registered Profile Found
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We couldn't find a registered profile for <strong>{phoneNumber}</strong>. Please create your free profile first to ensure authentic, verified matrimonial connections.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                onClick={() => {
                  onOpenChange(false);
                  navigate("/register");
                }}
                className="w-full h-12 font-bold text-sm rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Free Profile Now (2 mins)</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => setStep("enter_phone")}
                className="w-full h-10 text-xs text-muted-foreground rounded-xl"
              >
                Try Another Mobile Number
              </Button>
            </div>
          </div>
        )}

        {/* Step 6: Verified Member Payment Screen */}
        {step === "payment" && (
          <div className="p-6 space-y-5">
            
            {/* Header with verified member banner */}
            <div className="bg-gradient-to-r from-emerald-500/10 via-primary/10 to-emerald-500/10 rounded-2xl p-3.5 border border-emerald-500/20 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Verified Member</span>
                </p>
                <p className="text-xs font-bold text-foreground truncate">
                  {verifiedUser?.full_name} ({verifiedUser?.registration_id || "RM-Member"})
                </p>
              </div>
              <Badge className="bg-emerald-600 text-white shrink-0 text-[10px] px-2 py-0.5 font-bold">
                ₹{amount} Total
              </Badge>
            </div>

            {/* Plan Info Card */}
            <div className="bg-muted/40 rounded-2xl p-4 border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  {purpose === "single_profile"
                    ? `🎯 Unlock Profile #${targetCode}`
                    : "⭐ 2-Month Premium Rishta Plan"}
                </span>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                  ₹{amount}
                </span>
              </div>
              
              <ul className="text-[11px] text-muted-foreground space-y-1 pt-1">
                {purpose === "single_profile" ? (
                  <>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>Direct Guardian & Personal WhatsApp/Phone</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>Clear Original Unblurred HD Photos</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>Complete Verified Family & Religious Biodata</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>⭐ Verified Premium Gold Badge on Your Profile</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>📌 Pinned Top Priority Listing on Page 1</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>📞 Unlimited Access to All Contacts & Photos</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* QR Code & Direct UPI Deep Link */}
            <div className="text-center space-y-3 pt-1">
              <div className="inline-block p-3.5 bg-white rounded-2xl shadow-md border-2 border-emerald-500/30">
                <QRCodeSVG
                  value={upiLink}
                  size={160}
                  level="M"
                  includeMargin={false}
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-foreground flex items-center justify-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-primary" />
                  <span>Scan with Any UPI App (GPay / PhonePe / Paytm / BHIM)</span>
                </p>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className="font-mono bg-muted px-2 py-0.5 rounded text-[11px]">
                    {UPI_ID}
                  </span>
                  <button
                    onClick={copyUpiId}
                    type="button"
                    className="text-primary hover:underline font-semibold text-[11px] flex items-center gap-0.5 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              {/* Mobile Direct Pay Button */}
              <Button
                asChild
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl gap-2 shadow-md cursor-pointer"
              >
                <a href={upiLink}>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Pay ₹{amount} via UPI App (Instant)</span>
                </a>
              </Button>

              {/* WhatsApp Confirmation Button */}
              <Button
                onClick={handleWhatsAppConfirm}
                className="w-full h-12 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm rounded-xl gap-2 shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>I Have Paid — Send Proof on WhatsApp</span>
              </Button>
            </div>

            <p className="text-[10px] text-center text-muted-foreground">
              ⚡ Details / Premium Badge will be activated within 10-15 minutes of payment confirmation.
            </p>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
