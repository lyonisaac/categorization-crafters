import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SortField, SortState } from '@/types/rules-table-types';

interface RulesTableHeaderProps {
  sortState: SortState;
  handleSort: (field: SortField) => void;
}

const RulesTableHeader: React.FC<RulesTableHeaderProps> = ({ sortState, handleSort }) => {
  const getSortIcon = (field: SortField) => {
    if (sortState.field !== field) return <ArrowUpDown className="ml-1 h-4 w-4 inline opacity-50" />;
    if (sortState.direction === 'asc') return <ArrowUp className="ml-1 h-4 w-4 inline text-app-blue" />;
    if (sortState.direction === 'desc') return <ArrowDown className="ml-1 h-4 w-4 inline text-app-blue" />;
    return <ArrowUpDown className="ml-1 h-4 w-4 inline opacity-50" />;
  };

  return (
    <TableHeader className="bg-white/80 backdrop-blur-sm">
      <TableRow className="border-b border-gray-200">
        <TableHead 
          className="font-heading font-medium cursor-pointer"
          onClick={() => handleSort('name')}
        >
          Rule Name {getSortIcon('name')}
        </TableHead>
        <TableHead 
          className="hidden md:table-cell font-heading font-medium cursor-pointer"
          onClick={() => handleSort('criteria')}
        >
          Criteria {getSortIcon('criteria')}
        </TableHead>
        <TableHead 
          className="hidden md:table-cell font-heading font-medium cursor-pointer"
          onClick={() => handleSort('actions')}
        >
          Actions {getSortIcon('actions')}
        </TableHead>
        <TableHead 
          className="hidden sm:table-cell font-heading font-medium cursor-pointer w-[120px]"
          onClick={() => handleSort('status')}
        >
          Status {getSortIcon('status')}
        </TableHead>
        <TableHead 
          className="hidden sm:table-cell font-heading font-medium cursor-pointer w-[180px]"
          onClick={() => handleSort('lastModified')}
        >
          Last Modified {getSortIcon('lastModified')}
        </TableHead>
        <TableHead className="text-right font-heading font-medium w-[120px]">Options</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default RulesTableHeader;
