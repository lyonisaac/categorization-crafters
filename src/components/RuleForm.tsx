import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input, Label, Card, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge } from '@/components/ui';
import { Plus, Trash2, GripVertical, CalendarIcon, Check, X, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import RuleStatus from '@/components/RuleStatus';

const mockRule = {
  id: '1',
  name: 'Grocery Stores',
  description: 'Automatically categorize grocery purchases',
  criteria: [{
    id: 'c1',
    type: 'payee',
    operator: 'contains',
    value: 'Kroger'
  }, {
    id: 'c2',
    type: 'payee',
    operator: 'contains',
    value: 'Walmart'
  }, {
    id: 'c3',
    type: 'payee',
    operator: 'contains',
    value: 'Trader Joe\'s'
  }],
  actions: [{
    id: 'a1',
    type: 'category',
    value: 'Groceries'
  }]
};

const criteriaOptions = [{
  value: 'payee',
  label: 'Payee'
}, {
  value: 'memo',
  label: 'Memo Content'
}, {
  value: 'amount',
  label: 'Transaction Amount'
}, {
  value: 'date',
  label: 'Transaction Date'
}, {
  value: 'account',
  label: 'Account Name/Type'
}];
const operatorOptions = {
  payee: [{
    value: 'contains',
    label: 'Contains'
  }, {
    value: 'equals',
    label: 'Equals'
  }, {
    value: 'starts_with',
    label: 'Starts With'
  }, {
    value: 'ends_with',
    label: 'Ends With'
  }],
  memo: [{
    value: 'contains',
    label: 'Contains'
  }, {
    value: 'equals',
    label: 'Equals'
  }, {
    value: 'starts_with',
    label: 'Starts With'
  }, {
    value: 'ends_with',
    label: 'Ends With'
  }],
  amount: [{
    value: 'equals',
    label: 'Equals'
  }, {
    value: 'greater_than',
    label: 'Greater Than'
  }, {
    value: 'less_than',
    label: 'Less Than'
  }, {
    value: 'between',
    label: 'Between'
  }],
  date: [{
    value: 'equals',
    label: 'Equals'
  }, {
    value: 'after',
    label: 'After'
  }, {
    value: 'before',
    label: 'Before'
  }, {
    value: 'between',
    label: 'Between'
  }],
  account: [{
    value: 'equals',
    label: 'Equals'
  }, {
    value: 'contains',
    label: 'Contains'
  }]
};
const actionOptions = [{
  value: 'category',
  label: 'Assign Category'
}, {
  value: 'flag',
  label: 'Add Flag'
}, {
  value: 'memo',
  label: 'Modify Memo'
}];
const categoryOptions = [{
  value: 'groceries',
  label: 'Groceries'
}, {
  value: 'dining',
  label: 'Dining Out'
}, {
  value: 'utilities',
  label: 'Utilities'
}, {
  value: 'income',
  label: 'Income'
}, {
  value: 'subscriptions',
  label: 'Subscriptions'
}];
const flagOptions = [{
  value: 'income',
  label: 'Income'
}, {
  value: 'review',
  label: 'Need Review'
}, {
  value: 'important',
  label: 'Important'
}];

const RuleForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string; }>();
  const isEditMode = !!id;

  const [name, setName] = useState(isEditMode ? mockRule.name : '');
  const [description, setDescription] = useState(isEditMode ? mockRule.description : '');
  const [criteria, setCriteria] = useState(isEditMode ? mockRule.criteria : [{
    id: 'new-c1',
    type: 'payee',
    operator: 'contains',
    value: ''
  }]);
  const [actions, setActions] = useState(isEditMode ? mockRule.actions : [{
    id: 'new-a1',
    type: 'category',
    value: ''
  }]);
  const [relationOperator, setRelationOperator] = useState<'AND' | 'OR'>('AND');
  const [currentStep, setCurrentStep] = useState(1);
  const [previewTransaction, setPreviewTransaction] = useState({
    payee: 'Sample Store',
    memo: 'Purchase reference #12345',
    amount: 42.99,
    date: new Date().toISOString(),
    account: 'Checking Account'
  });
  const [ruleStatus, setRuleStatus] = useState<'active' | 'inactive'>('active');

  const addCriterion = () => {
    setCriteria([...criteria, {
      id: `new-c${criteria.length + 1}`,
      type: 'payee',
      operator: 'contains',
      value: ''
    }]);
  };

  const removeCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const updateCriterion = (id: string, field: string, value: string) => {
    setCriteria(criteria.map(c => {
      if (c.id === id) {
        return {
          ...c,
          [field]: value
        };
      }
      return c;
    }));
  };

  const addAction = () => {
    setActions([...actions, {
      id: `new-a${actions.length + 1}`,
      type: 'category',
      value: ''
    }]);
  };

  const removeAction = (id: string) => {
    setActions(actions.filter(a => a.id !== id));
  };

  const updateAction = (id: string, field: string, value: string) => {
    setActions(actions.map(a => {
      if (a.id === id) {
        return {
          ...a,
          [field]: value
        };
      }
      return a;
    }));
  };

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

  const wouldRuleMatch = () => {
    if (criteria.length === 0) return false;
    
    const matches = criteria.map(c => {
      switch(c.type) {
        case 'payee':
          if (c.operator === 'contains') 
            return previewTransaction.payee.toLowerCase().includes((c.value || '').toLowerCase());
          if (c.operator === 'equals')
            return previewTransaction.payee.toLowerCase() === (c.value || '').toLowerCase();
          return false;
        case 'memo':
          if (c.operator === 'contains') 
            return previewTransaction.memo.toLowerCase().includes((c.value || '').toLowerCase());
          return false;
        case 'amount':
          if (c.operator === 'equals') 
            return previewTransaction.amount === parseFloat(c.value || '0');
          if (c.operator === 'greater_than')
            return previewTransaction.amount > parseFloat(c.value || '0');
          if (c.operator === 'less_than')
            return previewTransaction.amount < parseFloat(c.value || '0');
          return false;
        default:
          return false;
      }
    });
    
    return relationOperator === 'AND' 
      ? matches.every(m => m) 
      : matches.some(m => m);
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
    const isStepComplete = () => {
      if (currentStep === 1) return name.trim() !== '';
      if (currentStep === 2) return criteria.length > 0 && criteria.every(c => c.value !== '');
      return true;
    };

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

  const StepIndicator = () => {
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

  const TransactionPreview = () => {
    const matched = wouldRuleMatch();
    const hasActions = actions.length > 0 && actions.every(a => a.value !== '');
    
    return (
      <Card className="glass-card bg-white/30 p-4 border border-white/40 shadow-sm transition-all duration-300">
        <h3 className="text-lg font-heading font-medium mb-3 flex items-center gap-2">
          <Info size={18} />
          Sample Transaction
        </h3>
        
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground font-body">Payee</Label>
              <Input 
                value={previewTransaction.payee} 
                onChange={(e) => setPreviewTransaction({...previewTransaction, payee: e.target.value})}
                className="mt-1 text-sm" 
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground font-body">Amount</Label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <Input 
                  type="number"
                  value={previewTransaction.amount}
                  onChange={(e) => setPreviewTransaction({...previewTransaction, amount: parseFloat(e.target.value)})}
                  className="pl-7 text-sm"
                  step="0.01"
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label className="text-xs text-muted-foreground font-body">Memo</Label>
            <Input 
              value={previewTransaction.memo} 
              onChange={(e) => setPreviewTransaction({...previewTransaction, memo: e.target.value})}
              className="mt-1 text-sm" 
            />
          </div>
        </div>
        
        <div className="rounded-md p-3 flex gap-2 items-center mt-4 border bg-white/60">
          <div className={`rounded-full w-3 h-3 ${matched ? 'bg-app-success' : 'bg-app-warning'}`}></div>
          <div>
            <p className="text-sm font-medium">
              {matched ? 'Rule matches this transaction' : 'Rule does not match this transaction'}
            </p>
            <p className="text-xs text-muted-foreground">
              {matched && hasActions 
                ? 'Actions would be applied' 
                : matched && !hasActions 
                  ? 'No actions defined yet' 
                  : 'Adjust criteria to match'
              }
            </p>
          </div>
        </div>
      </Card>
    );
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
        
        <StepIndicator />
        
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
                        <div className="flex space-x-4 mt-1">
                          <div 
                            className={`cursor-pointer rounded-md px-4 py-2 flex items-center gap-2 transition-all ${
                              ruleStatus === 'active' 
                                ? 'bg-app-success/20 border border-app-success/30' 
                                : 'bg-white/40 border border-gray-200 hover:bg-white/60'
                            }`}
                            onClick={() => setRuleStatus('active')}
                          >
                            <Check size={16} className={ruleStatus === 'active' ? 'text-app-success' : 'text-gray-400'} />
                            <span className="font-body text-sm">Active</span>
                          </div>
                          <div 
                            className={`cursor-pointer rounded-md px-4 py-2 flex items-center gap-2 transition-all ${
                              ruleStatus === 'inactive' 
                                ? 'bg-app-warning/20 border border-app-warning/30' 
                                : 'bg-white/40 border border-gray-200 hover:bg-white/60'
                            }`}
                            onClick={() => setRuleStatus('inactive')}
                          >
                            <X size={16} className={ruleStatus === 'inactive' ? 'text-app-warning' : 'text-gray-400'} />
                            <span className="font-body text-sm">Inactive</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <div>
              <TransactionPreview />
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-heading font-medium">Criteria</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className={`rounded-full px-4 font-heading ${relationOperator === 'AND' ? 'bg-app-blue text-white hover:bg-app-blue/90' : 'hover:border-app-blue'}`} 
                          onClick={() => setRelationOperator('AND')}
                        >
                          AND
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className={`rounded-full px-4 font-heading ${relationOperator === 'OR' ? 'bg-app-blue text-white hover:bg-app-blue/90' : 'hover:border-app-blue'}`} 
                          onClick={() => setRelationOperator('OR')}
                        >
                          OR
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {criteria.map((criterion, index) => (
                      <div key={criterion.id} className="flex items-start space-x-2 p-3 rounded-md bg-white/40 border border-gray-100 shadow-sm">
                        <div className="text-gray-400 mt-2.5">
                          <GripVertical size={18} />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 flex-1">
                          <div className="sm:col-span-3">
                            <Select value={criterion.type} onValueChange={value => updateCriterion(criterion.id, 'type', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {criteriaOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="sm:col-span-3">
                            <Select value={criterion.operator} onValueChange={value => updateCriterion(criterion.id, 'operator', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select operator" />
                              </SelectTrigger>
                              <SelectContent>
                                {(operatorOptions[criterion.type as keyof typeof operatorOptions] || []).map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="sm:col-span-5">
                            {criterion.type === 'date' ? (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" className="w-full justify-start text-left font-normal glass-card">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {criterion.value ? format(new Date(criterion.value), "PPP") : <span>Pick a date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 glass-card">
                                  <Calendar 
                                    mode="single" 
                                    selected={criterion.value ? new Date(criterion.value) : undefined} 
                                    onSelect={date => updateCriterion(criterion.id, 'value', date ? date.toISOString() : '')} 
                                    initialFocus 
                                    className="p-3 pointer-events-auto" 
                                  />
                                </PopoverContent>
                              </Popover>
                            ) : criterion.type === 'amount' ? (
                              <div className="relative rounded-md">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                  <span className="text-gray-500 sm:text-sm">$</span>
                                </div>
                                <Input 
                                  type="number" 
                                  value={criterion.value} 
                                  onChange={e => updateCriterion(criterion.id, 'value', e.target.value)} 
                                  placeholder="0.00" 
                                  className="pl-7 glass-card" 
                                  step="0.01" 
                                />
                              </div>
                            ) : (
                              <Input 
                                value={criterion.value} 
                                onChange={e => updateCriterion(criterion.id, 'value', e.target.value)} 
                                placeholder={`Enter ${criterion.type} value`} 
                                className="glass-card" 
                              />
                            )}
                          </div>
                        </div>
                        
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeCriterion(criterion.id)} 
                          className="text-gray-400 hover:text-app-delete"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    ))}
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addCriterion} 
                      className="mt-2 glass-card font-heading hover:bg-app-success hover:text-white hover:border-app-success"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Criterion
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            <div>
              <TransactionPreview />
            </div>
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <div className="p-6">
                  <h3 className="text-lg font-heading font-medium mb-4">Actions</h3>
                  
                  <div className="space-y-4">
                    {actions.map((action, index) => (
                      <div key={action.id} className="flex items-start space-x-2 p-3 rounded-md bg-white/40 border border-gray-100 shadow-sm">
                        <div className="text-gray-400 mt-2.5">
                          <GripVertical size={18} />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 flex-1">
                          <div className="sm:col-span-4">
                            <Select value={action.type} onValueChange={value => updateAction(action.id, 'type', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select action type" />
                              </SelectTrigger>
                              <SelectContent>
                                {actionOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="sm:col-span-7">
                            {action.type === 'category' ? (
                              <Select value={action.value} onValueChange={value => updateAction(action.id, 'value', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categoryOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : action.type === 'flag' ? (
                              <Select value={action.value} onValueChange={value => updateAction(action.id, 'value', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select flag" />
                                </SelectTrigger>
                                <SelectContent>
                                  {flagOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input 
                                value={action.value} 
                                onChange={e => updateAction(action.id, 'value', e.target.value)} 
                                placeholder="Enter memo text" 
                                className="glass-card" 
                              />
                            )}
                          </div>
                        </div>
                        
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeAction(action.id)} 
                          className="text-gray-400 hover:text-app-delete"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    ))}
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addAction} 
                      className="mt-2 glass-card font-heading hover:bg-app-success hover:text-white hover:border-app-success"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Action
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            <div>
              <TransactionPreview />
            </div>
          </div>
        )}
        
        {currentStep === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <div className="p-6">
                  <h3 className="text-lg font-heading font-medium mb-4">Review Your Rule</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="font-heading font-medium">General Details</h4>
                      <div className="bg-white/40 rounded-md p-4 space-y-2">
                        <div className="flex">
                          <span className="w-32 text-muted-foreground text-sm font-body">Name:</span>
                          <span className="font-medium">{name}</span>
                        </div>
                        {description && (
                          <div className="flex">
                            <span className="w-32 text-muted-foreground text-sm font-body">Description:</span>
                            <span>{description}</span>
                          </div>
                        )}
                        <div className="flex">
                          <span className="w-32 text-muted-foreground text-sm font-body">Status:</span>
                          <span className={ruleStatus === 'active' ? 'text-app-success font-medium' : 'text-app-warning font-medium'}>
                            {ruleStatus === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-heading font-medium">Criteria</h4>
                      <div className="bg-white/40 rounded-md p-4">
                        {criteria.length > 0 ? (
                          <div className="space-y-2">
                            {criteria.map((c, i) => (
                              <div key={c.id} className="flex items-center">
                                {i > 0 && (
                                  <span className="mx-2 px-2 py-0.5 rounded bg-app-blue/10 text-app-blue text-xs font-body">
                                    {relationOperator}
                                  </span>
                                )}
                                <span className="bg-white/70 rounded-md px-3 py-1.5 text-sm">
                                  {criteriaOptions.find(opt => opt.value === c.type)?.label} 
                                  {' '}
                                  {operatorOptions[c.type as keyof typeof operatorOptions]?.find(opt => opt.value === c.operator)?.label}
                                  {' '}
                                  "{c.value}"
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground italic text-sm font-body">No criteria defined</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-heading font-medium">Actions</h4>
                      <div className="bg-white/40 rounded-md p-4">
                        {actions.length > 0 ? (
                          <div className="space-y-2">
                            {actions.map((a) => (
                              <div key={a.id} className="bg-white/70 rounded-md px-3 py-1.5 text-sm">
                                {actionOptions.find(opt => opt.value === a.type)?.label}:
                                {' '}
                                {a.type === 'category' && categoryOptions.find(opt => opt.value === a.value)?.label}
                                {a.type === 'flag' && flagOptions.find(opt => opt.value === a.value)?.label}
                                {a.type === 'memo' && `"${a.value}"`}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground italic text-sm font-body">No actions defined</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <div>
              <TransactionPreview />
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
          <div className="flex items-center gap-3 ml-auto">
            {currentStep > 1 && <PrevStepButton />}
            {currentStep < 4 && <NextStepButton />}
            {currentStep === 4 && (
              <Button 
                type="submit" 
                className="h-10 font-heading flex items-center gap-2 px-3 bg-app-success hover:bg-app-success/90"
              >
                {isEditMode ? 'Update Rule' : 'Create Rule'}
                <ArrowRight size={16} />
              </Button>
            )}
          </div>
        </div>
      </form>
    </TooltipProvider>
  );
};

export default RuleForm;
