import { Users, Heart, ShieldCheck, Lock } from "lucide-react";

const items = [
  { icon: Users, value: "500+", label: "Verified Profiles" },
  { icon: Heart, value: "50+", label: "Successful Marriages" },
  { icon: ShieldCheck, value: "Admin Reviewed", label: "Profiles Carefully Verified" },
  { icon: Lock, value: "Privacy First", label: "Your Safety Is Our Priority" },
];

export function TrustStripSection() {
  return (
    <section className="border-y border-border bg-card">
      <div className="container mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8 py-6 md:py-7">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6">
          {items.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="w-9 h-9 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                <item.icon className="w-[18px] h-[18px] text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-bold text-foreground leading-tight">{item.value}</p>
                <p className="text-xs text-muted-foreground leading-snug mt-0.5">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
