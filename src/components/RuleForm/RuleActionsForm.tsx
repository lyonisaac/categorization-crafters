import React from 'react';
import { Card, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Input } from '@/components/ui';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Action, actionOptions, categoryOptions, flagOptions } from '@/types/rule-types';

interface RuleActionsFormProps {
  actions: Action[];
  setActions: React.Dispatch<React.SetStateAction<Action[]>>;
}

const RuleActionsForm: React.FC<RuleActionsFormProps> = ({
  actions,
  setActions
}) => {
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

  return (
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
  );
};

export default RuleActionsForm;
