import { Button } from "@/components/ui/button";
import { UserPlus, Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import couple1 from "@/assets/couple1.jpg";
import couple2 from "@/assets/couple2.jpg";
import couple3 from "@/assets/couple3.jpg";

const successStories = [
  {
    quote: "We found each other on Rishta Matrimony. The profiles were genuine and our families are happy. JazakAllah Khair!",
    names: "Ahmed & Fatima",
    location: "Mumbai",
    date: "Married Jan 2026",
    image: couple1,
  },
  {
    quote: "A simple registration changed our lives. We got married last month and started our beautiful journey. Highly recommended!",
    names: "Imran & Ayesha",
    location: "Delhi",
    date: "Married Dec 2025",
    image: couple2,
  },
  {
    quote: "Thank you Rishta Matrimony for helping us find our perfect match. The verification process gave us confidence.",
    names: "Haseeb & Sana",
    location: "Ranchi",
    date: "Married Nov 2025",
    image: couple3,
  },
];

export function SuccessAndTrustSection() {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActive(Math.min(successStories.length - 1, Math.max(0, index)));
  };

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section id="success-stories" className="py-14 md:py-20 bg-cream scroll-mt-20">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.18em] mb-2">
              Success Stories
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground leading-tight">
              Alhamdulillah! Beautiful Matches Made Through
              <br className="hidden md:block" />{" "}
              <span className="text-primary">Rishta Matrimony</span>
            </h2>
          </div>

          {/* Mobile carousel / desktop grid */}
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar -mx-5 px-5 md:mx-0 md:px-0"
          >
            {successStories.map((story, index) => (
              <article
                key={index}
                className="min-w-full md:min-w-0 snap-center bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
              >
                <img
                  src={story.image}
                  alt={`${story.names} — success story from ${story.location}`}
                  className="w-full h-44 md:h-52 object-cover object-top"
                  loading="lazy"
                  width={640}
                  height={512}
                />
                <div className="p-5 flex flex-col flex-1">
                  <Quote className="w-5 h-5 text-primary/50 mb-2" />
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {story.quote}
                  </p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="font-semibold text-foreground text-sm">{story.names}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {story.location} • {story.date}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Carousel indicators (mobile only) */}
          <div className="flex md:hidden justify-center gap-2 mt-4">
            {successStories.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to story ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${
                  active === i ? "w-6 bg-primary" : "w-2 bg-primary/25"
                }`}
              />
            ))}
          </div>

          {/* Compact CTA */}
          <div className="mt-8 md:mt-12 bg-card border border-primary/25 rounded-xl px-5 py-5 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="font-semibold text-foreground text-base md:text-lg">
                Your Success Story Could Be Next!
              </p>
              <p className="text-sm text-muted-foreground">Start Your Journey Today.</p>
            </div>
            <Button
              className="h-11 rounded-full px-6 w-full sm:w-auto whitespace-nowrap"
              onClick={() => navigate("/register")}
            >
              <UserPlus className="w-4 h-4" />
              Register Free Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
