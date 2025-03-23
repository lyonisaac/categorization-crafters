import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TableCell, TableRow, Button } from '@/components/ui';
import { Edit2, Trash2, Copy } from 'lucide-react';
import RuleStatus from '../RuleStatus';
import { Rule } from '@/types/rules-table-types';

interface RuleTableRowProps {
  rule: Rule;
  index: number;
  formatDate: (dateString: string) => string;
}

const RuleTableRow: React.FC<RuleTableRowProps> = ({ rule, index, formatDate }) => {
  const navigate = useNavigate();

  return (
    <TableRow 
      key={rule.id} 
      className={`transition-all-300 hover:bg-white/70 ${index % 2 === 0 ? 'bg-white/30' : 'bg-white/10'}`}
    >
      <TableCell className="font-body">
        <div className="flex items-center gap-1">
          {rule.name}
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell max-w-xs" title={rule.criteria}>
        <div className="truncate pr-4">{rule.criteria}</div>
      </TableCell>
      <TableCell className="hidden md:table-cell max-w-xs" title={rule.actions}>
        <div className="truncate pr-4">{rule.actions}</div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <RuleStatus status={rule.status} showLabel={false} />
      </TableCell>
      <TableCell className="hidden sm:table-cell text-muted-foreground text-sm whitespace-nowrap">
        {formatDate(rule.lastModified)}
      </TableCell>
      <TableCell className="text-right space-x-1 p-2">
        <div className="flex gap-1 justify-end">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate(`/rule-editor/${rule.id}`)} 
            title="Edit Rule" 
            className="h-8 w-8 transition-all-300 hover:text-app-blue hover:border-app-blue hover:bg-app-blue/10 hover:shadow-sm"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 transition-all-300 hover:text-app-blue hover:border-app-blue hover:bg-app-blue/10 hover:shadow-sm" 
            title="Duplicate Rule"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 transition-all-300 hover:text-app-delete hover:border-app-delete hover:bg-app-delete/10" 
            title="Delete Rule"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default RuleTableRow;
