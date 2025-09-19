import { Shield, CheckCircle, Users, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function SuccessAndTrustSection() {
  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Success & Trust
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Your trust is our priority. Join thousands of satisfied families.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Verified Profiles Badge */}
          <Card className="text-center hover:shadow-lg transition-shadow duration-300 hover-scale">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <Badge variant="secondary" className="mb-3 text-sm font-semibold">
                Verified Profiles Only
              </Badge>
              <p className="text-muted-foreground text-sm">
                Every profile is thoroughly verified for authenticity and accuracy
              </p>
            </CardContent>
          </Card>

          {/* Privacy Protected Badge */}
          <Card className="text-center hover:shadow-lg transition-shadow duration-300 hover-scale">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <Badge variant="secondary" className="mb-3 text-sm font-semibold">
                Privacy Protected
              </Badge>
              <p className="text-muted-foreground text-sm">
                Your personal information is secure and handled with complete confidentiality
              </p>
            </CardContent>
          </Card>

          {/* Successful Matches Badge */}
          <Card className="text-center hover:shadow-lg transition-shadow duration-300 hover-scale">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <Badge variant="secondary" className="mb-3 text-sm font-semibold">
                50+ Successful Matches
              </Badge>
              <p className="text-muted-foreground text-sm">
                Alhamdulillah, we've facilitated numerous successful Islamic marriages
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Testimonial */}
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-primary/5 border-primary/20 hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-8">
              <Heart className="w-8 h-8 text-primary mx-auto mb-4" />
              <blockquote className="text-lg font-medium text-foreground mb-4">
                "Alhamdulillah, multiple successful matches through our platform!"
              </blockquote>
              <p className="text-muted-foreground text-sm">
                — Happy Families using Rishta Matrimony
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}