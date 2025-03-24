// src/components/ynab/ApiKeyManager.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ynabApi, type YnabConnection, type YnabBudget } from '@/services/ynab-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CheckCircle, XCircle, RefreshCw, Trash2 } from 'lucide-react';

export function ApiKeyManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [budgets, setBudgets] = useState<YnabBudget[]>([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState('');
  const [connections, setConnections] = useState<YnabConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  // Load existing connections
  useEffect(() => {
    if (user) {
      loadConnections();
    }
  }, [user]);

  const loadConnections = async () => {
    setLoading(true);
    try {
      const { data, error } = await ynabApi.getConnections();
      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error('Error loading connections:', error);
      toast({
        title: 'Error',
        description: 'Failed to load YNAB connections',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an API key',
        variant: 'destructive',
      });
      return;
    }

    setValidating(true);
    setIsValid(null);
    
    try {
      const isValid = await ynabApi.validateApiKey(apiKey);
      setIsValid(isValid);
      
      if (isValid) {
        // Load budgets if API key is valid
        const { data, error } = await ynabApi.getBudgets(apiKey);
        if (error) throw error;
        setBudgets(data || []);
        
        if (data && data.length > 0) {
          setSelectedBudgetId(data[0].id);
        }
        
        toast({
          title: 'Success',
          description: 'API key is valid',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Invalid API key',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error validating API key:', error);
      setIsValid(false);
      toast({
        title: 'Error',
        description: 'Failed to validate API key',
        variant: 'destructive',
      });
    } finally {
      setValidating(false);
    }
  };

  const saveConnection = async () => {
    if (!apiKey.trim() || !selectedBudgetId) {
      toast({
        title: 'Error',
        description: 'Please enter an API key and select a budget',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await ynabApi.createConnection(apiKey, selectedBudgetId);
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'YNAB connection saved successfully',
        variant: 'default',
      });
      
      // Reset form
      setApiKey('');
      setSelectedBudgetId('');
      setBudgets([]);
      setIsValid(null);
      
      // Reload connections
      loadConnections();
    } catch (error) {
      console.error('Error saving connection:', error);
      toast({
        title: 'Error',
        description: 'Failed to save YNAB connection',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteConnection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this connection?')) {
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await ynabApi.deleteConnection(id);
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'YNAB connection deleted successfully',
        variant: 'default',
      });
      
      // Reload connections
      loadConnections();
    } catch (error) {
      console.error('Error deleting connection:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete YNAB connection',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>YNAB API Key Management</CardTitle>
          <CardDescription>
            Connect to YNAB by providing your personal API key. You can get your API key from the
            <a href="https://app.youneedabudget.com/settings/developer" target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-600 hover:underline">
              YNAB Developer Settings
            </a>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">YNAB API Key</Label>
            <div className="flex space-x-2">
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your YNAB API key"
                className="flex-1"
              />
              <Button onClick={validateApiKey} disabled={validating || !apiKey.trim()}>
                {validating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating
                  </>
                ) : (
                  'Validate'
                )}
              </Button>
            </div>
            {isValid !== null && (
              <div className="flex items-center mt-2">
                {isValid ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-green-500">Valid API key</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-red-500">Invalid API key</span>
                  </>
                )}
              </div>
            )}
          </div>

          {isValid && budgets.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="budget">Select Budget</Label>
              <Select value={selectedBudgetId} onValueChange={setSelectedBudgetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgets.map((budget) => (
                    <SelectItem key={budget.id} value={budget.id}>
                      {budget.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={saveConnection}
            disabled={loading || !isValid || !selectedBudgetId}
            className="ml-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              'Save Connection'
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Existing Connections */}
      <Card>
        <CardHeader>
          <CardTitle>Your YNAB Connections</CardTitle>
          <CardDescription>
            Manage your existing YNAB connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : connections.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No connections found. Add a new connection above.
            </div>
          ) : (
            <div className="space-y-4">
              {connections.map((connection) => (
                <div key={connection.id} className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <div className="font-medium">Budget ID: {connection.budget_id}</div>
                    <div className="text-sm text-muted-foreground">
                      Last synced: {new Date(connection.last_sync).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        // Implement refresh functionality
                        toast({
                          title: 'Info',
                          description: 'Sync functionality will be implemented in a future update',
                        });
                      }}
                      title="Sync"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteConnection(connection.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}