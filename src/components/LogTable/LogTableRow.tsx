import React from 'react';
import { TableCell, TableRow, Badge } from '@/components/ui';
import { LogEntry } from '@/types/log-table-types';
import { getActionColor, getOutcomeColor, formatAction, formatOutcome } from '@/utils/log-format-utils';

interface LogTableRowProps {
  log: LogEntry;
  index: number;
  formatDate: (dateString: string) => string;
}

const LogTableRow: React.FC<LogTableRowProps> = ({ log, index, formatDate }) => {
  return (
    <TableRow 
      key={log.id}
      className={`transition-all-300 hover:bg-white/70 ${index % 2 === 0 ? 'bg-white/30' : 'bg-white/10'}`}
    >
      <TableCell className="text-sm text-muted-foreground">{formatDate(log.timestamp)}</TableCell>
      <TableCell>
        <Badge 
          className={`${getActionColor(log.action)} border px-2 py-0.5 text-xs font-medium rounded-md`}
        >
          {formatAction(log.action)}
        </Badge>
      </TableCell>
      <TableCell className="font-medium">{log.ruleName}</TableCell>
      <TableCell>
        <Badge 
          className={`${getOutcomeColor(log.outcome)} border px-2 py-0.5 text-xs font-medium rounded-md`}
        >
          {formatOutcome(log.outcome)}
        </Badge>
      </TableCell>
    </TableRow>
  );
};

export default LogTableRow;
