// Types for the LogTable component
export interface LogEntry {
  id: string;
  timestamp: string;
  action: 'create' | 'update' | 'delete' | 'duplicate';
  ruleName: string;
  outcome: 'success' | 'failure';
}

// Re-export mock logs from data directory
export { mockLogs } from '@/data/mock-logs';
