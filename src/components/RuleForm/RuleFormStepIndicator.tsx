import React from 'react';
import { Check } from 'lucide-react';

interface RuleFormStepIndicatorProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const RuleFormStepIndicator: React.FC<RuleFormStepIndicatorProps> = ({
  currentStep,
  setCurrentStep
}) => {
  const steps = [
    { num: 1, label: "General" },
    { num: 2, label: "Criteria" },
    { num: 3, label: "Actions" },
    { num: 4, label: "Review" }
  ];

  return (
    <div className="flex justify-between items-center mb-8 px-6 py-2 glass-card rounded-full gap-2">
      {steps.map((step) => (
        <div 
          key={step.num} 
          className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
            currentStep === step.num ? 'scale-110' : 'opacity-70'
          }`}
          onClick={() => {
            if (step.num <= currentStep) {
              setCurrentStep(step.num);
            }
          }}
        >
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-heading font-semibold mb-1
            ${currentStep === step.num ? 'bg-app-blue' : 
              currentStep > step.num ? 'bg-app-success' : 'bg-gray-300'}`}
          >
            {currentStep > step.num ? <Check size={16} /> : step.num}
          </div>
          <span className={`text-xs font-heading ${currentStep === step.num ? 'text-app-blue font-medium' : 'text-gray-500'}`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default RuleFormStepIndicator;
