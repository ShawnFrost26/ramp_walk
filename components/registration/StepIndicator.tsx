import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: { title: string; description: string }[];
}

export function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const stepNumber = idx + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center relative">
              {/* Connecting line */}
              {idx !== 0 && (
                <div
                  className={`absolute top-4 -left-1/2 w-full h-[2px] -z-0 transition-colors duration-300 ${
                    stepNumber <= currentStep ? "bg-amber-500" : "bg-slate-800"
                  }`}
                />
              )}

              {/* Step Circle */}
              <div
                className={`relative z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : isCurrent
                    ? "bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 shadow-lg shadow-amber-500/30 scale-105"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : stepNumber}
              </div>

              {/* Step Label */}
              <div className="text-center mt-2 hidden sm:block">
                <div
                  className={`text-xs font-semibold ${
                    isCurrent ? "text-amber-400" : isCompleted ? "text-slate-200" : "text-slate-500"
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-[10px] text-slate-500 hidden md:block">{step.description}</div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Mobile Title display */}
      <div className="mt-4 text-center sm:hidden">
        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
          Step {currentStep} of {totalSteps}:
        </span>{" "}
        <span className="text-xs font-bold text-white">{steps[currentStep - 1]?.title}</span>
      </div>
    </div>
  );
}
