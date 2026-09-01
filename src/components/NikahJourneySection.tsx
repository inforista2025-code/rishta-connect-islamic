import { Button } from "@/components/ui/button";
import { UserPlus, ShieldCheck, HeartHandshake, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { openUpgradeWhatsApp } from "@/lib/upgradeWhatsapp";

export function NikahJourneySection() {
  const navigate = useNavigate();

  const points = [
    {
      icon: ShieldCheck,
      text: "Every profile is reviewed by our admin team — no fake profiles, no time waste.",
    },
    {
      icon: HeartHandshake,
      text: "Serious, marriage-minded Muslims only — families welcome at every step.",
    },
    {
      icon: Star,
      text: "Premium members get unlimited profile access & direct contact — no admin needed. Clear photos, full biodata & priority support for just ₹491 / 2 months.",
    },
  ];

  return (
    <section className="bg-background">
      <div className="container mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8 pb-12 md:pb-16">
        <div className="max-w-5xl mx-auto bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                Your Nikah Journey Starts With One Step 🌙
              </h2>
              <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                {points.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <p.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{p.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full h-12 rounded-full"
                onClick={() => navigate("/register")}
              >
                <UserPlus className="w-5 h-5" />
                Register Free — Take the First Step
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full h-12 rounded-full border-amber-400 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                onClick={openUpgradeWhatsApp}
              >
                <Star className="w-5 h-5" />
                Go Premium ₹491 / 2 Months
              </Button>
              <p className="text-xs text-center text-muted-foreground pt-1">
                “Nikah is half of faith” — Prophet Muhammad ﷺ
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
