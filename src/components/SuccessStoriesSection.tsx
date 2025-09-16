import { Card, CardContent } from "@/components/ui/card";
import { Heart, Quote, Star } from "lucide-react";

export function SuccessStoriesSection() {
  const stories = [
    {
      id: 1,
      couple: "Ahmed & Fatima",
      image: "/placeholder.svg",
      story: "We found each other through Rishta Matrimony and got married in 2023. The platform made it so easy to connect with like-minded people. Thank you for helping us find our perfect match!",
      rating: 5,
      date: "Married in 2023"
    },
    {
      id: 2,
      couple: "Omar & Aisha",
      image: "/placeholder.svg", 
      story: "After years of searching, we finally found each other on Rishta Matrimony. The verification process gave us confidence, and the community was very supportive throughout our journey.",
      rating: 5,
      date: "Married in 2022"
    },
    {
      id: 3,
      couple: "Hassan & Zara",
      image: "/placeholder.svg",
      story: "Rishta Matrimony helped us connect despite being in different cities. The platform's easy-to-use features and genuine profiles made our search successful. Highly recommended!",
      rating: 5,
      date: "Married in 2023"
    }
  ];

  return (
    <section id="success-stories" className="py-20 section-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Heart className="w-5 h-5" />
              <span className="font-semibold">Success Stories</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Love Found Here
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Read inspiring stories from couples who found their perfect match through our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <Card key={story.id} className="card-shadow border-0 bg-card/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  {/* Couple Image */}
                  <div className="relative mb-6">
                    <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <Heart className="w-16 h-16 text-primary/30" />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-primary text-primary-foreground rounded-full p-2">
                        <Heart className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Story Content */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {story.couple}
                    </h3>
                    <p className="text-sm text-primary font-medium">
                      {story.date}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(story.rating)].map((_, index) => (
                      <Star key={index} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="relative">
                    <Quote className="w-8 h-8 text-primary/20 absolute -top-2 -left-2" />
                    <p className="text-muted-foreground text-sm leading-relaxed pl-6">
                      {story.story}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Want to share your success story with us?
            </p>
            <button className="text-primary font-semibold hover:underline">
              Submit Your Story
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}