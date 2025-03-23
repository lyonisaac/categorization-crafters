import React from 'react';
import { Card, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Input } from '@/components/ui';
import { Plus, Trash2, GripVertical, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Criterion, criteriaOptions, operatorOptions } from '@/types/rule-types';

interface RuleCriteriaFormProps {
  criteria: Criterion[];
  setCriteria: React.Dispatch<React.SetStateAction<Criterion[]>>;
  relationOperator: 'AND' | 'OR';
  setRelationOperator: React.Dispatch<React.SetStateAction<'AND' | 'OR'>>;
}

const RuleCriteriaForm: React.FC<RuleCriteriaFormProps> = ({
  criteria,
  setCriteria,
  relationOperator,
  setRelationOperator
}) => {
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

  return (
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
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <Input 
                        type="number" 
                        value={criterion.value} 
                        onChange={e => updateCriterion(criterion.id, 'value', e.target.value)} 
                        placeholder="Enter amount" 
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
  );
};

export default RuleCriteriaForm;
