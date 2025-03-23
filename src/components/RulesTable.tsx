import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button, Input, Badge, Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui';
import { Search, Plus, Edit2, Trash2, Copy, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import RuleStatus from './RuleStatus';
import { TooltipProvider } from '@/components/ui/tooltip';

const mockRules = [{
  id: '1',
  name: 'Grocery Stores',
  criteria: 'Payee contains "Kroger", "Walmart", or "Trader Joe\'s"',
  actions: 'Assign to category: Groceries',
  lastModified: '2023-10-15T14:30:00Z',
  status: 'active' as const
}, {
  id: '2',
  name: 'Utilities',
  criteria: 'Payee contains "Electric" or "Water"',
  actions: 'Assign to category: Utilities',
  lastModified: '2023-10-14T10:15:00Z',
  status: 'active' as const
}, {
  id: '3',
  name: 'Coffee Shops',
  criteria: 'Payee contains "Starbucks" or "Dunkin"',
  actions: 'Assign to category: Dining Out',
  lastModified: '2023-10-13T08:45:00Z',
  status: 'inactive' as const
}, {
  id: '4',
  name: 'Salary',
  criteria: 'Payee contains "Employer" and Amount > 1000',
  actions: 'Assign to category: Income, Add flag: Income',
  lastModified: '2023-10-12T16:20:00Z',
  status: 'active' as const
}, {
  id: '5',
  name: 'Subscriptions',
  criteria: 'Payee contains "Netflix" or "Spotify"',
  actions: 'Assign to category: Subscriptions',
  lastModified: '2023-10-11T12:00:00Z',
  status: 'pending' as const
}];

type SortField = 'name' | 'criteria' | 'actions' | 'lastModified' | 'status';
type SortDirection = 'asc' | 'desc' | 'none';

interface SortState {
  field: SortField;
  direction: SortDirection;
}

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
        const nextDirection: SortDirection = 
          prev.direction === 'none' ? 'asc' : 
          prev.direction === 'asc' ? 'desc' : 'none';
        return { field, direction: nextDirection };
      } else {
        return { field, direction: 'asc' };
      }
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortState.field !== field) return <ArrowUpDown className="ml-1 h-4 w-4 inline opacity-50" />;
    if (sortState.direction === 'asc') return <ArrowUp className="ml-1 h-4 w-4 inline text-app-blue" />;
    if (sortState.direction === 'desc') return <ArrowDown className="ml-1 h-4 w-4 inline text-app-blue" />;
    return <ArrowUpDown className="ml-1 h-4 w-4 inline opacity-50" />;
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
        
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            className="pl-10 glass-card shadow-sm focus:ring-2 focus:ring-app-blue/30 transition-all duration-200" 
            placeholder="Search rules..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>
        
        <div className="overflow-hidden rounded-lg glass-card shadow-md">
          <Table>
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
            <TableBody>
              {sortedAndFilteredRules.map((rule, index) => (
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
                    <RuleStatus status={rule.status as 'active' | 'inactive' | 'pending'} showLabel={false} />
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
              ))}
            </TableBody>
          </Table>
        </div>
        
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                className="transition-all hover:bg-app-blue/10 hover:text-app-blue font-heading" 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  isActive={currentPage === i + 1} 
                  onClick={() => setCurrentPage(i + 1)} 
                  className={`font-heading ${currentPage === i + 1 ? "bg-app-blue text-white hover:bg-app-blue/90" : "hover:bg-app-blue/10 hover:text-app-blue transition-all"}`}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                className="transition-all hover:bg-app-blue/10 hover:text-app-blue font-heading" 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} 
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </TooltipProvider>
  );
};

export default RulesTable;
