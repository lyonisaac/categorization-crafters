import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input, Label, Card, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge } from '@/components/ui';
import { Plus, Trash2, GripVertical, CalendarIcon, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Mock data for the rule being edited (if any)
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
}, {
  value: 'split',
  label: 'Split Transaction'
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
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const isEditMode = !!id;

  // State for form data
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

  // Add a new criterion
  const addCriterion = () => {
    setCriteria([...criteria, {
      id: `new-c${criteria.length + 1}`,
      type: 'payee',
      operator: 'contains',
      value: ''
    }]);
  };

  // Remove a criterion
  const removeCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  // Update a criterion
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

  // Add a new action
  const addAction = () => {
    setActions([...actions, {
      id: `new-a${actions.length + 1}`,
      type: 'category',
      value: ''
    }]);
  };

  // Remove an action
  const removeAction = (id: string) => {
    setActions(actions.filter(a => a.id !== id));
  };

  // Update an action
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      name,
      description,
      criteria,
      actions,
      relationOperator
    });
    // In a real app, you would save the rule here
    navigate('/');
  };
  return <form onSubmit={handleSubmit} className="space-y-8 animate-slide-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          {isEditMode ? 'Edit Rule' : 'Create New Rule'}
        </h2>
        <div className="space-x-2">
          <Button type="button" variant="outline" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button type="submit" className="bg-app-blue hover:bg-app-blue/90 text-white">
            Save
          </Button>
        </div>
      </div>
      
      <Card className="glass-card">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">General Details</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Rule Name <span className="text-app-delete">*</span></Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter rule name" required className="glass-card" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter rule description (optional)" className="glass-card" />
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="glass-card">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Criteria</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button type="button" variant="outline" size="sm" className={`rounded-full px-4 ${relationOperator === 'AND' ? 'bg-app-blue text-white hover:bg-app-blue/90' : 'hover:border-app-blue'}`} onClick={() => setRelationOperator('AND')}>
                  AND
                </Button>
                <Button type="button" variant="outline" size="sm" className={`rounded-full px-4 ${relationOperator === 'OR' ? 'bg-app-blue text-white hover:bg-app-blue/90' : 'hover:border-app-blue'}`} onClick={() => setRelationOperator('OR')}>
                  OR
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {criteria.map((criterion, index) => <div key={criterion.id} className="flex items-start space-x-2 p-3 rounded-md bg-white/40 border border-gray-100 shadow-sm">
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
                        {criteriaOptions.map(option => <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <Select value={criterion.operator} onValueChange={value => updateCriterion(criterion.id, 'operator', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {(operatorOptions[criterion.type as keyof typeof operatorOptions] || []).map(option => <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="sm:col-span-5">
                    {criterion.type === 'date' ? <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal glass-card">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {criterion.value ? format(new Date(criterion.value), "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 glass-card">
                          <Calendar mode="single" selected={criterion.value ? new Date(criterion.value) : undefined} onSelect={date => updateCriterion(criterion.id, 'value', date ? date.toISOString() : '')} initialFocus className="p-3 pointer-events-auto" />
                        </PopoverContent>
                      </Popover> : criterion.type === 'amount' ? <div className="relative rounded-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <Input type="number" value={criterion.value} onChange={e => updateCriterion(criterion.id, 'value', e.target.value)} placeholder="0.00" className="pl-7 glass-card" step="0.01" />
                      </div> : <Input value={criterion.value} onChange={e => updateCriterion(criterion.id, 'value', e.target.value)} placeholder={`Enter ${criterion.type} value`} className="glass-card" />}
                  </div>
                </div>
                
                <Button type="button" variant="ghost" size="icon" onClick={() => removeCriterion(criterion.id)} className="text-gray-400 hover:text-app-delete">
                  <Trash2 size={18} />
                </Button>
              </div>)}
            
            <Button type="button" variant="outline" onClick={addCriterion} className="mt-2 glass-card hover:bg-app-blue hover:text-white">
              <Plus size={16} className="mr-2" />
              Add Criterion
            </Button>
          </div>
        </div>
      </Card>
      
      <Card className="glass-card">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Actions</h3>
          
          <div className="space-y-4">
            {actions.map((action, index) => <div key={action.id} className="flex items-start space-x-2 p-3 rounded-md bg-white/40 border border-gray-100 shadow-sm">
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
                        {actionOptions.map(option => <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="sm:col-span-7">
                    {action.type === 'category' ? <Select value={action.value} onValueChange={value => updateAction(action.id, 'value', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map(option => <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>)}
                        </SelectContent>
                      </Select> : action.type === 'flag' ? <Select value={action.value} onValueChange={value => updateAction(action.id, 'value', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select flag" />
                        </SelectTrigger>
                        <SelectContent>
                          {flagOptions.map(option => <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>)}
                        </SelectContent>
                      </Select> : <Input value={action.value} onChange={e => updateAction(action.id, 'value', e.target.value)} placeholder={`Enter ${action.type === 'memo' ? 'memo text' : 'split details'}`} className="glass-card" />}
                  </div>
                </div>
                
                <Button type="button" variant="ghost" size="icon" onClick={() => removeAction(action.id)} className="text-gray-400 hover:text-app-delete">
                  <Trash2 size={18} />
                </Button>
              </div>)}
            
            <Button type="button" variant="outline" onClick={addAction} className="mt-2 glass-card hover:bg-app-blue hover:text-white">
              <Plus size={16} className="mr-2" />
              Add Action
            </Button>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-between items-center pt-2">
        {isEditMode && <Button type="button" className="bg-app-delete hover:bg-app-delete/90 text-white">
            <Trash2 size={16} className="mr-2" />
            Delete Rule
          </Button>}
        <div className="ml-auto space-x-2">
          <Button type="button" variant="outline" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button type="submit" className="text-white bg-app-blue">
            {isEditMode ? 'Update Rule' : 'Create Rule'}
          </Button>
        </div>
      </div>
    </form>;
};
export default RuleForm;