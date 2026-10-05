import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Check, ShieldCheck, QrCode } from "lucide-react";
import { DirectPaymentModal } from "@/components/payment/DirectPaymentModal";

const benefits = [
  "View full verified contact details",
  "Send unlimited profile interests",
  "View unblurred HD profile photos",
  "Get featured on 1st Page pinned top",
  "⭐ Premium Gold Verified Badge",
  "Priority 1-on-1 customer support",
];

export function PremiumUpgradeCard() {
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <>
      <Card className="border-amber-200/80 bg-gradient-to-br from-amber-500/10 via-orange-50/50 to-pink-50/30 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center shadow-xs">
              <Crown className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-foreground">Upgrade to Premium</h3>
            <p className="text-xs text-muted-foreground">Unlock all verified profiles & direct contact numbers</p>
          </div>
          
          <ul className="space-y-2 text-xs">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span className="font-semibold text-foreground/90">{b}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-xl border border-amber-500/30 bg-background/80 py-2.5 px-3 text-center shadow-2xs">
            <span className="text-2xl font-black text-primary">₹491</span>
            <span className="text-xs font-bold text-muted-foreground"> / 2 Months Access</span>
          </div>

          <Button 
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm rounded-xl shadow-md gap-2 cursor-pointer" 
            onClick={() => setPaymentOpen(true)}
          >
            <QrCode className="w-4 h-4 text-amber-300" />
            <span>Pay Direct via Barcode / UPI</span>
          </Button>

          <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1 text-center font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Direct On-Screen UPI Payment
          </p>
        </CardContent>
      </Card>

      <DirectPaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        defaultPlan="premium"
      />
    </>
  );
}