/**
 * YNAB API Client
 * 
 * This module provides functions for interacting with the YNAB API using a bearer token.
 * It uses the API key from environment variables rather than OAuth.
 */

// Base URL for YNAB API
const YNAB_API_BASE_URL = 'https://api.youneedabudget.com/v1';

// Types for YNAB API responses
export interface YnabBudget {
  id: string;
  name: string;
  last_modified_on: string;
  first_month: string;
  last_month: string;
  currency_format: {
    iso_code: string;
    example_format: string;
    decimal_digits: number;
    decimal_separator: string;
    symbol_first: boolean;
    group_separator: string;
    currency_symbol: string;
    display_symbol: boolean;
  };
}

export interface YnabBudgetResponse {
  data: {
    budgets: YnabBudget[];
    default_budget?: YnabBudget;
  };
}

export interface YnabCategory {
  id: string;
  category_group_id: string;
  name: string;
  hidden: boolean;
  original_category_group_id?: string;
  note?: string;
  budgeted: number;
  activity: number;
  balance: number;
  goal_type?: string;
  goal_day?: number;
  goal_month?: string;
  goal_percentage?: number;
  goal_amount?: number;
  goal_target?: number;
  goal_target_month?: string;
  goal_percentage_complete?: number;
  deleted: boolean;
}

export interface YnabCategoryGroup {
  id: string;
  name: string;
  hidden: boolean;
  deleted: boolean;
  categories: YnabCategory[];
}

export interface YnabCategoriesResponse {
  data: {
    category_groups: YnabCategoryGroup[];
  };
}

export interface YnabTransaction {
  id: string;
  date: string;
  amount: number;
  memo: string | null;
  cleared: 'cleared' | 'uncleared' | 'reconciled';
  approved: boolean;
  flag_color: string | null;
  account_id: string;
  account_name: string;
  payee_id: string | null;
  payee_name: string | null;
  category_id: string | null;
  category_name: string | null;
  transfer_account_id: string | null;
  transfer_transaction_id: string | null;
  matched_transaction_id: string | null;
  import_id: string | null;
  deleted: boolean;
  subtransactions: any[];
}

export interface YnabTransactionsResponse {
  data: {
    transactions: YnabTransaction[];
    server_knowledge: number;
  };
}

// Error handling for API responses
class YnabApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'YnabApiError';
    this.status = status;
  }
}

/**
 * Makes a request to the YNAB API
 * 
 * @param endpoint - API endpoint to call
 * @param options - Additional fetch options
 * @returns Promise with the API response
 */
async function ynabRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const apiKey = import.meta.env.VITE_YNAB_API_KEY;
  
  if (!apiKey) {
    throw new Error('YNAB API key is not defined in environment variables');
  }
  
  const url = `${YNAB_API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new YnabApiError(
      errorData.error?.detail || `YNAB API error: ${response.status} ${response.statusText}`,
      response.status
    );
  }
  
  return response.json();
}

/**
 * YNAB API client
 */
export const ynabClient = {
  /**
   * Get all budgets
   * 
   * @returns Promise with budget data
   */
  async getBudgets(): Promise<YnabBudgetResponse> {
    return ynabRequest<YnabBudgetResponse>('/budgets');
  },
  
  /**
   * Get a specific budget by ID
   * 
   * @param budgetId - Budget ID
   * @returns Promise with budget data
   */
  async getBudget(budgetId: string): Promise<YnabBudget> {
    const response = await ynabRequest<{ data: { budget: YnabBudget } }>(`/budgets/${budgetId}`);
    return response.data.budget;
  },
  
  /**
   * Get all categories for a budget
   * 
   * @param budgetId - Budget ID
   * @returns Promise with categories data
   */
  async getCategories(budgetId: string): Promise<YnabCategoriesResponse> {
    return ynabRequest<YnabCategoriesResponse>(`/budgets/${budgetId}/categories`);
  },
  
  /**
   * Get transactions for a budget
   * 
   * @param budgetId - Budget ID
   * @param sinceDate - Optional date to filter transactions from
   * @returns Promise with transactions data
   */
  async getTransactions(budgetId: string, sinceDate?: string): Promise<YnabTransactionsResponse> {
    let endpoint = `/budgets/${budgetId}/transactions`;
    if (sinceDate) {
      endpoint += `?since_date=${sinceDate}`;
    }
    return ynabRequest<YnabTransactionsResponse>(endpoint);
  },
  
  /**
   * Update a transaction's category
   * 
   * @param budgetId - Budget ID
   * @param transactionId - Transaction ID
   * @param categoryId - Category ID
   * @returns Promise with updated transaction
   */
  async updateTransactionCategory(
    budgetId: string,
    transactionId: string,
    categoryId: string
  ): Promise<{ data: { transaction: YnabTransaction } }> {
    return ynabRequest<{ data: { transaction: YnabTransaction } }>(
      `/budgets/${budgetId}/transactions/${transactionId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          transaction: {
            category_id: categoryId,
          },
        }),
      }
    );
  },
  
  /**
   * Get default budget ID from environment or user preferences
   * 
   * @returns Default budget ID
   */
  getDefaultBudgetId(): string {
    const defaultBudgetId = import.meta.env.VITE_YNAB_BUDGET_ID;
    if (!defaultBudgetId) {
      throw new Error('Default YNAB budget ID is not defined in environment variables');
    }
    return defaultBudgetId;
  },
};

export default ynabClient;
