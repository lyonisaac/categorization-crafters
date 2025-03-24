import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';
import { testRule } from '@/utils/rule-engine';
import type { Rule, PreviewTransaction } from '@/types/rule-types';
import { defaultPreviewTransaction } from '@/types/rule-types';

interface RuleTesterProps {
  rule: Rule;
}

export function RuleTester({ rule }: RuleTesterProps) {
  // State for the preview transaction
  const [transaction, setTransaction] = useState<PreviewTransaction>({
    ...defaultPreviewTransaction
  });
  
  // State for the test result
  const [testResult, setTestResult] = useState<{
    matches: boolean;
    result: any;
  } | null>(null);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle amount as a number
    if (name === 'amount') {
      setTransaction(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setTransaction(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Run the test
  const runTest = () => {
    const result = testRule(rule, transaction);
    setTestResult(result);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Test Rule</CardTitle>
        <CardDescription>
          Enter transaction details to test how this rule would process it
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="payee">Payee</Label>
            <Input
              id="payee"
              name="payee"
              value={transaction.payee}
              onChange={handleInputChange}
              placeholder="Enter payee name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              value={transaction.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={transaction.date.substring(0, 10)}
              onChange={handleInputChange}
              placeholder="Enter date"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="account">Account</Label>
            <Input
              id="account"
              name="account"
              value={transaction.account}
              onChange={handleInputChange}
              placeholder="Enter account name"
            />
          </div>
          
          <div className="col-span-2 space-y-2">
            <Label htmlFor="memo">Memo</Label>
            <Input
              id="memo"
              name="memo"
              value={transaction.memo}
              onChange={handleInputChange}
              placeholder="Enter memo text"
            />
          </div>
        </div>
        
        <Button onClick={runTest} className="w-full">
          Test Rule
        </Button>
        
        {testResult && (
          <>
            <Separator className="my-4" />
            
            <Alert variant={testResult.matches ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {testResult.matches ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <AlertTitle>
                  {testResult.matches
                    ? "Rule matches this transaction"
                    : "Rule does not match this transaction"}
                </AlertTitle>
              </div>
              <AlertDescription>
                {testResult.matches && (
                  <div className="mt-2 space-y-2">
                    <p className="font-semibold">Actions that would be applied:</p>
                    <ul className="list-disc pl-5">
                      {rule.actions.map((action, index) => (
                        <li key={index}>
                          {action.type === 'category' && `Assign to category: ${action.value}`}
                          {action.type === 'flag' && `Add flag: ${action.value}`}
                          {action.type === 'memo' && `Add to memo: ${action.value}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          This is a preview only. No changes will be made to your actual transactions.
        </p>
      </CardFooter>
    </Card>
  );
}
