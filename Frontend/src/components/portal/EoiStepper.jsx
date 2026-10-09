import React from 'react';
import { Check, Lock } from 'lucide-react';

const STEPS = [
  { number: 1, title: 'Profile' },
  { number: 2, title: 'Dairy Experience' },
  { number: 3, title: 'Payment', locked: true },
];

export default function EoiStepper({ currentStep, maxStepReached = 1, onStepClick }) {
  return (
    <div className="bg-[#F2EFE7] border-b border-[#C8DFDB] py-4 px-4 sm:px-6 lg:px-8 print:hidden">
      <div className="max-w-2xl mx-auto flex items-center">
        {STEPS.map((step, idx) => {
          const isLocked = !!step.locked;
          const isCurrent = !isLocked && currentStep === step.number;
          const isCompleted = !isLocked && step.number < currentStep;
          const isClickable = !isLocked && step.number <= Math.max(currentStep, maxStepReached);

          return (
            <React.Fragment key={step.number}>
              <button
                type="button"
                disabled={!isClickable}
                aria-disabled={!isClickable}
                title={isLocked ? 'Opens only for participants selected after the Expression of Interest' : undefined}
                onClick={() => isClickable && onStepClick(step.number)}
                className={`flex flex-col items-center focus:outline-none transition-all ${
                  isLocked ? 'cursor-not-allowed' : isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                    isLocked
                      ? 'bg-[#EAE6DA] text-[#4E657D] border-dashed border-[#9DB3C4]'
                      : isCurrent
                      ? 'bg-[#3368A0] text-white border-[#3368A0] shadow-lg ring-4 ring-[#3368A0]/20'
                      : isCompleted
                      ? 'bg-[#3368A0] text-white border-[#3368A0]'
                      : 'bg-white text-[#4E657D] border-[#C8DFDB]'
                  }`}
                >
                  {isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <span>0{step.number}</span>
                  )}
                </div>
                <span
                  className={`text-xs font-semibold mt-1.5 whitespace-nowrap ${
                    isCurrent ? 'text-[#3368A0] font-bold' : 'text-[#4E657D]'
                  }`}
                >
                  {step.title}
                </span>
                {isLocked && (
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#9DB3C4]">Locked</span>
                )}
              </button>

              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 rounded-full transition-all duration-500 ${
                    STEPS[idx + 1].locked
                      ? 'border-t-2 border-dashed border-[#C8DFDB] bg-transparent h-0'
                      : currentStep > step.number
                      ? 'bg-[#3368A0]'
                      : 'bg-[#C8DFDB]'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}