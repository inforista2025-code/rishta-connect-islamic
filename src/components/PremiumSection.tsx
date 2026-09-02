import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Crown, Unlock, Phone, Eye, Heart, Image as ImageIcon, Check } from "lucide-react";

export function PremiumSection() {
  const navigate = useNavigate();

  const features = [
    { icon: Unlock, title: "Unlimited Access", desc: "Browse all verified profiles without limits or admin intervention." },
    { icon: ImageIcon, title: "Original Clear Photos", desc: "See full, unblurred photos on every profile." },
    { icon: Phone, title: "Direct Contact Access", desc: "Call or message any profile directly — no admin waiting." },
    { icon: Heart, title: "Unlimited Interests & Saved Profiles", desc: "Send interest and shortlist without limits." },
    { icon: Eye, title: "See Who Viewed Your Profile", desc: "Know who's interested in you." },
  ];

  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="max-w-6xl mx-auto rounded-2xl border border-gold/40 bg-gradient-to-br from-gold-soft via-cream to-background p-6 md:p-10 shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-10 items-start">
            {/* Left: benefits */}
            <div className="md:col-span-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center ring-1 ring-gold/40">
                  <Crown className="w-5 h-5 text-gold" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  Premium Membership
                </p>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                Unlock Full Profiles & Get Serious Matches Faster!
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                Go Premium to view original photos, contact details, and send unlimited interests.
              </p>

              <ul className="mt-6 space-y-3">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </span>
                    <div>
                      <p className="text-sm md:text-base font-semibold text-foreground">{f.title}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{f.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: pricing + CTA */}
            <div className="md:col-span-2 md:pl-6 md:border-l md:border-border">
              <div className="bg-card border border-border rounded-xl p-6 text-center shadow-sm">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Premium Plan</p>
                <p className="mt-2 text-4xl md:text-5xl font-bold text-primary">₹491</p>
                <p className="text-sm text-muted-foreground">for 2 months</p>
                <Button
                  onClick={() => navigate("/pricing")}
                  className="mt-5 w-full h-12 rounded-full"
                  size="lg"
                >
                  <Crown className="w-5 h-5" />
                  View Pricing Plans
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">
                  Cancel anytime • Instant access after payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
