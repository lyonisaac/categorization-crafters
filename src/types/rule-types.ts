// Types and constants for rule management

// Rule type definitions
export interface Criterion {
  id: string;
  type: string;
  operator: string;
  value: string;
}

export interface Action {
  id: string;
  type: string;
  value: string;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  criteria: Criterion[];
  actions: Action[];
  lastModified?: string;
  status?: 'active' | 'inactive' | 'pending';
}

export interface PreviewTransaction {
  payee: string;
  memo: string;
  amount: number;
  date: string;
  account: string;
}

// Mock data
export const mockRule: Rule = {
  id: '1',
  name: 'Grocery Stores',
  description: 'Automatically categorize grocery purchases',
  criteria: [{
    id: 'c1',
    type: 'payee',
    operator: 'contains',
    value: 'Kroger'
  }, {
    id: 'c2',
    type: 'payee',
    operator: 'contains',
    value: 'Walmart'
  }, {
    id: 'c3',
    type: 'payee',
    operator: 'contains',
    value: 'Trader Joe\'s'
  }],
  actions: [{
    id: 'a1',
    type: 'category',
    value: 'Groceries'
  }]
};

// Form options
export const criteriaOptions = [{
  value: 'payee',
  label: 'Payee'
}, {
  value: 'memo',
  label: 'Memo Content'
}, {
  value: 'amount',
  label: 'Transaction Amount'
}, {
  value: 'date',
  label: 'Transaction Date'
}, {
  value: 'account',
  label: 'Account Name/Type'
}];

export const operatorOptions = {
  payee: [{
    value: 'contains',
    label: 'Contains'
  }, {
    value: 'equals',
    label: 'Equals'
  }, {
    value: 'starts_with',
    label: 'Starts With'
  }, {
    value: 'ends_with',
    label: 'Ends With'
  }],
  memo: [{
    value: 'contains',
    label: 'Contains'
  }, {
    value: 'equals',
    label: 'Equals'
  }, {
    value: 'starts_with',
    label: 'Starts With'
  }, {
    value: 'ends_with',
    label: 'Ends With'
  }],
  amount: [{
    value: 'equals',
    label: 'Equals'
  }, {
    value: 'greater_than',
    label: 'Greater Than'
  }, {
    value: 'less_than',
    label: 'Less Than'
  }, {
    value: 'between',
    label: 'Between'
  }],
  date: [{
    value: 'equals',
    label: 'Equals'
  }, {
    value: 'after',
    label: 'After'
  }, {
    value: 'before',
    label: 'Before'
  }, {
    value: 'between',
    label: 'Between'
  }],
  account: [{
    value: 'equals',
    label: 'Equals'
  }, {
    value: 'contains',
    label: 'Contains'
  }]
};

export const actionOptions = [{
  value: 'category',
  label: 'Assign Category'
}, {
  value: 'flag',
  label: 'Add Flag'
}, {
  value: 'memo',
  label: 'Modify Memo'
}];

export const categoryOptions = [{
  value: 'groceries',
  label: 'Groceries'
}, {
  value: 'dining',
  label: 'Dining Out'
}, {
  value: 'utilities',
  label: 'Utilities'
}, {
  value: 'income',
  label: 'Income'
}, {
  value: 'subscriptions',
  label: 'Subscriptions'
}];

export const flagOptions = [{
  value: 'income',
  label: 'Income'
}, {
  value: 'review',
  label: 'Need Review'
}, {
  value: 'important',
  label: 'Important'
}];

// Default values
export const defaultCriterion: Criterion = {
  id: '',
  type: 'payee',
  operator: 'contains',
  value: ''
};

export const defaultAction: Action = {
  id: '',
  type: 'category',
  value: ''
};

export const defaultPreviewTransaction: PreviewTransaction = {
  payee: 'Sample Store',
  memo: 'Purchase reference #12345',
  amount: 42.99,
  date: new Date().toISOString(),
  account: 'Checking Account'
};
