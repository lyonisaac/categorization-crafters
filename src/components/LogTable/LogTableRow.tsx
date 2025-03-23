import React from 'react';
import { TableCell, TableRow, Badge } from '@/components/ui';
import { LogEntry } from '@/types/log-table-types';

interface LogTableRowProps {
  log: LogEntry;
  index: number;
  formatDate: (dateString: string) => string;
}

const LogTableRow: React.FC<LogTableRowProps> = ({ log, index, formatDate }) => {
  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'update':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'delete':
        return 'bg-app-delete/10 text-app-delete border border-app-delete/20';
      case 'duplicate':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };
  
  const getOutcomeColor = (outcome: string) => {
    return outcome === 'success'
      ? 'bg-green-100 text-green-800 border border-green-200'
      : 'bg-app-delete/10 text-app-delete border border-app-delete/20';
  };

  return (
    <TableRow 
      key={log.id}
      className={`transition-all-300 hover:bg-white/70 ${index % 2 === 0 ? 'bg-white/30' : 'bg-white/10'}`}
    >
      <TableCell className="text-sm text-muted-foreground">{formatDate(log.timestamp)}</TableCell>
      <TableCell>
        <Badge className={`font-normal ${getActionColor(log.action)}`}>
          {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
        </Badge>
      </TableCell>
      <TableCell className="font-medium">{log.ruleName}</TableCell>
      <TableCell>
        <Badge className={`font-normal ${getOutcomeColor(log.outcome)}`}>
          {log.outcome.charAt(0).toUpperCase() + log.outcome.slice(1)}
        </Badge>
      </TableCell>
    </TableRow>
  );
};

export default LogTableRow;
