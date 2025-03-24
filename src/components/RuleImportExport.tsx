import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { downloadRulesExport, importRulesFromFile, saveImportedRules } from '@/utils/rule-import-export';
import type { Rule } from '@/types/rule-types';
import { useRules } from '@/hooks/useRules';

export function RuleImportExport() {
  const { rules, fetchRules } = useRules();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState<string>('');
  const [importedRules, setImportedRules] = useState<Omit<Rule, 'id'>[]>([]);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setImportStatus('idle');
      setImportMessage('');
    }
  };
  
  // Handle export
  const handleExport = () => {
    if (rules.length === 0) {
      setImportStatus('error');
      setImportMessage('No rules to export');
      return;
    }
    
    downloadRulesExport(rules);
  };
  
  // Handle import
  const handleImport = async () => {
    if (!selectedFile) {
      setImportStatus('error');
      setImportMessage('Please select a file to import');
      return;
    }
    
    setImportStatus('loading');
    setImportMessage('Importing rules...');
    
    try {
      const importedRules = await importRulesFromFile(selectedFile);
      
      if (!importedRules) {
        setImportStatus('error');
        setImportMessage('Invalid rule file format');
        return;
      }
      
      setImportedRules(importedRules);
      setImportStatus('success');
      setImportMessage(`Successfully parsed ${importedRules.length} rules`);
    } catch (error) {
      setImportStatus('error');
      setImportMessage('Error importing rules');
      console.error('Error importing rules:', error);
    }
  };
  
  // Handle save imported rules
  const handleSaveImport = async () => {
    if (importedRules.length === 0) {
      return;
    }
    
    setImportStatus('loading');
    setImportMessage('Saving rules...');
    
    try {
      await saveImportedRules(importedRules);
      setImportStatus('success');
      setImportMessage(`Successfully saved ${importedRules.length} rules`);
      setImportedRules([]);
      setSelectedFile(null);
      
      // Refresh rules list
      fetchRules();
    } catch (error) {
      setImportStatus('error');
      setImportMessage('Error saving rules');
      console.error('Error saving rules:', error);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import and Export Rules</CardTitle>
        <CardDescription>
          Share your rules with others or backup your rules
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>
          
          <TabsContent value="export" className="space-y-4">
            <div className="space-y-2">
              <p>Export all your rules to a JSON file that can be imported later or shared with others.</p>
              <Button 
                onClick={handleExport} 
                className="w-full"
                disabled={rules.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Rules ({rules.length})
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="import" className="space-y-4">
            <div className="space-y-2">
              <p>Import rules from a JSON file. The file should be in the same format as exported rules.</p>
              
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Button 
                  onClick={handleImport} 
                  disabled={!selectedFile || importStatus === 'loading'}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Parse
                </Button>
              </div>
              
              {importStatus !== 'idle' && (
                <Alert variant={importStatus === 'error' ? 'destructive' : 'default'}>
                  <div className="flex items-center gap-2">
                    {importStatus === 'error' ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : importStatus === 'success' ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : null}
                    <AlertTitle>
                      {importStatus === 'error' ? 'Error' : 'Success'}
                    </AlertTitle>
                  </div>
                  <AlertDescription>{importMessage}</AlertDescription>
                </Alert>
              )}
              
              {importedRules.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h3 className="text-lg font-medium">Imported Rules</h3>
                  <ul className="list-disc pl-5">
                    {importedRules.map((rule, index) => (
                      <li key={index}>{rule.name}</li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={handleSaveImport} 
                    className="w-full"
                    disabled={importStatus === 'loading'}
                  >
                    Save {importedRules.length} Rules
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Imported rules will be added to your existing rules. Duplicate rules will be created if rules with the same name already exist.
        </p>
      </CardFooter>
    </Card>
  );
}
