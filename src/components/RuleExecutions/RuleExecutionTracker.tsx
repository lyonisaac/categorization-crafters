import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Loader2, BarChart2 } from 'lucide-react';

type RuleExecution = {
  id: string;
  rule_id: string;
  rule_name: string;
  executed_at: string;
  transaction_count: number;
  success_count: number;
  status: 'success' | 'partial' | 'failed';
};

export function RuleExecutionTracker() {
  const { user } = useAuth();
  const [executions, setExecutions] = useState<RuleExecution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadExecutions();
    }
  }, [user]);

  const loadExecutions = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('rule_executions')
      .select('*')
      .eq('user_id', user.id)
      .order('executed_at', { ascending: false })
      .limit(20);
      
    if (error) {
      toast({
        title: 'Error loading rule executions',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setExecutions(data || []);
    }
    
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="success" className="bg-app-success text-white">Success</Badge>;
      case 'partial':
        return <Badge variant="warning" className="bg-yellow-500 text-white">Partial</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getSuccessRate = (success: number, total: number) => {
    if (total === 0) return '0%';
    const rate = (success / total) * 100;
    return `${rate.toFixed(1)}%`;
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-app-primary" />
          <div>
            <CardTitle className="font-heading">Rule Execution History</CardTitle>
            <CardDescription>
              Track how your rules are performing over time.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-app-primary" />
            <span className="ml-2">Loading execution history...</span>
          </div>
        ) : executions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No rule executions found.</p>
            <p className="text-sm mt-2">Process some transactions to see execution history.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Rule</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {executions.map((execution) => (
                  <TableRow key={execution.id}>
                    <TableCell>{formatDate(execution.executed_at)}</TableCell>
                    <TableCell>{execution.rule_name}</TableCell>
                    <TableCell>{execution.transaction_count}</TableCell>
                    <TableCell>
                      {getSuccessRate(execution.success_count, execution.transaction_count)}
                    </TableCell>
                    <TableCell>{getStatusBadge(execution.status)}</TableCell>
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
