import { useEffect, useState, useRef } from "react";
import { Users, Heart, CheckCircle, TrendingUp } from "lucide-react";

interface StatItemProps {
  icon: React.ElementType;
  endValue: number;
  suffix: string;
  label: string;
  delay: number;
}

function StatItem({ icon: Icon, endValue, suffix, label, delay }: StatItemProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = endValue / steps;
      let current = 0;

      const counter = setInterval(() => {
        current += increment;
        if (current >= endValue) {
          setCount(endValue);
          clearInterval(counter);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, endValue, delay]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center p-6 bg-card/80 backdrop-blur-sm rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
        {count}
        <span className="text-2xl md:text-3xl">{suffix}</span>
      </div>
      <p className="text-muted-foreground font-medium text-center">{label}</p>
    </div>
  );
}

export function StatsCounter() {
  const stats = [
    {
      icon: Users,
      endValue: 500,
      suffix: "+",
      label: "Registered Profiles",
      delay: 0,
    },
    {
      icon: Heart,
      endValue: 50,
      suffix: "+",
      label: "Successful Matches",
      delay: 200,
    },
    {
      icon: CheckCircle,
      endValue: 100,
      suffix: "%",
      label: "Verified Profiles",
      delay: 400,
    },
    {
      icon: TrendingUp,
      endValue: 1000,
      suffix: "+",
      label: "Active Members",
      delay: 600,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Growing Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of Muslims who trust Rishta Matrimony for finding their life partner
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
