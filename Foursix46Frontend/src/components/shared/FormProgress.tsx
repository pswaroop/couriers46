import React from "react";
import { cn } from "@/lib/utils";

interface FormProgressProps {
  steps: string[];
  currentStep: number;
}

export const FormProgress = ({ steps, currentStep }: FormProgressProps) => {
  return (
    <div className="mb-8 sm:mb-12">
      <div className="flex items-start justify-between w-full max-w-3xl mx-auto px-1 sm:px-2">
        {steps.map((step, idx) => {
          const stepNumber = idx + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <React.Fragment key={idx}>
              {/* Circle and Text Container */}
              <div className="flex flex-col items-center relative z-10 shrink-0">
                <div
                  className={cn(
                    // Mobile: w-7 h-7 (28px) for better fit
                    // Desktop: w-12 h-12 (48px)
                    "w-7 h-7 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-smooth text-xs sm:text-base",
                    isCompleted && "bg-primary text-white",
                    isActive && "bg-primary text-white shadow-lg scale-110",
                    !isActive && !isCompleted && "bg-muted text-muted-foreground"
                  )}
                >
                  {stepNumber}
                </div>
                <span
                  className={cn(
                    // Mobile: Smaller text (10px) and reduced max-width to prevent overflow
                    "mt-2 text-[10px] sm:text-sm font-medium text-center px-0.5 leading-tight",
                    "max-w-[60px] sm:max-w-[120px]",
                    isActive && "text-primary",
                    !isActive && "text-muted-foreground"
                  )}
                >
                  {step}
                </span>
              </div>

              {/* Connector Dash - Rendered between steps */}
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "h-1 flex-1 rounded-full transition-smooth",
                    "min-w-[4px] sm:min-w-[8px]",
                    "mx-0.5 sm:mx-4",
                    // Alignment Calculation:
                    // Mobile (w-7 / 28px): (28px - 4px) / 2 = 12px -> mt-3
                    // Desktop (w-12 / 48px): (48px - 4px) / 2 = 22px -> mt-[22px]
                    "mt-3 sm:mt-[22px]", 
                    stepNumber < currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};