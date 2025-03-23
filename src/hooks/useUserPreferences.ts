import { useState, useEffect } from 'react';
import { userApi, UserPreferences } from '@/services/user-api';
import { useAuth } from './useAuth';

// Hook for managing user preferences
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Fetch user preferences
  const fetchPreferences = async () => {
    if (!user) {
      setPreferences(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await userApi.getUserPreferences();
      if (error) throw error;
      setPreferences(data);
    } catch (err) {
      console.error('Error fetching user preferences:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Save user preferences
  const savePreferences = async (newPreferences: Partial<Omit<UserPreferences, 'id' | 'user_id' | 'created_at'>>) => {
    if (!user) return null;

    try {
      const { data, error } = await userApi.saveUserPreferences(newPreferences);
      if (error) throw error;
      
      // Update the local state
      setPreferences(data);
      return data;
    } catch (err) {
      console.error('Error saving user preferences:', err);
      setError(err as Error);
      return null;
    }
  };

  // Fetch preferences on mount and when user changes
  useEffect(() => {
    fetchPreferences();
  }, [user]);

  return {
    preferences,
    loading,
    error,
    fetchPreferences,
    savePreferences
  };
};
