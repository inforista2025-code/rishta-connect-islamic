import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

export function SuccessStoriesSection() {
  const testimonials = [
    {
      text: "Thanks to Rishta Connect, I found my partner within 3 months! Alhamdulillah for this blessed platform.",
      author: "Sister Ayesha",
      location: "Mumbai"
    },
    {
      text: "The verification process made me feel safe. Found my life partner through genuine profiles here.",
      author: "Brother Ahmed", 
      location: "Delhi"
    }
  ];

  return (
    <section className="py-20 bg-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-6xl mb-6">💑</div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-muted-foreground">
              Alhamdulillah, multiple successful matches through our platform!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-card border-0 bg-card/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start mb-4">
                    <Quote className="w-8 h-8 text-primary mr-3 flex-shrink-0" />
                    <p className="text-muted-foreground leading-relaxed italic">
                      "{testimonial.text}"
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-card max-w-2xl mx-auto">
              <div className="text-4xl mb-4">🤲</div>
              <p className="text-lg font-semibold text-foreground">
                "And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them"
              </p>
              <p className="text-sm text-muted-foreground mt-2">- Quran 30:21</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}