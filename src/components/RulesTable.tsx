import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableBody, Button } from '@/components/ui';
import { Plus, Edit, Trash, Eye } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SortField } from '@/types/rules-table-types';
import { SortState, updateSortState } from '@/utils/sorting-utils';
import { sortRules } from '@/utils/rule-sort-utils';
import { usePagination } from '@/hooks/usePagination';
import { formatDate } from '@/utils/date-utils';
import SearchableTable from '@/components/common/SearchableTable';
import { Rule } from '@/types/rule-types';
import { 
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody as ShadcnTableBody
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getStatusBadgeClass } from '@/utils/rule-sort-utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button as ShadcnButton } from '@/components/ui/button';

interface RulesTableProps {
  rules: Rule[];
}

export function RulesTable({ rules }: RulesTableProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortState, setSortState] = useState<SortState<SortField>>({ field: 'name', direction: 'asc' });
  
  const handleSort = (field: SortField) => {
    setSortState(prev => updateSortState(prev, field));
  };

  const filteredRules = useMemo(() => {
    return rules.filter(rule => 
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (rule.description && rule.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      rule.criteria.some(c => c.value.toLowerCase().includes(searchTerm.toLowerCase())) ||
      rule.actions.some(a => a.value.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [rules, searchTerm]);

  const sortedRules = useMemo(() => {
    return sortRules(filteredRules, sortState);
  }, [filteredRules, sortState]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedRules
  } = usePagination({
    data: sortedRules,
    itemsPerPage: 10
  });

  const handleViewRule = (id: string) => {
    navigate(`/rules/${id}`);
  };

  const handleEditRule = (id: string) => {
    navigate(`/rules/${id}/edit`);
  };

  const handleDeleteRule = (id: string) => {
    // This would be handled by the deleteRule function
    if (window.confirm('Are you sure you want to delete this rule?')) {
      alert('Delete functionality will be implemented with the rules API');
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <ShadcnTableBody>
            {paginatedRules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No rules found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedRules.map((rule) => (
                <TableRow 
                  key={rule.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleViewRule(rule.id)}
                >
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(rule.status || 'active')}>
                      {rule.status || 'active'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(rule.lastModified || new Date().toISOString())}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <ShadcnButton variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                            <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                          </svg>
                        </ShadcnButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleViewRule(rule.id);
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleEditRule(rule.id);
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRule(rule.id);
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </ShadcnTableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <ShadcnButton
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </ShadcnButton>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <ShadcnButton
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </ShadcnButton>
        </div>
      )}
    </div>
  );
}
