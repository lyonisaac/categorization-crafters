import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input, Label, Card } from '@/components/ui';
import { Trash2 } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import RuleStatus from '@/components/RuleStatus';
import { 
  mockRule, 
  defaultPreviewTransaction,
  Criterion,
  Action
} from '@/types/rule-types';

// Import extracted components
import RuleFormStepIndicator from './RuleForm/RuleFormStepIndicator';
import TransactionPreview from './RuleForm/TransactionPreview';
import RuleCriteriaForm from './RuleForm/RuleCriteriaForm';
import RuleActionsForm from './RuleForm/RuleActionsForm';
import RuleReviewForm from './RuleForm/RuleReviewForm';
import RuleFormNavigation from './RuleForm/RuleFormNavigation';

const RuleForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string; }>();
  const isEditMode = !!id;

  const [name, setName] = useState(isEditMode ? mockRule.name : '');
  const [description, setDescription] = useState(isEditMode ? mockRule.description : '');
  const [criteria, setCriteria] = useState<Criterion[]>(isEditMode ? mockRule.criteria : [{
    id: 'new-c1',
    type: 'payee',
    operator: 'contains',
    value: ''
  }]);
  const [actions, setActions] = useState<Action[]>(isEditMode ? mockRule.actions : [{
    id: 'new-a1',
    type: 'category',
    value: ''
  }]);
  const [relationOperator, setRelationOperator] = useState<'AND' | 'OR'>('AND');
  const [currentStep, setCurrentStep] = useState(1);
  const [previewTransaction, setPreviewTransaction] = useState(defaultPreviewTransaction);
  const [ruleStatus, setRuleStatus] = useState<'active' | 'inactive'>('active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      name,
      description,
      criteria,
      actions,
      relationOperator,
      status: ruleStatus
    });
    navigate('/');
  };

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit} className="space-y-8 animate-slide-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-heading font-semibold">
            {isEditMode ? 'Edit Rule' : 'Create New Rule'}
          </h2>
          <div className="space-x-2">
            <Button type="button" variant="outline" onClick={() => navigate('/')} className="font-heading bg-app-delete text-white hover:bg-app-delete/90">
              Cancel
            </Button>
          </div>
        </div>
        
        <RuleFormStepIndicator currentStep={currentStep} setCurrentStep={setCurrentStep} />
        
        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <div className="p-6">
                  <h3 className="text-lg font-heading font-medium mb-4">General Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-body">Rule Name <span className="text-app-delete">*</span></Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={e => setName(e.target.value)} 
                          placeholder="Enter rule name" 
                          required 
                          className="glass-card" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="font-body">Description</Label>
                        <Input 
                          id="description" 
                          value={description} 
                          onChange={e => setDescription(e.target.value)} 
                          placeholder="Enter rule description (optional)" 
                          className="glass-card" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-body">Rule Status</Label>
                        <RuleStatus 
                          status={ruleStatus} 
                          onChange={setRuleStatus} 
                          interactive={true} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <div>
              <TransactionPreview 
                criteria={criteria}
                actions={actions}
                relationOperator={relationOperator}
                previewTransaction={previewTransaction}
                setPreviewTransaction={setPreviewTransaction}
              />
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RuleCriteriaForm 
                criteria={criteria}
                setCriteria={setCriteria}
                relationOperator={relationOperator}
                setRelationOperator={setRelationOperator}
              />
            </div>
            <div>
              <TransactionPreview 
                criteria={criteria}
                actions={actions}
                relationOperator={relationOperator}
                previewTransaction={previewTransaction}
                setPreviewTransaction={setPreviewTransaction}
              />
            </div>
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RuleActionsForm 
                actions={actions}
                setActions={setActions}
              />
            </div>
            <div>
              <TransactionPreview 
                criteria={criteria}
                actions={actions}
                relationOperator={relationOperator}
                previewTransaction={previewTransaction}
                setPreviewTransaction={setPreviewTransaction}
              />
            </div>
          </div>
        )}
        
        {currentStep === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RuleReviewForm 
                name={name}
                description={description}
                criteria={criteria}
                actions={actions}
                relationOperator={relationOperator}
                ruleStatus={ruleStatus}
              />
            </div>
            <div>
              <TransactionPreview 
                criteria={criteria}
                actions={actions}
                relationOperator={relationOperator}
                previewTransaction={previewTransaction}
                setPreviewTransaction={setPreviewTransaction}
              />
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-2">
          {isEditMode && currentStep === 4 && (
            <Button type="button" className="bg-app-delete hover:bg-app-delete/90 text-white font-heading">
              <Trash2 size={16} className="mr-2" />
              Delete Rule
            </Button>
          )}
          <RuleFormNavigation 
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            name={name}
            criteria={criteria}
            actions={actions}
            isEditMode={isEditMode}
            onSubmit={() => {}}
          />
        </div>
      </form>
    </TooltipProvider>
  );
};

export default RuleForm;
