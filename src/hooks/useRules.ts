import { useState, useEffect } from 'react';
import { rulesApi } from '@/services/api';
import type { Rule } from '@/types/rule-types';
import { useAuth } from './useAuth';

// Hook for managing rules
export const useRules = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Fetch all rules
  const fetchRules = async () => {
    if (!user) {
      setRules([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await rulesApi.getRules();
      if (error) throw error;
      setRules(data || []);
    } catch (err) {
      console.error('Error fetching rules:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single rule
  const fetchRule = async (id: string) => {
    if (!user) return null;

    try {
      const { data, error } = await rulesApi.getRule(id);
      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`Error fetching rule ${id}:`, err);
      setError(err as Error);
      return null;
    }
  };

  // Create a new rule
  const createRule = async (rule: Omit<Rule, 'id'>) => {
    if (!user) return null;

    try {
      const { data, error } = await rulesApi.createRule(rule);
      if (error) throw error;
      
      // Update the local state
      setRules(prev => [...prev, data as Rule]);
      return data;
    } catch (err) {
      console.error('Error creating rule:', err);
      setError(err as Error);
      return null;
    }
  };

  // Update an existing rule
  const updateRule = async (id: string, rule: Partial<Omit<Rule, 'id'>>) => {
    if (!user) return null;

    try {
      const { data, error } = await rulesApi.updateRule(id, rule);
      if (error) throw error;
      
      // Update the local state
      setRules(prev => prev.map(r => r.id === id ? data as Rule : r));
      return data;
    } catch (err) {
      console.error(`Error updating rule ${id}:`, err);
      setError(err as Error);
      return null;
    }
  };

  // Delete a rule
  const deleteRule = async (id: string) => {
    if (!user) return false;

    try {
      const { data, error } = await rulesApi.deleteRule(id);
      if (error) throw error;
      
      // Update the local state
      setRules(prev => prev.filter(r => r.id !== id));
      return data;
    } catch (err) {
      console.error(`Error deleting rule ${id}:`, err);
      setError(err as Error);
      return false;
    }
  };

  // Fetch rules on mount and when user changes
  useEffect(() => {
    fetchRules();
  }, [user]);

  return {
    rules,
    loading,
    error,
    fetchRules,
    fetchRule,
    createRule,
    updateRule,
    deleteRule
  };
};
