import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Check, ShieldCheck } from "lucide-react";
import { openUpgradeWhatsApp } from "@/lib/upgradeWhatsapp";

const benefits = [
  "View full contact details",
  "Send unlimited interests",
  "Access address details",
  "View all photos",
  "Get featured in search",
  "Priority customer support",
];

export function PremiumUpgradeCard() {
  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50/60 to-pink-50/40 shadow-sm">
      <CardContent className="p-5 space-y-4">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <Crown className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold">Upgrade to Premium</h3>
          <p className="text-xs text-muted-foreground">Unlock all features and get unlimited access</p>
        </div>
        <ul className="space-y-2 text-sm">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-pink-600 mt-0.5 shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="rounded-lg border border-amber-200 bg-white/60 py-2 px-3 text-center">
          <span className="text-lg font-bold text-foreground">₹491</span>
          <span className="text-sm text-muted-foreground"> / 2 Months</span>
        </div>
        <Button className="w-full bg-primary hover:bg-primary/90" onClick={openUpgradeWhatsApp}>
          Upgrade via WhatsApp
        </Button>
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3" /> 100% Secure Payment
        </p>
      </CardContent>
    </Card>
  );
}