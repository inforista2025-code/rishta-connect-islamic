import { Users, Heart, ShieldCheck, Lock } from "lucide-react";

const items = [
  { icon: Users, value: "500+", label: "Verified Profiles" },
  { icon: Heart, value: "50+", label: "Successful Marriages" },
  { icon: ShieldCheck, value: "Admin Reviewed", label: "Profiles Carefully Verified" },
  { icon: Lock, value: "Privacy First", label: "Your Safety Is Our Priority" },
];

export function TrustStripSection() {
  return (
    <section className="bg-background border-y border-border">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 px-3 py-5 md:px-6 md:py-6">
              <span className="w-9 h-9 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                <item.icon className="w-4.5 h-4.5 w-[18px] h-[18px] text-primary" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-sm md:text-base leading-tight">
                  {item.value}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground leading-snug">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
