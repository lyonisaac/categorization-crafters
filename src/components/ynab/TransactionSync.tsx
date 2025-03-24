import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, RefreshCw, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ynabApi, YnabTransaction, YnabAccount, YnabConnection } from '@/services/ynab-api';

export function TransactionSync() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<YnabTransaction[]>([]);
  const [accounts, setAccounts] = useState<YnabAccount[]>([]);
  const [connections, setConnections] = useState<YnabConnection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<YnabConnection | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [syncDate, setSyncDate] = useState<Date | undefined>(new Date());
  const [syncing, setSyncing] = useState(false);

  // Fetch connections on component mount
  useEffect(() => {
    async function fetchConnections() {
      setLoading(true);
      try {
        const { data, error } = await ynabApi.getConnections();
        if (error) throw error;
        
        if (data && data.length > 0) {
          setConnections(data);
          setSelectedConnection(data[0]);
        } else {
          setError('No YNAB connections found. Please add a connection first.');
        }
      } catch (err) {
        setError('Failed to fetch YNAB connections. Please try again.');
        console.error('Error fetching connections:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchConnections();
  }, []);

  // Fetch accounts when a connection is selected
  useEffect(() => {
    async function fetchAccounts() {
      if (!selectedConnection) return;
      
      setLoading(true);
      try {
        const { data, error } = await ynabApi.getAccounts(
          selectedConnection.budget_id, 
          selectedConnection.access_token
        );
        
        if (error) throw error;
        
        if (data) {
          // Filter out deleted and closed accounts
          const activeAccounts = data.filter(account => !account.deleted && !account.closed);
          setAccounts(activeAccounts);
          
          if (activeAccounts.length > 0) {
            setSelectedAccount(activeAccounts[0].id);
          }
        }
      } catch (err) {
        setError('Failed to fetch accounts. Please check your YNAB connection.');
        console.error('Error fetching accounts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();
  }, [selectedConnection]);

  // Fetch transactions when account is selected
  useEffect(() => {
    async function fetchTransactions() {
      if (!selectedConnection || !selectedAccount) return;
      
      setLoading(true);
      try {
        // Format date as YYYY-MM-DD
        const formattedDate = syncDate 
          ? format(syncDate, 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd');
        
        const { data, error } = await ynabApi.getTransactions(
          selectedConnection.budget_id,
          selectedConnection.access_token,
          {
            sinceDate: formattedDate,
            accountId: selectedAccount
          }
        );
        
        if (error) throw error;
        
        if (data) {
          // Sort transactions by date (newest first)
          const sortedTransactions = [...data].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setTransactions(sortedTransactions);
        }
      } catch (err) {
        setError('Failed to fetch transactions. Please try again.');
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [selectedConnection, selectedAccount, syncDate]);

  // Handle connection change
  const handleConnectionChange = (connectionId: string) => {
    const connection = connections.find(conn => conn.id === connectionId);
    if (connection) {
      setSelectedConnection(connection);
    }
  };

  // Handle account change
  const handleAccountChange = (accountId: string) => {
    setSelectedAccount(accountId);
  };

  // Handle sync
  const handleSync = async () => {
    if (!selectedConnection) return;
    
    setSyncing(true);
    try {
      const { data, error } = await ynabApi.syncBudgetData(
        selectedConnection.budget_id,
        selectedConnection.access_token
      );
      
      if (error) throw error;
      
      // Refresh transactions
      if (selectedAccount) {
        const formattedDate = syncDate 
          ? format(syncDate, 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd');
        
        const { data: transactionData, error: transactionError } = await ynabApi.getTransactions(
          selectedConnection.budget_id,
          selectedConnection.access_token,
          {
            sinceDate: formattedDate,
            accountId: selectedAccount
          }
        );
        
        if (transactionError) throw transactionError;
        
        if (transactionData) {
          // Sort transactions by date (newest first)
          const sortedTransactions = [...transactionData].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setTransactions(sortedTransactions);
        }
      }
    } catch (err) {
      setError('Failed to sync budget data. Please try again.');
      console.error('Error syncing budget data:', err);
    } finally {
      setSyncing(false);
    }
  };

  // Format currency amount (YNAB stores amounts in milliunits)
  const formatAmount = (amount: number) => {
    const dollars = amount / 1000;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(dollars);
  };

  // Format transaction date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Get account name by ID
  const getAccountName = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.name : 'Unknown Account';
  };

  if (loading && !transactions.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Loading your transaction data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>
          View and manage your YNAB transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Budget Selection */}
            {connections.length > 0 && (
              <Select 
                value={selectedConnection?.id} 
                onValueChange={handleConnectionChange}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select Budget" />
                </SelectTrigger>
                <SelectContent>
                  {connections.map(connection => (
                    <SelectItem key={connection.id} value={connection.id}>
                      {connection.budget_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Account Selection */}
            {accounts.length > 0 && (
              <Select 
                value={selectedAccount || ''} 
                onValueChange={handleAccountChange}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-[200px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {syncDate ? format(syncDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={syncDate}
                  onSelect={setSyncDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Sync Button */}
            <Button 
              onClick={handleSync} 
              disabled={syncing || !selectedConnection}
              className="w-full sm:w-auto"
            >
              {syncing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync Data
                </>
              )}
            </Button>
          </div>

          {/* Transactions Table */}
          {transactions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Payee</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Memo</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{transaction.payee_name || 'Unknown'}</TableCell>
                      <TableCell>{transaction.category_name || 'Uncategorized'}</TableCell>
                      <TableCell>{transaction.memo || '-'}</TableCell>
                      <TableCell className="text-right font-medium">
                        <span className={transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}>
                          {formatAmount(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={transaction.cleared === 'cleared' ? 'default' : 'outline'}>
                          {transaction.cleared === 'cleared' ? 'Cleared' : 'Uncleared'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 text-center">
              <div>
                <p className="text-muted-foreground">No transactions found for the selected criteria.</p>
                <p className="text-sm text-muted-foreground mt-1">Try changing the date range or account.</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          {transactions.length > 0 
            ? `Showing ${transactions.length} transactions since ${syncDate ? format(syncDate, 'MMM d, yyyy') : 'the beginning'}`
            : 'No transactions to display'}
        </p>
        {selectedConnection && (
          <p className="text-sm text-muted-foreground">
            Last synced: {selectedConnection.last_sync 
              ? format(new Date(selectedConnection.last_sync), 'MMM d, yyyy h:mm a')
              : 'Never'}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
