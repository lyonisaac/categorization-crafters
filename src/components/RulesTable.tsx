import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, Button } from '@/components/ui';
import { Plus } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { mockRules, SortField, SortState } from '@/types/rules-table-types';

// Import extracted components
import { RulesTableHeader, RuleTableRow, RulesTablePagination, RulesTableSearch } from './RulesTable/index';

const RulesTable: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortState, setSortState] = useState<SortState>({ field: 'name', direction: 'none' });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleSort = (field: SortField) => {
    setSortState(prev => {
      if (prev.field === field) {
        const nextDirection = 
          prev.direction === 'none' ? 'asc' : 
          prev.direction === 'asc' ? 'desc' : 'none';
        return { field, direction: nextDirection };
      } else {
        return { field, direction: 'asc' };
      }
    });
  };

  const sortedAndFilteredRules = useMemo(() => {
    let result = [...mockRules].filter(rule => 
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      rule.criteria.toLowerCase().includes(searchTerm.toLowerCase()) || 
      rule.actions.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortState.direction !== 'none') {
      result.sort((a, b) => {
        let comparison = 0;
        if (sortState.field === 'status') {
          const statusOrder = { active: 0, pending: 1, inactive: 2 };
          comparison = statusOrder[a.status as keyof typeof statusOrder] - 
                       statusOrder[b.status as keyof typeof statusOrder];
        } else {
          const fieldA = a[sortState.field];
          const fieldB = b[sortState.field];

          if (sortState.field === 'lastModified') {
            comparison = new Date(fieldA).getTime() - new Date(fieldB).getTime();
          } else {
            comparison = fieldA.localeCompare(fieldB);
          }
        }

        return sortState.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [mockRules, searchTerm, sortState]);

  const totalPages = Math.ceil(sortedAndFilteredRules.length / 5);
  
  return (
    <TooltipProvider>
      <div className="space-y-6 animate-slide-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-heading font-semibold">Rules</h2>
          <Button 
            className="bg-app-success hover:bg-app-success/90 text-white flex items-center gap-2 shadow-sm transition-all duration-200 hover:shadow font-heading" 
            onClick={() => navigate('/rule-editor')}
          >
            <Plus className="h-4 w-4" />
            Create New Rule
          </Button>
        </div>
        
        <RulesTableSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <div className="overflow-hidden rounded-lg glass-card shadow-md">
          <Table>
            <RulesTableHeader sortState={sortState} handleSort={handleSort} />
            <TableBody>
              {sortedAndFilteredRules.map((rule, index) => (
                <RuleTableRow 
                  key={rule.id}
                  rule={rule}
                  index={index}
                  formatDate={formatDate}
                />
              ))}
            </TableBody>
          </Table>
        </div>
        
        <RulesTablePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </TooltipProvider>
  );
};

export default RulesTable;
