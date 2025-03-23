import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase-types';
import type { Rule } from '@/types/rule-types';

// Type definitions for API responses
type ApiResponse<T> = {
  data: T | null;
  error: Error | null;
};

// Convert database rule to application rule
const mapDbRuleToAppRule = (dbRule: Database['public']['Tables']['categorization_rules']['Row']): Rule => {
  return {
    id: dbRule.id,
    name: dbRule.name,
    description: dbRule.description || '',
    criteria: dbRule.criteria as unknown as Rule['criteria'],
    actions: dbRule.actions as unknown as Rule['actions'],
    lastModified: dbRule.last_modified || undefined,
    status: dbRule.status as Rule['status']
  };
};

// Rules API
export const rulesApi = {
  // Get all rules for the current user
  async getRules(): Promise<ApiResponse<Rule[]>> {
    try {
      const { data, error } = await supabase
        .from('categorization_rules')
        .select('*')
        .order('priority', { ascending: true });

      if (error) throw error;

      const rules = data.map(mapDbRuleToAppRule);
      return { data: rules, error: null };
    } catch (error) {
      console.error('Error fetching rules:', error);
      return { data: null, error: error as Error };
    }
  },

  // Get a single rule by ID
  async getRule(id: string): Promise<ApiResponse<Rule>> {
    try {
      const { data, error } = await supabase
        .from('categorization_rules')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data: mapDbRuleToAppRule(data), error: null };
    } catch (error) {
      console.error(`Error fetching rule ${id}:`, error);
      return { data: null, error: error as Error };
    }
  },

  // Create a new rule
  async createRule(rule: Omit<Rule, 'id'>): Promise<ApiResponse<Rule>> {
    try {
      const { data, error } = await supabase
        .from('categorization_rules')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          name: rule.name,
          description: rule.description,
          criteria: rule.criteria,
          actions: rule.actions,
          status: rule.status || 'active',
          last_modified: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return { data: mapDbRuleToAppRule(data), error: null };
    } catch (error) {
      console.error('Error creating rule:', error);
      return { data: null, error: error as Error };
    }
  },

  // Update an existing rule
  async updateRule(id: string, rule: Partial<Omit<Rule, 'id'>>): Promise<ApiResponse<Rule>> {
    try {
      const { data, error } = await supabase
        .from('categorization_rules')
        .update({
          ...rule,
          last_modified: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data: mapDbRuleToAppRule(data), error: null };
    } catch (error) {
      console.error(`Error updating rule ${id}:`, error);
      return { data: null, error: error as Error };
    }
  },

  // Delete a rule
  async deleteRule(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('categorization_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { data: true, error: null };
    } catch (error) {
      console.error(`Error deleting rule ${id}:`, error);
      return { data: null, error: error as Error };
    }
  }
};
