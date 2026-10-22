import React from 'react';
import { User, Users, Phone, Camera, Sparkles, Check } from 'lucide-react';

export interface StepDef {
  number: number;
  id: string;
  label: string;
  hindiLabel: string;
  description: string;
}

export const BUILDER_STEPS: StepDef[] = [
  {
    number: 1,
    id: 'personal',
    label: 'Personal & Astro',
    hindiLabel: 'व्यक्तिगत व कुंडली',
    description: 'Name, DOB, Astro, Education & Career'
  },
  {
    number: 2,
    id: 'family',
    label: 'Family Details',
    hindiLabel: 'पारिवारिक विवरण',
    description: 'Parents, Siblings & Lineage'
  },
  {
    number: 3,
    id: 'contact',
    label: 'Contact Info',
    hindiLabel: 'संपर्क सूत्र',
    description: 'Phone, Address & PIN Code'
  },
  {
    number: 4,
    id: 'photo',
    label: 'Photo Studio',
    hindiLabel: 'तस्वीर व फ्रेम',
    description: 'Upload, Crop, Zoom & Rotate'
  },
  {
    number: 5,
    id: 'custom',
    label: 'Custom Fields',
    hindiLabel: 'विशेष विवरण',
    description: 'Add Extra Fields & Preview'
  }
];

interface StepIndicatorProps {
  currentStep: number; // 1 to 5
  onSelectStep: (step: number) => void;
  completedSteps: number[];
  language?: 'en' | 'hi' | 'bilingual';
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onSelectStep,
  completedSteps,
  language = 'en'
}) => {
  const isHindi = language === 'hi';

  const getStepIcon = (num: number) => {
    switch (num) {
      case 1:
        return <User className="w-4 h-4" />;
      case 2:
        return <Users className="w-4 h-4" />;
      case 3:
        return <Phone className="w-4 h-4" />;
      case 4:
        return <Camera className="w-4 h-4" />;
      case 5:
        return <Sparkles className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const currentStepData = BUILDER_STEPS[currentStep - 1] || BUILDER_STEPS[0];

  return (
    <div className="w-full bg-white border border-stone-200/90 rounded-2xl p-3 sm:p-4 shadow-xs">
      {/* Mobile Step Header */}
      <div className="flex md:hidden items-center justify-between pb-3 mb-3 border-b border-stone-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            Step {currentStep} of {BUILDER_STEPS.length}
          </span>
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-1.5 mt-0.5">
            {getStepIcon(currentStep)}
            <span>{isHindi ? currentStepData.hindiLabel : currentStepData.label}</span>
          </h2>
        </div>

        {/* Progress Bar Percentage */}
        <div className="text-right">
          <span className="text-xs font-semibold text-stone-600">
            {Math.round((currentStep / BUILDER_STEPS.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Progress Line on Mobile */}
      <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden md:hidden mb-2">
        <div
          className="bg-amber-800 h-full transition-all duration-300"
          style={{ width: `${(currentStep / BUILDER_STEPS.length) * 100}%` }}
        />
      </div>

      {/* Mobile Step Pills Navigation */}
      <div className="grid grid-cols-5 gap-1 md:hidden pt-1">
        {BUILDER_STEPS.map((step) => {
          const isCurrent = currentStep === step.number;
          const isDone = completedSteps.includes(step.number);
          const isClickable = isDone || step.number <= currentStep;
          return (
            <button
              key={step.id}
              type="button"
              disabled={!isClickable}
              onClick={() => onSelectStep(step.number)}
              className={`py-1.5 px-0.5 rounded-lg text-center transition-all flex flex-col items-center justify-center gap-0.5 min-h-[44px] cursor-pointer touch-manipulation ${
                isCurrent
                  ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300 shadow-2xs'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-stone-50 text-stone-400 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="text-[11px] font-bold flex items-center justify-center gap-0.5">
                <span>{step.number}</span>
                {isDone && <Check className="w-2.5 h-2.5 stroke-[3] text-emerald-700" />}
              </div>
              <span className="text-[8.5px] xs:text-[9px] truncate max-w-full leading-tight">
                {isHindi ? step.hindiLabel.split(' ')[0] : step.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Desktop Stepper */}
      <div className="hidden md:grid grid-cols-5 gap-2 relative">
        {BUILDER_STEPS.map((step) => {
          const isCurrent = currentStep === step.number;
          const isDone = completedSteps.includes(step.number);
          const isClickable = isDone || step.number <= currentStep;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isClickable}
              onClick={() => onSelectStep(step.number)}
              className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                isCurrent
                  ? 'bg-amber-50/90 border border-amber-300/80 shadow-2xs'
                  : isDone
                  ? 'hover:bg-stone-50 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                  isDone
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : isCurrent
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
              </div>

              <div className="min-w-0">
                <div
                  className={`text-xs font-bold truncate ${
                    isCurrent ? 'text-amber-950' : 'text-stone-700'
                  }`}
                >
                  {isHindi ? step.hindiLabel : step.label}
                </div>
                <div className="text-[10px] text-stone-600 truncate">
                  {step.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
