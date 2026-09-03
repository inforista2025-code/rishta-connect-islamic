import { Moon } from "lucide-react";

export function IslamicTrustSection() {
  return (
    <section className="py-14 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-cream to-cream" aria-hidden="true" />
      <div className="absolute inset-0 islamic-pattern opacity-50" aria-hidden="true" />
      <div className="container mx-auto px-5 sm:px-6 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
            <Moon className="w-6 h-6 text-primary" />
          </div>
          <div className="w-16 h-px bg-primary/40 mx-auto mb-6" aria-hidden="true" />
          <blockquote className="text-lg md:text-2xl leading-relaxed text-foreground italic font-medium">
            "And among His signs is that He created for you spouses from among yourselves,
            that you may find tranquillity in them..."
          </blockquote>
          <cite className="not-italic block text-sm md:text-base text-primary font-semibold mt-5">
            — Surah Ar-Rum (30:21)
          </cite>
          <div className="w-16 h-px bg-primary/40 mx-auto mt-6" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
