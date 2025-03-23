import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase-types';

// Type definitions for API responses
type ApiResponse<T> = {
  data: T | null;
  error: Error | null;
};

// User Preferences type
export type UserPreferences = Database['public']['Tables']['user_preferences']['Row'];

// User API service
export const userApi = {
  // Get user preferences for the current user
  async getUserPreferences(): Promise<ApiResponse<UserPreferences>> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "No rows returned" - this is expected for new users
        throw error;
      }

      return { data: data || null, error: null };
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return { data: null, error: error as Error };
    }
  },

  // Create or update user preferences
  async saveUserPreferences(preferences: Partial<Omit<UserPreferences, 'id' | 'user_id' | 'created_at'>>): Promise<ApiResponse<UserPreferences>> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      // First check if preferences already exist
      const { data: existingPrefs } = await this.getUserPreferences();
      
      if (existingPrefs) {
        // Update existing preferences
        const { data, error } = await supabase
          .from('user_preferences')
          .update({
            ...preferences,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPrefs.id)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } else {
        // Create new preferences
        const { data, error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: userData.user?.id,
            ...preferences
          })
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      }
    } catch (error) {
      console.error('Error saving user preferences:', error);
      return { data: null, error: error as Error };
    }
  }
};
