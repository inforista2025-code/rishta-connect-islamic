const stats = [
  { number: "100%", label: "Manually Verified Profiles" },
  { number: "50+", label: "Successful Marriages" },
  { number: "100%", label: "Halal & Shariah-Compliant" },
  { number: "24h", label: "Admin Verification Time" },
];

export function TrustStatsSection() {
  return (
    <section className="bg-background">
      <div className="container mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl px-3 py-5 text-center shadow-sm"
            >
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">{stat.number}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
