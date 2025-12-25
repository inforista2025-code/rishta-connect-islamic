import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    id: 1,
    title: "Rishta Dhundhne Se Pehle Ye 5 Baatein Zaroor Jaanein",
    excerpt: "Shaadi ke liye rishta dhundhte waqt kuch important baatein hain jo har ladke aur ladki ko pata honi chahiye...",
    date: "20 Dec 2025",
    category: "Tips",
    image: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=400&h=250&fit=crop"
  },
  {
    id: 2,
    title: "Islamic Nikah Ki Ahmiyat Aur Sunnat Tareeqa",
    excerpt: "Nikah Islam mein ek mubarak rishtah hai. Janiye nikah ki shari importance aur sunnat ke mutabiq nikah kaise karein...",
    date: "18 Dec 2025",
    category: "Islamic",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=250&fit=crop"
  },
  {
    id: 3,
    title: "Parents Ko Kaise Convince Karein Apni Pasand Ke Liye",
    excerpt: "Agar aapki koi pasand hai aur parents ko convince karna mushkil lag raha hai, toh ye tips zaroor padhein...",
    date: "15 Dec 2025",
    category: "Advice",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=250&fit=crop"
  }
];

export function BlogSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Humara Blog
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Rishta Aur Shaadi Ki Baatein
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Shaadi, rishta aur family life se related useful articles padhein
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogPosts.map((post) => (
            <Card 
              key={post.id} 
              className="group overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              <CardContent className="p-5">
                {/* Date */}
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                  {post.excerpt}
                </p>

                {/* Read More */}
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent group/btn"
                >
                  Poora Padhein
                  <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Button variant="outline" size="lg" className="gap-2">
            Sabhi Articles Dekhein
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
