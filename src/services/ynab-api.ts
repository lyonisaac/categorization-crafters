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

  // Create a new YNAB connection
  async createConnection(connection: Omit<YnabConnection, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<YnabConnection>> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from('ynab_connections')
        .insert({
          user_id: userData.user?.id,
          budget_id: connection.budget_id,
          access_token: connection.access_token,
          refresh_token: connection.refresh_token,
          token_expires_at: connection.token_expires_at,
          last_sync: connection.last_sync || new Date().toISOString()
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
  async updateConnection(id: string, connection: Partial<Omit<YnabConnection, 'id' | 'user_id' | 'created_at'>>): Promise<ApiResponse<YnabConnection>> {
    try {
      const updateData = {
        ...connection,
        updated_at: new Date().toISOString()
      };

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

  // Get all categories for a specific budget
  async getCategories(budgetId: string): Promise<ApiResponse<YnabCategory[]>> {
    try {
      const { data, error } = await supabase
        .from('ynab_categories')
        .select('*')
        .eq('budget_id', budgetId)
        .order('name');

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error(`Error fetching categories for budget ${budgetId}:`, error);
      return { data: null, error: error as Error };
    }
  },
};
