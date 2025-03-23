// Types for the LogTable component
export interface LogEntry {
  id: string;
  timestamp: string;
  action: 'create' | 'update' | 'delete' | 'duplicate';
  ruleName: string;
  outcome: 'success' | 'failure';
}

// Mock data for log entries
export const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: '2023-10-15T14:35:22Z',
    action: 'create',
    ruleName: 'Grocery Stores',
    outcome: 'success',
  },
  {
    id: '2',
    timestamp: '2023-10-15T10:22:43Z',
    action: 'update',
    ruleName: 'Utilities',
    outcome: 'success',
  },
  {
    id: '3',
    timestamp: '2023-10-14T16:47:09Z',
    action: 'delete',
    ruleName: 'Restaurants',
    outcome: 'success',
  },
  {
    id: '4',
    timestamp: '2023-10-14T11:15:38Z',
    action: 'duplicate',
    ruleName: 'Clothing Stores',
    outcome: 'success',
  },
  {
    id: '5',
    timestamp: '2023-10-13T09:30:14Z',
    action: 'update',
    ruleName: 'Coffee Shops',
    outcome: 'failure',
  },
  {
    id: '6',
    timestamp: '2023-10-12T13:45:51Z',
    action: 'create',
    ruleName: 'Salary',
    outcome: 'success',
  },
  {
    id: '7',
    timestamp: '2023-10-11T18:20:33Z',
    action: 'delete',
    ruleName: 'Entertainment',
    outcome: 'success',
  },
];
