import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Loader2 } from 'lucide-react';

type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
  payee: string;
  category: string;
  original_category: string;
  matched_rule_id: string | null;
  matched_rule_name: string | null;
};

export function TransactionPreview() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('transaction_previews')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(50);
      
    if (error) {
      toast({
        title: 'Error loading transactions',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setTransactions(data || []);
    }
    
    setLoading(false);
  };

  const processRules = async () => {
    if (!user) return;
    
    setProcessing(true);
    
    // Trigger rule processing on the backend
    const { error } = await supabase.functions.invoke('process-rules', {
      body: { user_id: user.id },
    });
    
    if (error) {
      toast({
        title: 'Error processing rules',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Rules processed',
        description: 'Your rules have been applied to the transactions.',
      });
      
      // Reload transactions to see the changes
      await loadTransactions();
    }
    
    setProcessing(false);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="font-heading">Transaction Preview</CardTitle>
            <CardDescription>
              Preview how your rules will categorize transactions.
            </CardDescription>
          </div>
          <Button 
            onClick={processRules} 
            disabled={processing}
            className="bg-app-success hover:bg-app-success-hover"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : 'Process Rules'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-app-primary" />
            <span className="ml-2">Loading transactions...</span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions found.</p>
            <p className="text-sm mt-2">Connect your YNAB account to import transactions.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Original Category</TableHead>
                  <TableHead>New Category</TableHead>
                  <TableHead>Matched Rule</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{formatAmount(transaction.amount)}</TableCell>
                    <TableCell>{transaction.original_category}</TableCell>
                    <TableCell>
                      {transaction.category !== transaction.original_category ? (
                        <Badge variant="success" className="bg-app-success text-white">
                          {transaction.category}
                        </Badge>
                      ) : (
                        transaction.category
                      )}
                    </TableCell>
                    <TableCell>
                      {transaction.matched_rule_name ? (
                        <Badge variant="outline" className="border-app-primary text-app-primary">
                          {transaction.matched_rule_name}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
