import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useRules } from '@/hooks/useRules';
import { RulesTable } from '@/components/RulesTable';
import { RuleImportExport } from '@/components/RuleImportExport';
import { PageHeader } from '@/components/ui/page-header';

export function RulesPage() {
  const navigate = useNavigate();
  const { rules, loading, error } = useRules();
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter rules based on active tab
  const filteredRules = rules.filter(rule => {
    if (activeTab === 'all') return true;
    return rule.status === activeTab;
  });
  
  // Count rules by status
  const ruleCounts = {
    all: rules.length,
    active: rules.filter(rule => rule.status === 'active').length,
    inactive: rules.filter(rule => rule.status === 'inactive').length,
    pending: rules.filter(rule => rule.status === 'pending').length
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center">
          <p>Loading rules...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center">
          <p className="text-red-500">Error loading rules: {error.message}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Categorization Rules"
        description="Manage your transaction categorization rules"
        actions={
          <Button 
            onClick={() => navigate('/rules/new')}
            className="bg-app-success hover:bg-app-success/90 text-white font-heading"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Rule
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Rules</CardTitle>
            <CardDescription>
              Manage your transaction categorization rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="all" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">
                  All ({ruleCounts.all})
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active ({ruleCounts.active})
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  Inactive ({ruleCounts.inactive})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({ruleCounts.pending})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                {filteredRules.length > 0 ? (
                  <RulesTable rules={filteredRules} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground mb-4">No rules found</p>
                    <Button onClick={() => navigate('/rules/new')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Rule
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <RuleImportExport />
          
          <Card>
            <CardHeader>
              <CardTitle>Rule Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Rules:</span>
                  <span className="font-medium">{ruleCounts.all}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Rules:</span>
                  <span className="font-medium">{ruleCounts.active}</span>
                </div>
                <div className="flex justify-between">
                  <span>Inactive Rules:</span>
                  <span className="font-medium">{ruleCounts.inactive}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Rules:</span>
                  <span className="font-medium">{ruleCounts.pending}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
