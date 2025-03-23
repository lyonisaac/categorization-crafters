import React from 'react';
import { Card } from '@/components/ui';
import { Criterion, Action, criteriaOptions, operatorOptions, actionOptions, categoryOptions, flagOptions } from '@/types/rule-types';

interface RuleReviewFormProps {
  name: string;
  description: string;
  criteria: Criterion[];
  actions: Action[];
  relationOperator: 'AND' | 'OR';
  ruleStatus: 'active' | 'inactive';
}

const RuleReviewForm: React.FC<RuleReviewFormProps> = ({
  name,
  description,
  criteria,
  actions,
  relationOperator,
  ruleStatus
}) => {
  return (
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
  );
};

export default RuleReviewForm;
