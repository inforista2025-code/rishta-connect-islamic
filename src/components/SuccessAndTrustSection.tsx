import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SuccessAndTrustSection() {
  const navigate = useNavigate();

  const successStories = [
    {
      quote: "We found each other on Rishta Matrimony. The profiles were genuine and our families are happy. JazakAllah Khair!",
      names: "Ahmed & Fatima",
      location: "Mumbai",
      date: "Married Jan 2025",
    },
    {
      quote: "A simple registration changed our lives. We got married last month and started our beautiful journey. Highly recommended!",
      names: "Imran & Ayesha",
      location: "Delhi",
      date: "Married Dec 2025",
    },
    {
      quote: "Thank you Rishta Matrimony for helping us find our perfect match. The verification process gave us confidence.",
      names: "Haseeb & Sana",
      location: "Bangalore",
      date: "Married Nov 2026",
    },
  ];

  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            SUCCESS STORIES
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Alhamdulillah! Beautiful Matches Made Through{" "}
            <span className="text-primary">Rishta Matrimony</span>
          </h2>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
          {successStories.map((story, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Placeholder image area */}
              <div className="h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
                <div className="text-6xl">💑</div>
              </div>
              <CardContent className="p-5">
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  <span className="text-primary text-lg font-bold">"</span>
                  {story.quote}
                  <span className="text-primary text-lg font-bold">"</span>
                </p>
                <p className="font-semibold text-primary">— {story.names}</p>
                <p className="text-xs text-muted-foreground">
                  {story.location} • {story.date}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-semibold text-foreground text-center sm:text-left text-sm md:text-base">
              Your Success Story Could Be Next! Join Today & Find Your Perfect Match
            </p>
            <Button
              variant="default"
              size="sm"
              className="rounded-full whitespace-nowrap"
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
