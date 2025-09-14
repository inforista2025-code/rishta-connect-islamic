import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ExternalLink, FileText, CheckCircle2 } from "lucide-react";

export function HowToJoinSection() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const handleVerificationPageClick = () => {
    window.open('https://rishta-soulmate-haven.lovable.app/#hero', '_blank');
  };

  const handleGoogleFormClick = () => {
    window.open('https://forms.gle/HdQgKBAVbVAoT9N47', '_blank');
  };

  const stepsHindi = [
    {
      number: "१",
      title: "व्हाट्सएप कम्युनिटी ज्वाइन करें",
      description: "सबसे पहले हमारे व्हाट्सएप कम्युनिटी को ज्वाइन करें और नियमित अपडेट पाएं।"
    },
    {
      number: "२",
      title: "प्रोफाइल रजिस्टर करें",
      description: "अपनी सभी जानकारी सही-सही भरें: नाम, उम्र, शहर, शिक्षा, व्यवसाय, व्हाट्सएप नंबर।"
    },
    {
      number: "३",
      title: "फोटो अपलोड करें", 
      description: "अपनी हाल की फोटो अपलोड करें (चेहरा साफ दिखना चाहिए)।"
    },
    {
      number: "४",
      title: "बायो और preference लिखें",
      description: "अपने बारे में संक्षिप्त जानकारी और आप क्या खोज रहे हैं, वो लिखें।"
    },
    {
      number: "५",
      title: "सबमिट करें और इंतजार करें",
      description: "फॉर्म सबमिट करने के बाद एडमिन टीम आपकी प्रोफाइल रिव्यू करके संपर्क करेगी।"
    }
  ];

  const stepsEnglish = [
    {
      number: "1",
      title: "Join WhatsApp Community",
      description: "First, join our WhatsApp community for regular updates and announcements."
    },
    {
      number: "2",
      title: "Register Profile",
      description: "Fill all details correctly: Name, Age, City, Education, Profession, WhatsApp number."
    },
    {
      number: "3",
      title: "Upload Photo",
      description: "Upload your recent photo (face should be clearly visible)."
    },
    {
      number: "4",
      title: "Write Bio & Preferences",
      description: "Write a brief bio about yourself and what you're looking for in a partner."
    },
    {
      number: "5", 
      title: "Submit & Wait",
      description: "After submission, our admin team will review your profile and contact you."
    }
  ];

  const currentSteps = language === 'hi' ? stepsHindi : stepsEnglish;

  return (
    <section id="how-to-join" className="py-20 section-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-card border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How to Join — Step-by-Step
              </CardTitle>
              
              {/* Language Toggle */}
              <div className="flex justify-center gap-2 mb-6">
                <Button
                  variant={language === 'hi' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('hi')}
                >
                  हिंदी
                </Button>
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('en')}
                >
                  English
                </Button>
              </div>

              {/* Action Button */}
              <div className="flex justify-center mb-8">
                <Button variant="community" size="lg" onClick={handleGoogleFormClick}>
                  <FileText className="w-5 h-5" />
                  Register Profile
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {/* Steps Accordion */}
              <Accordion type="multiple" defaultValue={["item-0", "item-1", "item-2", "item-3", "item-4"]} className="w-full">
                {currentSteps.map((step, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
                    <AccordionTrigger className="text-left hover:no-underline py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                          {step.number}
                        </div>
                        <span className="font-semibold text-lg">{step.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pl-14 text-muted-foreground">
                      {step.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {/* Admin Review Note */}
              <div className="mt-8 p-6 bg-accent/30 rounded-xl border-l-4 border-primary">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">
                    {language === 'hi' ? 'महत्वपूर्ण नोट' : 'Important Note'}
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {language === 'hi' 
                    ? 'फॉर्म सबमिट करने के बाद एडमिन टीम आपकी प्रोफाइल रिव्यू करके आपसे संपर्क करेगी।'
                    : 'After submission, our admin team will review your profile and contact you.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}