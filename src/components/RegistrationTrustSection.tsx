import { CheckCircle, Shield, Heart, Users } from "lucide-react";

const trustPoints = [
  {
    icon: CheckCircle,
    title: "Verified by Admin",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Heart,
    title: "Islamic & Halal Process",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Privacy Protected",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Users,
    title: "Personal Support Available",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
];

export function RegistrationTrustSection() {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-primary/10 shadow-sm">
        <h2 className="text-xl md:text-2xl font-semibold text-primary text-center mb-3">
          Why Register With Us?
        </h2>
        <p className="text-center text-muted-foreground mb-6 text-sm md:text-base">
          You are just one step away from finding a better and halal rishta for yourself.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {trustPoints.map((point, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`${point.bgColor} p-3 rounded-full mb-3`}>
                <point.icon className={`w-5 h-5 md:w-6 md:h-6 ${point.color}`} />
              </div>
              <span className="text-xs md:text-sm font-medium text-foreground leading-tight">
                {point.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
