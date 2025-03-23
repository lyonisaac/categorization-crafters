import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableBody, Button } from '@/components/ui';
import { Plus } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { mockRules, Rule, SortField } from '@/types/rules-table-types';
import { SortState, updateSortState, sortData } from '@/utils/sorting-utils';
import { usePagination } from '@/hooks/usePagination';
import { formatDate } from '@/utils/date-utils';
import SearchableTable from '@/components/common/SearchableTable';

// Import extracted components
import { RulesTableHeader, RuleTableRow } from './RulesTable/index';

const RulesTable: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortState, setSortState] = useState<SortState<SortField>>({ field: 'name', direction: 'none' });
  
  const handleSort = (field: SortField) => {
    setSortState(prev => updateSortState(prev, field));
  };

  const filteredRules = useMemo(() => {
    return mockRules.filter(rule => 
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      rule.criteria.toLowerCase().includes(searchTerm.toLowerCase()) || 
      rule.actions.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const sortedRules = useMemo(() => {
    return sortData<Rule, SortField>(
      filteredRules,
      sortState,
      (rule, field) => {
        if (field === 'status') {
          const statusOrder = { active: 0, pending: 1, inactive: 2 };
          return statusOrder[rule.status as keyof typeof statusOrder];
        }
        if (field === 'lastModified') {
          return new Date(rule[field]);
        }
        return rule[field];
      }
    );
  }, [filteredRules, sortState]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedRules
  } = usePagination({
    data: sortedRules,
    itemsPerPage: 5
  });

  const headerContent = (
    <Button 
      className="bg-app-success hover:bg-app-success/90 text-white flex items-center gap-2 shadow-sm transition-all duration-200 hover:shadow font-heading" 
      onClick={() => navigate('/rule-editor')}
    >
      <Plus className="h-4 w-4" />
      Create New Rule
    </Button>
  );
  
  return (
    <TooltipProvider>
      <SearchableTable
        title="Rules"
        searchPlaceholder="Search rules..."
        headerContent={headerContent}
        tableHeader={<RulesTableHeader sortState={sortState} handleSort={handleSort} />}
        tableBody={
          <TableBody>
            {paginatedRules.map((rule, index) => (
              <RuleTableRow 
                key={rule.id}
                rule={rule}
                index={index}
                formatDate={formatDate}
              />
            ))}
          </TableBody>
        }
        onSearch={setSearchTerm}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </TooltipProvider>
  );
};

export default RulesTable;
