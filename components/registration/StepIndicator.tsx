import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: { title: string; description: string }[];
}

export function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
  return (
    <div className="w-full py-4">
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
                    stepNumber <= currentStep ? "bg-[#900C22]" : "bg-slate-200"
                  }`}
                />
              )}

              {/* Step Circle */}
              <div
                className={`relative z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : isCurrent
                    ? "bg-[#900C22] text-white ring-4 ring-rose-100 shadow-md scale-105"
                    : "bg-white text-slate-400 border border-slate-300"
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : stepNumber}
              </div>

              {/* Step Label */}
              <div className="text-center mt-2 hidden sm:block">
                <div
                  className={`text-xs font-semibold ${
                    isCurrent ? "text-[#900C22]" : isCompleted ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-[10px] text-slate-400 hidden md:block">{step.description}</div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Mobile Title display */}
      <div className="mt-4 text-center sm:hidden">
        <span className="text-xs font-semibold text-[#900C22] uppercase tracking-wider">
          Step {currentStep} of {totalSteps}:
        </span>{" "}
        <span className="text-xs font-bold text-slate-900">{steps[currentStep - 1]?.title}</span>
      </div>
    </div>
  );
}
