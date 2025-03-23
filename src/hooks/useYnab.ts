import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import ynabClient, { 
  YnabBudget, 
  YnabCategory, 
  YnabCategoryGroup,
  YnabTransaction 
} from '@/lib/ynab';

/**
 * Hook for interacting with the YNAB API
 */
export const useYnab = () => {
  const [budgets, setBudgets] = useState<YnabBudget[]>([]);
  const [categories, setCategories] = useState<YnabCategoryGroup[]>([]);
  const [transactions, setTransactions] = useState<YnabTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Get all budgets
  const fetchBudgets = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await ynabClient.getBudgets();
      setBudgets(response.data.budgets);
      return response.data.budgets;
    } catch (err) {
      console.error('Error fetching YNAB budgets:', err);
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get categories for a budget
  const fetchCategories = async (budgetId?: string) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Use provided budget ID or default from environment
      const targetBudgetId = budgetId || ynabClient.getDefaultBudgetId();
      const response = await ynabClient.getCategories(targetBudgetId);
      setCategories(response.data.category_groups);
      return response.data.category_groups;
    } catch (err) {
      console.error('Error fetching YNAB categories:', err);
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get transactions for a budget
  const fetchTransactions = async (budgetId?: string, sinceDate?: string) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Use provided budget ID or default from environment
      const targetBudgetId = budgetId || ynabClient.getDefaultBudgetId();
      const response = await ynabClient.getTransactions(targetBudgetId, sinceDate);
      setTransactions(response.data.transactions);
      return response.data.transactions;
    } catch (err) {
      console.error('Error fetching YNAB transactions:', err);
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Update a transaction's category
  const updateTransactionCategory = async (
    transactionId: string,
    categoryId: string,
    budgetId?: string
  ) => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      // Use provided budget ID or default from environment
      const targetBudgetId = budgetId || ynabClient.getDefaultBudgetId();
      const response = await ynabClient.updateTransactionCategory(
        targetBudgetId,
        transactionId,
        categoryId
      );
      
      // Update the transaction in the local state
      setTransactions(prev => 
        prev.map(t => 
          t.id === transactionId 
            ? response.data.transaction 
            : t
        )
      );
      
      return response.data.transaction;
    } catch (err) {
      console.error(`Error updating transaction ${transactionId} category:`, err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get all category options in a flat format suitable for select inputs
  const getCategoryOptions = () => {
    return categories
      .filter(group => !group.hidden && !group.deleted)
      .flatMap(group => 
        group.categories
          .filter(category => !category.hidden && !category.deleted)
          .map(category => ({
            value: category.id,
            label: `${group.name}: ${category.name}`,
            groupName: group.name,
            categoryName: category.name
          }))
      );
  };

  return {
    budgets,
    categories,
    transactions,
    loading,
    error,
    fetchBudgets,
    fetchCategories,
    fetchTransactions,
    updateTransactionCategory,
    getCategoryOptions,
    getDefaultBudgetId: ynabClient.getDefaultBudgetId
  };
};

export default useYnab;
