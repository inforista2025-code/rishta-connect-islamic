import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  src?: string;
  alt: string;
  blurred?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  rounded?: "full" | "lg" | "md";
  className?: string;
  showLockHint?: boolean;
}

const sizeMap = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-20 h-20",
  xl: "w-32 h-32",
  full: "w-full h-full",
};

export function ProfilePhoto({ src, alt, blurred, size = "md", rounded = "lg", className, showLockHint }: Props) {
  const fallback = "/placeholder.svg";
  const photoSrc = src || fallback;
  const roundedClass = rounded === "full" ? "rounded-full" : rounded === "lg" ? "rounded-lg" : "rounded-md";
  return (
    <div className={cn("relative overflow-hidden bg-muted", sizeMap[size], roundedClass, className)}>
      <img
        src={photoSrc}
        alt={alt}
        className={cn("w-full h-full object-cover", blurred && "blur-md scale-110")}
        loading="lazy"
      />
      {blurred && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          {showLockHint && (
            <div className="bg-white/90 rounded-full p-2 shadow">
              <Lock className="w-4 h-4 text-primary" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}