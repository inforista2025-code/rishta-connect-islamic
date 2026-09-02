import { Button } from "@/components/ui/button";
import { UserPlus, Crown, ShieldCheck, HeartHandshake, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { openUpgradeWhatsApp } from "@/lib/upgradeWhatsapp";

export function NikahJourneySection() {
  const navigate = useNavigate();
  const points = [
    { icon: ShieldCheck, text: "Every profile is reviewed by our admin team — no fake profiles, no time waste." },
    { icon: HeartHandshake, text: "Serious, marriage-minded Muslims only — families welcome at every step." },
    { icon: Star, text: "Premium members get unlimited profile access & direct contact — no admin needed. Clear photos, full biodata & priority support for just ₹491 / 2 months." },
  ];

  return (
    <section className="py-12 md:py-16 bg-cream">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="max-w-5xl mx-auto bg-card border border-border rounded-2xl p-6 md:p-10 shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-4">
                Your Nikah Journey Starts With One Step 🌙
              </h3>
              <ul className="space-y-3.5">
                {points.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <span className="w-7 h-7 shrink-0 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <p.icon className="w-4 h-4 text-primary" />
                    </span>
                    <span>{p.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 md:pl-4">
              <Button
                size="lg"
                className="h-12 w-full rounded-full"
                onClick={() => navigate("/register")}
              >
                <UserPlus className="w-5 h-5" />
                Register Free — Take the First Step
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full rounded-full border-gold text-gold hover:bg-gold-soft"
                onClick={openUpgradeWhatsApp}
              >
                <Crown className="w-5 h-5" />
                Go Premium ₹491 / 2 Months
              </Button>
              <p className="text-xs md:text-sm text-center text-muted-foreground italic mt-2">
                "Nikah is half of faith" — Prophet Muhammad ﷺ
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
