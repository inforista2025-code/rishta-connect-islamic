import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, User, Phone, MapPin, GraduationCap, Briefcase, Camera, FileText, Heart } from "lucide-react";

export function GoogleFormSection() {
  const handleFormClick = () => {
    window.open('https://forms.gle/HdQgKBAVbVAoT9N47', '_blank');
  };

  const requiredItems = [
    { icon: User, text: "Name (नाम)", color: "text-blue-500" },
    { icon: User, text: "Age (उम्र)", color: "text-green-500" },
    { icon: MapPin, text: "City (शहर)", color: "text-red-500" },
    { icon: GraduationCap, text: "Education (शिक्षा)", color: "text-purple-500" },
    { icon: Briefcase, text: "Profession (व्यवसाय)", color: "text-orange-500" },
    { icon: Phone, text: "WhatsApp Number", color: "text-teal-500" },
    { icon: Camera, text: "Recent Photo (हाल की फोटो)", color: "text-pink-500" },
    { icon: FileText, text: "Brief Bio (संक्षिप्त परिचय)", color: "text-indigo-500" },
    { icon: Heart, text: "What you're looking for", color: "text-rose-500" }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-card border-0 bg-card/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Profile Verification Form
              </CardTitle>
              <p className="text-lg text-muted-foreground mb-6">
                Please fill out all required information for profile verification
              </p>
            </CardHeader>

            <CardContent>
              {/* Required Items Checklist */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
                  Required Information / आवश्यक जानकारी
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {requiredItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <span className="text-sm font-medium text-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Button */}
              <div className="text-center">
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={handleFormClick}
                  className="w-full sm:w-auto"
                >
                  <ExternalLink className="w-6 h-6" />
                  Open Verification Form
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Form will open in a new tab. Please fill all details carefully.
                  <br />
                  फॉर्म नए टैब में खुलेगा। कृपया सभी जानकारी सही-सही भरें।
                </p>
              </div>

              {/* Privacy Note */}
              <div className="mt-8 p-6 bg-accent/20 rounded-xl border border-accent/30">
                <h4 className="font-semibold text-foreground mb-2 text-center">🔒 Privacy & Security</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="text-center">
                    <p>✅ Profiles are verified before approval</p>
                    <p className="text-xs mt-1">प्रोफाइल स्वीकृति से पहले सत्यापित की जाती हैं</p>
                  </div>
                  <div className="text-center">
                    <p>✅ We do not share personal details publicly</p>
                    <p className="text-xs mt-1">हम व्यक्तिगत जानकारी सार्वजनिक रूप से साझा नहीं करते</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}