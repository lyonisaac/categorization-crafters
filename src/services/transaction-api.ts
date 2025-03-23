import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase-types';
import type { PreviewTransaction } from '@/types/rule-types';

// Type definitions for API responses
type ApiResponse<T> = {
  data: T | null;
  error: Error | null;
};

// Transaction Preview type from database
type DbTransactionPreview = Database['public']['Tables']['transaction_previews']['Row'];

// Map database transaction to application transaction
const mapDbTransactionToAppTransaction = (dbTransaction: DbTransactionPreview): PreviewTransaction => {
  return {
    payee: dbTransaction.payee,
    memo: dbTransaction.memo || '',
    amount: Number(dbTransaction.amount),
    date: dbTransaction.date,
    account: dbTransaction.account
  };
};

// Transaction API service
export const transactionApi = {
  // Get all transaction previews for the current user
  async getTransactionPreviews(): Promise<ApiResponse<PreviewTransaction[]>> {
    try {
      const { data, error } = await supabase
        .from('transaction_previews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transactions = data.map(mapDbTransactionToAppTransaction);
      return { data: transactions, error: null };
    } catch (error) {
      console.error('Error fetching transaction previews:', error);
      return { data: null, error: error as Error };
    }
  },

  // Get a single transaction preview by ID
  async getTransactionPreview(id: string): Promise<ApiResponse<PreviewTransaction>> {
    try {
      const { data, error } = await supabase
        .from('transaction_previews')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data: mapDbTransactionToAppTransaction(data), error: null };
    } catch (error) {
      console.error(`Error fetching transaction preview ${id}:`, error);
      return { data: null, error: error as Error };
    }
  },

  // Create a new transaction preview
  async createTransactionPreview(transaction: PreviewTransaction): Promise<ApiResponse<PreviewTransaction>> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from('transaction_previews')
        .insert({
          user_id: userData.user?.id,
          payee: transaction.payee,
          memo: transaction.memo,
          amount: transaction.amount,
          date: transaction.date,
          account: transaction.account
        })
        .select()
        .single();

      if (error) throw error;

      return { data: mapDbTransactionToAppTransaction(data), error: null };
    } catch (error) {
      console.error('Error creating transaction preview:', error);
      return { data: null, error: error as Error };
    }
  },

  // Delete a transaction preview
  async deleteTransactionPreview(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('transaction_previews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { data: true, error: null };
    } catch (error) {
      console.error(`Error deleting transaction preview ${id}:`, error);
      return { data: null, error: error as Error };
    }
  }
};
