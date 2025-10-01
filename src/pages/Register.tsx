import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function Register() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="hero-gradient py-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Join Muslim Rishta Connect
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Start your journey to find your perfect life partner
        </p>
      </div>

      {/* Main Content */}
      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Instructions Card */}
        <Card className="mb-8 border-primary/20 card-shadow">
          <CardHeader>
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <CardTitle className="text-xl mb-2">Before You Begin</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Fill the form carefully with accurate details. This will help us find the best matches for you.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Google Form Placeholder */}
        <Card className="border-2 border-dashed border-primary/30">
          <CardContent className="py-16 text-center">
            <div className="space-y-4">
              <div className="text-6xl">📝</div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Registration Form
                </h3>
                <p className="text-muted-foreground">
                  Google Form will be embedded here
                </p>
              </div>
              <div className="text-sm text-muted-foreground max-w-md mx-auto">
                The registration form iframe will be inserted in this section
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            🔒 Your information is secure and will only be shared with verified matches
          </p>
        </div>
      </div>
    </div>
  );
}
