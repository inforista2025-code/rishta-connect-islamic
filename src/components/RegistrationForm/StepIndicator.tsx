import { Check, User, Briefcase, Sparkles } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  { step: 1, title: "Personal Info", desc: "Basic & physical details", icon: User },
  { step: 2, title: "Family & Career", desc: "Education & contact", icon: Briefcase },
  { step: 3, title: "Preferences & Photos", desc: "Uploads & declaration", icon: Sparkles },
];

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const progressPercent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="mb-8 select-none">
      {/* Step Numbers & Labels */}
      <div className="grid grid-cols-3 gap-2 relative">
        {steps.map(({ step, title, desc, icon: Icon }) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={step} className="flex flex-col items-center text-center relative z-10">
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 shadow-sm ${
                  isCompleted
                    ? "bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900"
                    : isCurrent
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-md scale-105"
                    : "bg-muted/80 text-muted-foreground border border-border"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                ) : (
                  <Icon className="w-5 h-5 sm:w-5 sm:h-5" />
                )}
              </div>
              <p
                className={`mt-2 text-xs sm:text-sm font-bold tracking-tight line-clamp-1 ${
                  isCurrent
                    ? "text-primary"
                    : isCompleted
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-muted-foreground"
                }`}
              >
                {title}
              </p>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                {desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-5 w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-emerald-600 via-primary to-primary h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent === 0 ? 33 : progressPercent === 50 ? 66 : 100}%` }}
        />
      </div>
    </div>
  );
}
