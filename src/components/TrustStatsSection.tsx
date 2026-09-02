const stats = [
  { number: "100%", label: "Manually Verified Profiles" },
  { number: "50+", label: "Successful Marriages" },
  { number: "100%", label: "Halal & Shariah-Compliant" },
  { number: "24h", label: "Admin Verification Time" },
];

export function TrustStatsSection() {
  return (
    <section className="py-10 md:py-14 bg-background">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl px-4 py-5 md:py-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-2xl md:text-3xl font-bold text-primary">{stat.number}</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
