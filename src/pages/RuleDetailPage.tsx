import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash, Play } from 'lucide-react';
import { useRules } from '@/hooks/useRules';
import { RuleTester } from '@/components/RuleTester';
import { RuleStatus } from '@/components/RuleStatus';
import { getStatusBadgeClass } from '@/utils/rule-sort-utils';
import { PageHeader } from '@/components/ui/page-header';
import type { Rule } from '@/types/rule-types';

export function RuleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchRule, deleteRule } = useRules();
  const [rule, setRule] = useState<Rule | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadRule = async () => {
      if (!id) return;
      
      setLoading(true);
      const ruleData = await fetchRule(id);
      setRule(ruleData);
      setLoading(false);
    };
    
    loadRule();
  }, [id, fetchRule]);
  
  const handleDelete = async () => {
    if (!rule) return;
    
    if (window.confirm(`Are you sure you want to delete the rule "${rule.name}"?`)) {
      await deleteRule(rule.id);
      navigate('/rules');
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center">
          <p>Loading rule...</p>
        </div>
      </div>
    );
  }
  
  if (!rule) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center">
          <p>Rule not found</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title={rule.name}
        description={rule.description || 'No description provided'}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/rules')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button variant="outline" onClick={() => navigate(`/rules/${id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        }
      />
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rule Details</CardTitle>
              <CardDescription>
                {rule.description || 'No description provided'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Criteria</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {rule.criteria.map((criterion, index) => (
                    <li key={index}>
                      <span className="font-medium">{criterion.type}</span>
                      {' '}
                      <span>{criterion.operator}</span>
                      {' '}
                      <span className="italic">"{criterion.value}"</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Actions</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {rule.actions.map((action, index) => (
                    <li key={index}>
                      {action.type === 'category' && `Assign to category: ${action.value}`}
                      {action.type === 'flag' && `Add flag: ${action.value}`}
                      {action.type === 'memo' && `Add to memo: ${action.value}`}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Last modified: {new Date(rule.lastModified || '').toLocaleString()}</span>
                <RuleStatus status={rule.status || 'active'} />
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="test">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="test">Test Rule</TabsTrigger>
              <TabsTrigger value="history">Execution History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="test">
              <RuleTester rule={rule} />
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Execution History</CardTitle>
                  <CardDescription>
                    View the history of when this rule was applied to transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-4">
                    Execution history will be available after the rule has been applied to transactions.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Run on All Transactions
              </Button>
              
              <Button 
                className="w-full" 
                variant={rule.status === 'active' ? 'destructive' : 'default'}
                onClick={() => {
                  // This would be handled by the updateRule function
                  alert('Status toggle functionality will be implemented in the edit form');
                }}
              >
                {rule.status === 'active' ? 'Deactivate Rule' : 'Activate Rule'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
