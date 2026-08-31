import { Button } from "@/components/ui/button";
import { UserPlus, Moon, ShieldCheck, HeartHandshake, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { openUpgradeWhatsApp } from "@/lib/upgradeWhatsapp";

export function IslamicTrustSection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4">
        {/* Quranic Verse */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <Moon className="w-7 h-7 text-primary" />
          </div>
          <p className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed italic">
            "And among His signs is that He created for you spouses from among yourselves,
            that you may find tranquillity in them; and He placed between you affection and mercy."
          </p>
          <p className="text-sm text-primary font-semibold mt-3">— Surah Ar-Rum (30:21)</p>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
          {[
            { number: "100%", label: "Manually Verified Profiles" },
            { number: "50+", label: "Successful Marriages" },
            { number: "100%", label: "Halal & Shariah-Compliant" },
            { number: "24h", label: "Admin Verification Time" },
          ].map((stat, i) => (
            <div key={i} className="bg-card border rounded-xl p-5 text-center shadow-sm">
              <p className="text-2xl md:text-3xl font-bold text-primary">{stat.number}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Why register message */}
        <div className="max-w-4xl mx-auto bg-card border rounded-2xl p-6 md:p-8 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                Your Nikah Journey Starts With One Step 🌙
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  Every profile is reviewed by our admin team — no fake profiles, no time waste.
                </li>
                <li className="flex items-start gap-2">
                  <HeartHandshake className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  Serious, marriage-minded Muslims only — families welcome at every step.
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  Premium members find matches faster — clear photos, contact access & priority support for just ₹491 / 2 months.
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full rounded-full transition-transform duration-200 hover:scale-105"
                onClick={() => navigate("/register")}
              >
                <UserPlus className="w-5 h-5" />
                Register Free — Take the First Step
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-full border-amber-400 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                onClick={openUpgradeWhatsApp}
              >
                <Star className="w-5 h-5" />
                Go Premium ₹491 / 2 Months
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                "Nikah is half of faith" — Prophet Muhammad ﷺ
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
