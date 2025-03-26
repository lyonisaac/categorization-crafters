import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase-types';

// Type definitions for API responses
type ApiResponse<T> = {
  data: T | null;
  error: Error | null;
};

// YNAB Connection type
export type YnabConnection = Database['public']['Tables']['ynab_connections']['Row'];

// YNAB Category type
export type YnabCategory = Database['public']['Tables']['ynab_categories']['Row'];

// YNAB Budget type
export type YnabBudget = {
  id: string;
  name: string;
  last_modified_on: string;
  first_month: string;
  last_month: string;
};

// YNAB API service
export const ynabApi = {
  // Get all YNAB connections for the current user
  async getConnections(): Promise<ApiResponse<YnabConnection[]>> {
    try {
      const { data, error } = await supabase
        .from('ynab_connections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching YNAB connections:', error);
      return { data: null, error: error as Error };
    }
  },

  // Get a single YNAB connection by ID
  async getConnection(id: string): Promise<ApiResponse<YnabConnection>> {
    try {
      const { data, error } = await supabase
        .from('ynab_connections')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error(`Error fetching YNAB connection ${id}:`, error);
      return { data: null, error: error as Error };
    }
  },

  // Create a new YNAB connection with API key
  async createConnection(apiKey: string, budgetId: string): Promise<ApiResponse<YnabConnection>> {
    try {
      // Validate the API key by making a test request to YNAB
      const isValid = await this.validateApiKey(apiKey);
      if (!isValid) {
        throw new Error('Invalid YNAB API key');
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from('ynab_connections')
        .insert({
          user_id: userData.user?.id,
          budget_id: budgetId,
          access_token: apiKey, // Store API key in access_token field
          last_sync: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error creating YNAB connection:', error);
      return { data: null, error: error as Error };
    }
  },

  // Update an existing YNAB connection
  async updateConnection(id: string, apiKey?: string, budgetId?: string): Promise<ApiResponse<YnabConnection>> {
    try {
      // If API key is provided, validate it
      if (apiKey) {
        const isValid = await this.validateApiKey(apiKey);
        if (!isValid) {
          throw new Error('Invalid YNAB API key');
        }
      }

      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (apiKey) updateData.access_token = apiKey;
      if (budgetId) updateData.budget_id = budgetId;

      const { data, error } = await supabase
        .from('ynab_connections')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error(`Error updating YNAB connection ${id}:`, error);
      return { data: null, error: error as Error };
    }
  },

  // Delete a YNAB connection
  async deleteConnection(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('ynab_connections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { data: true, error: null };
    } catch (error) {
      console.error(`Error deleting YNAB connection ${id}:`, error);
      return { data: null, error: error as Error };
    }
  },

  // Get all budgets using the API key
  async getBudgets(apiKey: string): Promise<ApiResponse<YnabBudget[]>> {
    try {
      const response = await fetch('https://api.youneedabudget.com/v1/budgets', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch budgets: ${response.statusText}`);
      }

      const data = await response.json();
      return { data: data.data.budgets, error: null };
    } catch (error) {
      console.error('Error fetching budgets:', error);
      return { data: null, error: error as Error };
    }
  },

  // Validate an API key
  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.youneedabudget.com/v1/user', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error validating API key:', error);
      return false;
    }
  },

  // Get all categories for a specific budget
  async getCategories(budgetId: string, apiKey: string): Promise<ApiResponse<YnabCategory[]>> {
    try {
      // First check if we have categories stored in the database
      const { data: storedCategories, error: fetchError } = await supabase
        .from('ynab_categories')
        .select('*')
        .eq('budget_id', budgetId);

      if (fetchError) throw fetchError;

      // If we have categories, return them
      if (storedCategories && storedCategories.length > 0) {
        return { data: storedCategories, error: null };
      }

      // Otherwise, fetch from YNAB API and store
      const response = await fetch(`https://api.youneedabudget.com/v1/budgets/${budgetId}/categories`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const data = await response.json();
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      // Process and store categories
      const categories = [];
      for (const group of data.data.category_groups) {
        for (const category of group.categories) {
          const categoryData = {
            user_id: userId,
            budget_id: budgetId,
            ynab_category_id: category.id,
            name: category.name,
            parent_category_id: group.id,
            is_hidden: category.hidden
          };

          // Insert into database
          await supabase.from('ynab_categories').insert(categoryData);
          categories.push(categoryData as YnabCategory);
        }
      }

      return { data: categories, error: null };
    } catch (error) {
      console.error(`Error fetching categories for budget ${budgetId}:`, error);
      return { data: null, error: error as Error };
    }
  }
};
