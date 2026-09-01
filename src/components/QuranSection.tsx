import { Moon } from "lucide-react";

export function QuranSection() {
  return (
    <section className="bg-muted/50 border-y border-border">
      <div className="container mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-primary/10 flex items-center justify-center">
            <Moon className="w-6 h-6 text-primary" />
          </div>
          <blockquote className="text-lg sm:text-xl md:text-2xl font-medium text-foreground leading-relaxed">
            “And among His signs is that He created for you spouses from among yourselves,
            that you may find tranquillity in them; and He placed between you affection and mercy.”
          </blockquote>
          <p className="mt-4 text-sm font-semibold text-primary">— Surah Ar-Rum (30:21)</p>
          <div className="mt-6 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
