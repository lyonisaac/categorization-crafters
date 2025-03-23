import React from 'react';
import { Button } from '@/components/ui';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Criterion, Action } from '@/types/rule-types';

interface RuleFormNavigationProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  name: string;
  criteria: Criterion[];
  actions: Action[];
  isEditMode: boolean;
  onSubmit: () => void;
}

const RuleFormNavigation: React.FC<RuleFormNavigationProps> = ({
  currentStep,
  setCurrentStep,
  name,
  criteria,
  actions,
  isEditMode,
  onSubmit
}) => {
  const isStepComplete = () => {
    if (currentStep === 1) return name.trim() !== '';
    if (currentStep === 2) return criteria.length > 0 && criteria.every(c => c.value !== '');
    return true;
  };

  const PrevStepButton = () => (
    <Button 
      type="button" 
      variant="outline" 
      onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
      className="h-10 font-heading flex items-center gap-2 px-3"
    >
      <ArrowLeft size={16} />
      Back
    </Button>
  );

  const NextStepButton = () => {
    return (
      <Button 
        type="button" 
        disabled={!isStepComplete()}
        onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
        className={`h-10 font-heading flex items-center gap-2 px-3 ${
          !isStepComplete() 
            ? 'opacity-70 cursor-not-allowed bg-app-success-inactive hover:bg-app-success-inactive' 
            : 'bg-app-success hover:bg-app-success/90'
        }`}
      >
        Next
        <ArrowRight size={16} />
      </Button>
    );
  };

  const SubmitButton = () => (
    <Button 
      type="submit" 
      className="h-10 font-heading flex items-center gap-2 px-3 bg-app-success hover:bg-app-success/90"
      onClick={onSubmit}
    >
      {isEditMode ? 'Update Rule' : 'Create Rule'}
      <ArrowRight size={16} />
    </Button>
  );

  return (
    <div className="flex items-center gap-3 ml-auto">
      {currentStep > 1 && <PrevStepButton />}
      {currentStep < 4 && <NextStepButton />}
      {currentStep === 4 && <SubmitButton />}
    </div>
  );
};

export default RuleFormNavigation;
