import { FileText, ShieldCheck, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export function HowToJoinSection() {
  const navigate = useNavigate();
  const steps = [
    {
      number: 1,
      icon: FileText,
      title: "Register & Create a Profile",
      description: "Fill basic details and create your profile in minutes",
      clickable: true,
      link: '/register',
    },
    {
      number: 2,
      icon: ShieldCheck,
      title: "Get Verified & Login",
      description: "Once verified, login securely with your WhatsApp number via OTP",
      clickable: true,
      link: '/member/login',
    },
    {
      number: 3,
      icon: Heart,
      title: "Find & Connect",
      description: "Browse verified profiles, send interests and connect with your match",
      clickable: true,
      link: '/profiles',
    },
  ];

  return (
    <section id="how-to-join" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            HOW IT WORKS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Find Your Match in 3 Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step) => (
            <Card
              key={step.number}
              className="text-center border shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                  <div
                    className={`w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center ${step.clickable ? 'cursor-pointer hover:bg-primary/20 transition-colors' : ''}`}
                    onClick={() => step.clickable && navigate(step.link || '/')}
                  >
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
