import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';

type Category = {
  id: string;
  ynab_id: string;
  ynab_name: string;
  custom_name: string;
  group: string;
  user_id: string;
};

export function CategoryMapper() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [groups, setGroups] = useState<string[]>([]);
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user]);

  const loadCategories = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('ynab_categories')
      .select('*')
      .eq('user_id', user.id)
      .order('group', { ascending: true })
      .order('ynab_name', { ascending: true });
      
    if (error) {
      toast({
        title: 'Error loading categories',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setCategories(data || []);
      // Extract unique groups
      const uniqueGroups = [...new Set((data || []).map(cat => cat.group))];
      setGroups(uniqueGroups);
    }
    
    setLoading(false);
  };

  const toggleEditMode = (id: string) => {
    setEditMode(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const updateCategory = (id: string, field: keyof Category, value: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === id ? { ...cat, [field]: value } : cat
      )
    );
  };

  const saveCategory = async (category: Category) => {
    if (!user) return;
    
    setSaving(true);
    
    const { error } = await supabase
      .from('ynab_categories')
      .update({
        custom_name: category.custom_name,
        group: category.group
      })
      .eq('id', category.id)
      .eq('user_id', user.id);
      
    if (error) {
      toast({
        title: 'Error saving category',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Category updated',
        description: 'Your category mapping has been updated.',
      });
      toggleEditMode(category.id);
    }
    
    setSaving(false);
  };

  const addNewCategory = async () => {
    if (!user) return;
    
    const newCategory: Omit<Category, 'id'> = {
      ynab_id: '',
      ynab_name: 'New Category',
      custom_name: '',
      group: groups[0] || 'Uncategorized',
      user_id: user.id
    };
    
    const { data, error } = await supabase
      .from('ynab_categories')
      .insert(newCategory)
      .select();
      
    if (error) {
      toast({
        title: 'Error adding category',
        description: error.message,
        variant: 'destructive',
      });
    } else if (data && data[0]) {
      toast({
        title: 'Category added',
        description: 'New category has been added.',
      });
      setCategories([...categories, data[0]]);
      setEditMode(prev => ({
        ...prev,
        [data[0].id]: true
      }));
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('ynab_categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
      
    if (error) {
      toast({
        title: 'Error deleting category',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Category deleted',
        description: 'The category has been removed.',
      });
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="font-heading">Category Mapping</CardTitle>
            <CardDescription>
              Map YNAB categories to your custom categories for consistent categorization.
            </CardDescription>
          </div>
          <Button 
            onClick={addNewCategory} 
            className="bg-app-success hover:bg-app-success-hover"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-app-primary" />
            <span className="ml-2">Loading categories...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No categories found.</p>
            <p className="text-sm mt-2">Connect your YNAB account to import categories or add them manually.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>YNAB Category</TableHead>
                  <TableHead>Custom Category</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.ynab_name}</TableCell>
                    <TableCell>
                      {editMode[category.id] ? (
                        <Input
                          value={category.custom_name}
                          onChange={(e) => updateCategory(category.id, 'custom_name', e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        category.custom_name || category.ynab_name
                      )}
                    </TableCell>
                    <TableCell>
                      {editMode[category.id] ? (
                        <Select
                          value={category.group}
                          onValueChange={(value) => updateCategory(category.id, 'group', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select group" />
                          </SelectTrigger>
                          <SelectContent>
                            {groups.map((group) => (
                              <SelectItem key={group} value={group}>
                                {group}
                              </SelectItem>
                            ))}
                            <SelectItem value="new">+ Add New Group</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        category.group
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {editMode[category.id] ? (
                          <Button
                            size="sm"
                            onClick={() => saveCategory(category)}
                            disabled={saving}
                            className="bg-app-success hover:bg-app-success-hover"
                          >
                            {saving ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleEditMode(category.id)}
                          >
                            Edit
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
