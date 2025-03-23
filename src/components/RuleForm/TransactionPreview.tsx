import React from 'react';
import { Card, Label, Input, Badge } from '@/components/ui';
import { Info } from 'lucide-react';
import { Criterion, Action, PreviewTransaction } from '@/types/rule-types';

interface TransactionPreviewProps {
  criteria: Criterion[];
  actions: Action[];
  relationOperator: 'AND' | 'OR';
  previewTransaction: PreviewTransaction;
  setPreviewTransaction: React.Dispatch<React.SetStateAction<PreviewTransaction>>;
}

const TransactionPreview: React.FC<TransactionPreviewProps> = ({
  criteria,
  actions,
  relationOperator,
  previewTransaction,
  setPreviewTransaction
}) => {
  const wouldRuleMatch = (): boolean => {
    if (criteria.length === 0) return false;
    
    const matches = criteria.map(c => {
      switch(c.type) {
        case 'payee':
          if (c.operator === 'contains') 
            return previewTransaction.payee.toLowerCase().includes((c.value || '').toLowerCase());
          if (c.operator === 'equals')
            return previewTransaction.payee.toLowerCase() === (c.value || '').toLowerCase();
          if (c.operator === 'starts_with')
            return previewTransaction.payee.toLowerCase().startsWith((c.value || '').toLowerCase());
          if (c.operator === 'ends_with')
            return previewTransaction.payee.toLowerCase().endsWith((c.value || '').toLowerCase());
          return false;
        case 'memo':
          if (c.operator === 'contains') 
            return previewTransaction.memo.toLowerCase().includes((c.value || '').toLowerCase());
          if (c.operator === 'equals')
            return previewTransaction.memo.toLowerCase() === (c.value || '').toLowerCase();
          if (c.operator === 'starts_with')
            return previewTransaction.memo.toLowerCase().startsWith((c.value || '').toLowerCase());
          if (c.operator === 'ends_with')
            return previewTransaction.memo.toLowerCase().endsWith((c.value || '').toLowerCase());
          return false;
        case 'amount':
          if (c.operator === 'equals') 
            return previewTransaction.amount === parseFloat(c.value || '0');
          if (c.operator === 'greater_than')
            return previewTransaction.amount > parseFloat(c.value || '0');
          if (c.operator === 'less_than')
            return previewTransaction.amount < parseFloat(c.value || '0');
          return false;
        case 'account':
          if (c.operator === 'contains')
            return previewTransaction.account.toLowerCase().includes((c.value || '').toLowerCase());
          if (c.operator === 'equals')
            return previewTransaction.account.toLowerCase() === (c.value || '').toLowerCase();
          return false;
        default:
          return false;
      }
    });
    
    return relationOperator === 'AND' 
      ? matches.every(m => m) 
      : matches.some(m => m);
  };

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

export default TransactionPreview;
