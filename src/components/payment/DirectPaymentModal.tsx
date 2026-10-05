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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Crown,
  Check,
  Copy,
  ShieldCheck,
  Zap,
  Smartphone,
  MessageCircle,
  QrCode,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface DirectPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: "single" | "premium";
  profileCode?: string;
  profileName?: string;
}

export const DirectPaymentModal: React.FC<DirectPaymentModalProps> = ({
  isOpen,
  onClose,
  defaultPlan = "premium",
  profileCode,
  profileName,
}) => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<"single" | "premium">(defaultPlan);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const upiId = "9128719875@ybl";
  const payeeName = "Rishta Matrimony";

  const amount = selectedPlan === "premium" ? 491 : 48;
  const planTitle = selectedPlan === "premium" ? "Premium Rishta Plan (2 Months)" : "Single Profile Unlock";

  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(
    selectedPlan === "premium"
      ? "Premium Membership Plan"
      : `Single Unlock Profile ${profileCode || ""}`
  )}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    upiUrl
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

  const handleSubmitUtr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || utrNumber.trim().length < 6) {
      toast({
        title: "⚠️ Invalid Transaction ID",
        description: "Please enter a valid 12-digit UTR or Transaction Ref Number.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "🎉 Payment Submitted Successfully!",
        description: "Admin team will verify your UTR and activate your profile within 5-10 minutes.",
      });
    }, 1000);
  };

  const handleNotifyWhatsApp = () => {
    const msg = selectedPlan === "premium"
      ? `Assalamu Alaikum Admin, I have paid Rs. 491 for Premium Rishta Plan. UTR / Ref No: ${utrNumber || "Paid via QR"}. Please verify and activate my profile.`
      : `Assalamu Alaikum Admin, I have paid Rs. 48 for Single Profile Unlock (${profileCode || ""} ${profileName || ""}). UTR / Ref No: ${utrNumber || "Paid via QR"}. Please verify and send details.`;
    window.open(`https://wa.me/919128719875?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleResetModal = () => {
    setIsSubmitted(false);
    setUtrNumber("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleResetModal}>
      <DialogContent className="max-w-lg w-[95vw] sm:w-[90vw] max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-2 border-emerald-500/40 z-[110]">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-emerald-700 via-primary to-teal-800 text-white p-5 text-center relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white mb-2 backdrop-blur-xs shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Instant & Direct Payment Checkout</span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Direct UPI Scan & Pay
          </DialogTitle>
          <DialogDescription className="text-xs text-emerald-100 mt-1 max-w-xs mx-auto">
            Scan barcode or click UPI app button to pay directly. No WhatsApp delay required!
          </DialogDescription>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Plan Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-muted/60 p-1.5 rounded-2xl border">
            <button
              type="button"
              onClick={() => { setSelectedPlan("single"); setIsSubmitted(false); }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                selectedPlan === "single"
                  ? "bg-emerald-600 text-white shadow-md scale-[1.02]"
                  : "text-muted-foreground hover:bg-background/80"
              }`}
            >
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                Single Profile
              </span>
              <span className="text-sm font-black">₹48</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedPlan("premium"); setIsSubmitted(false); }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                selectedPlan === "premium"
                  ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                  : "text-muted-foreground hover:bg-background/80"
              }`}
            >
              <span className="flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                Full Premium (2 Mo)
              </span>
              <span className="text-sm font-black">₹491</span>
            </button>
          </div>

          {/* Selected Plan Summary Card */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
            selectedPlan === "premium"
              ? "bg-gradient-to-r from-primary/10 via-amber-500/5 to-card border-primary/30"
              : "bg-emerald-500/10 border-emerald-500/30"
          }`}>
            <div>
              <Badge className={`text-[10px] font-extrabold mb-1 ${
                selectedPlan === "premium" ? "bg-primary text-primary-foreground" : "bg-emerald-600 text-white"
              }`}>
                {selectedPlan === "premium" ? "⭐ BEST VALUE PLAN" : "🎯 SINGLE UNLOCK"}
              </Badge>
              <h4 className="font-extrabold text-sm sm:text-base text-foreground">
                {planTitle}
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {selectedPlan === "premium"
                  ? "Unlimited profiles + HD photos + 1st page priority"
                  : profileCode ? `Unlock contact for Profile ID: #${profileCode}` : "Unlock contact & HD photos for 1 selected profile"}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl sm:text-3xl font-black text-foreground">₹{amount}</span>
            </div>
          </div>

          {isSubmitted ? (
            /* Success confirmation screen */
            <div className="bg-emerald-500/10 border-2 border-emerald-500/40 rounded-2xl p-5 text-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Payment Receipt Received!</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto leading-relaxed">
                  Thank you! Your UTR Number <strong className="text-foreground">{utrNumber}</strong> has been logged. Our admin team will verify and activate your profile within 5-10 minutes.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <Button
                  onClick={handleNotifyWhatsApp}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 gap-2 rounded-xl"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Notify Admin on WhatsApp</span>
                </Button>
                <Button
                  onClick={handleResetModal}
                  variant="outline"
                  className="flex-1 text-xs h-10 font-bold rounded-xl"
                >
                  Close Window
                </Button>
              </div>
            </div>
          ) : (
            /* Direct QR Code + Payment Form */
            <div className="space-y-4">
              {/* Meesho-style Barcode Scanner Display */}
              <div className="bg-card border-2 border-dashed border-emerald-500/40 rounded-2xl p-4 text-center space-y-3 shadow-xs">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-foreground">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>Scan QR Code with GPay, PhonePe, Paytm or BHIM</span>
                </div>

                {/* QR Barcode Image */}
                <div className="relative inline-block bg-white p-3 rounded-2xl border shadow-md">
                  <img
                    src={qrImageUrl}
                    alt={`UPI Payment QR Code for ₹${amount}`}
                    className="w-48 h-48 sm:w-52 sm:h-52 object-contain mx-auto rounded-lg"
                  />
                  <div className="mt-2 pt-2 border-t text-[11px] font-bold text-emerald-800 flex items-center justify-center gap-1">
                    <span>Pay Exact:</span>
                    <span className="text-sm font-black text-emerald-700">₹{amount}</span>
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
                    className="h-8 text-xs font-bold gap-1 rounded-lg shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedUpi ? "Copied!" : "Copy ID"}</span>
                  </Button>
                </div>
              </div>

              {/* Direct Smartphone Mobile Apps Launcher */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-muted-foreground text-center uppercase tracking-wider">
                  Or Tap Below to Pay via Installed App (Mobile Only)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={upiUrl}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-border/80 bg-card hover:border-emerald-500 transition-colors shadow-xs group text-center"
                  >
                    <Smartphone className="w-4 h-4 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-bold text-foreground">GPay / PhonePe</span>
                  </a>
                  <a
                    href={upiUrl}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-border/80 bg-card hover:border-emerald-500 transition-colors shadow-xs group text-center"
                  >
                    <Smartphone className="w-4 h-4 text-sky-600 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-bold text-foreground">Paytm UPI</span>
                  </a>
                  <a
                    href={upiUrl}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-border/80 bg-card hover:border-emerald-500 transition-colors shadow-xs group text-center"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-bold text-foreground">Any UPI App</span>
                  </a>
                </div>
              </div>

              {/* UTR / Transaction Reference Form */}
              <form onSubmit={handleSubmitUtr} className="bg-muted/40 border rounded-2xl p-3.5 space-y-3">
                <div>
                  <Label htmlFor="utr" className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span>Step 2: Enter 12-Digit UTR / Transaction Ref No.</span>
                    <span className="text-[10px] text-muted-foreground font-normal">(After payment)</span>
                  </Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      id="utr"
                      type="text"
                      placeholder="e.g. 428190281923"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="text-xs font-mono h-10 rounded-xl bg-background"
                      maxLength={18}
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-4 rounded-xl shrink-0 gap-1"
                    >
                      {isSubmitting ? "Saving..." : "Submit Receipt"}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    100% Guaranteed Verification
                  </span>
                  <button
                    type="button"
                    onClick={handleNotifyWhatsApp}
                    className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send screenshot on WhatsApp</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
