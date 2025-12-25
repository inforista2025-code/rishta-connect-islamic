import { Heart } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizes = {
    sm: {
      container: "w-8 h-8",
      icon: "w-4 h-4",
      text: "text-lg",
    },
    md: {
      container: "w-10 h-10",
      icon: "w-5 h-5",
      text: "text-xl",
    },
    lg: {
      container: "w-14 h-14",
      icon: "w-7 h-7",
      text: "text-2xl",
    },
  };

  return (
    <div className="flex items-center gap-2">
      {/* Logo Icon */}
      <div
        className={`${sizes[size].container} relative bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md`}
      >
        {/* Islamic geometric pattern overlay */}
        <div className="absolute inset-0 rounded-xl overflow-hidden opacity-20">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 10L90 50L50 90L10 50Z"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>
        {/* Heart icon */}
        <Heart className={`${sizes[size].icon} text-primary-foreground fill-primary-foreground`} />
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${sizes[size].text} font-bold text-primary`}>
            Rishta
          </span>
          <span className={`text-xs text-muted-foreground font-medium tracking-wider`}>
            MATRIMONY
          </span>
        </div>
      )}
    </div>
  );
}
