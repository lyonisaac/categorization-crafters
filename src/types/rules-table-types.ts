// Rule types for the RulesTable component
export type RuleStatus = 'active' | 'inactive' | 'pending';

export interface Rule {
  id: string;
  name: string;
  criteria: string;
  actions: string;
  lastModified: string;
  status: RuleStatus;
}

export type SortField = 'name' | 'criteria' | 'actions' | 'lastModified' | 'status';
export type SortDirection = 'asc' | 'desc' | 'none';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

// Mock data for the RulesTable component
export const mockRules: Rule[] = [{
  id: '1',
  name: 'Grocery Stores',
  criteria: 'Payee contains "Kroger", "Walmart", or "Trader Joe\'s"',
  actions: 'Assign to category: Groceries',
  lastModified: '2023-10-15T14:30:00Z',
  status: 'active'
}, {
  id: '2',
  name: 'Utilities',
  criteria: 'Payee contains "Electric" or "Water"',
  actions: 'Assign to category: Utilities',
  lastModified: '2023-10-14T10:15:00Z',
  status: 'active'
}, {
  id: '3',
  name: 'Coffee Shops',
  criteria: 'Payee contains "Starbucks" or "Dunkin"',
  actions: 'Assign to category: Dining Out',
  lastModified: '2023-10-13T08:45:00Z',
  status: 'inactive'
}, {
  id: '4',
  name: 'Salary',
  criteria: 'Payee contains "Employer" and Amount > 1000',
  actions: 'Assign to category: Income, Add flag: Income',
  lastModified: '2023-10-12T16:20:00Z',
  status: 'active'
}, {
  id: '5',
  name: 'Subscriptions',
  criteria: 'Payee contains "Netflix" or "Spotify"',
  actions: 'Assign to category: Subscriptions',
  lastModified: '2023-10-11T12:00:00Z',
  status: 'pending'
}];
