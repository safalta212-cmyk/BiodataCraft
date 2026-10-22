import React from 'react';

export interface StepItem {
  id: string;
  number: number;
  label: string;
  hindiLabel: string;
  icon: string;
}

interface StepProgressProps {
  steps: StepItem[];
  activeStep: string;
  onSelectStep: (stepId: string) => void;
  language: 'en' | 'hi' | 'bilingual';
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  activeStep,
  onSelectStep,
  language
}) => {
  return (
    <div className="w-full bg-white border-b border-stone-200 sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar py-2.5 flex items-center gap-2">
        {steps.map((step) => {
          const isActive = step.id === activeStep;
          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive ? 'bg-amber-700 text-white' : 'bg-stone-300 text-stone-700'
                }`}
              >
                {step.number}
              </span>
              <span>{language === 'hi' ? step.hindiLabel : step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
