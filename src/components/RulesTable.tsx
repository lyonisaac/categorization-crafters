import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button, Input, Badge, Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui';
import { Search, Plus, Edit2, Trash2, Copy, Info } from 'lucide-react';

// Mock data for demonstration
const mockRules = [{
  id: '1',
  name: 'Grocery Stores',
  criteria: 'Payee contains "Kroger", "Walmart", or "Trader Joe\'s"',
  actions: 'Assign to category: Groceries',
  lastModified: '2023-10-15T14:30:00Z'
}, {
  id: '2',
  name: 'Utilities',
  criteria: 'Payee contains "Electric" or "Water"',
  actions: 'Assign to category: Utilities',
  lastModified: '2023-10-14T10:15:00Z'
}, {
  id: '3',
  name: 'Coffee Shops',
  criteria: 'Payee contains "Starbucks" or "Dunkin"',
  actions: 'Assign to category: Dining Out',
  lastModified: '2023-10-13T08:45:00Z'
}, {
  id: '4',
  name: 'Salary',
  criteria: 'Payee contains "Employer" and Amount > 1000',
  actions: 'Assign to category: Income, Add flag: Income',
  lastModified: '2023-10-12T16:20:00Z'
}, {
  id: '5',
  name: 'Subscriptions',
  criteria: 'Payee contains "Netflix" or "Spotify"',
  actions: 'Assign to category: Subscriptions',
  lastModified: '2023-10-11T12:00:00Z'
}];
const RulesTable: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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
  const filteredRules = mockRules.filter(rule => rule.name.toLowerCase().includes(searchTerm.toLowerCase()) || rule.criteria.toLowerCase().includes(searchTerm.toLowerCase()) || rule.actions.toLowerCase().includes(searchTerm.toLowerCase()));

  // Mock pagination - in a real app this would use actual pagination logic
  const totalPages = Math.ceil(filteredRules.length / 5);
  return <div className="space-y-6 animate-slide-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Transaction Rules</h2>
        <Button className="bg-app-blue hover:bg-app-blue/90 text-white flex items-center gap-2 shadow-sm transition-all duration-200 hover:shadow" onClick={() => navigate('/rule-editor')}>
          <Plus className="h-4 w-4" />
          Create New Rule
        </Button>
      </div>
      
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input className="pl-10 glass-card shadow-sm focus:ring-2 focus:ring-app-blue/30 transition-all duration-200" placeholder="Search rules..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>
      
      <div className="overflow-hidden rounded-lg glass-card shadow-md">
        <Table>
          <TableHeader className="bg-white/80 backdrop-blur-sm">
            <TableRow className="border-b border-gray-200">
              <TableHead className="font-medium">Rule Name</TableHead>
              <TableHead className="hidden md:table-cell font-medium">Criteria</TableHead>
              <TableHead className="hidden md:table-cell font-medium">Actions</TableHead>
              <TableHead className="hidden sm:table-cell font-medium">Last Modified</TableHead>
              <TableHead className="text-right font-medium">Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRules.map((rule, index) => <TableRow key={rule.id} className={`transition-all-300 hover:bg-white/70 ${index % 2 === 0 ? 'bg-white/30' : 'bg-white/10'}`}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-1">
                    {rule.name}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-xs truncate" title={rule.criteria}>
                  {rule.criteria}
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-xs truncate" title={rule.actions}>
                  {rule.actions}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                  {formatDate(rule.lastModified)}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" onClick={() => navigate(`/rule-editor/${rule.id}`)} title="Edit Rule" className="h-8 w-8 transition-all-300 hover:border-app-blue hover:bg-app-blue/10 hover:shadow-sm text-[#1dbf73]">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 transition-all-300 hover:text-app-blue hover:border-app-blue hover:bg-app-blue/10 hover:shadow-sm" title="Duplicate Rule">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 transition-all-300 hover:text-app-delete hover:border-app-delete hover:bg-app-delete/10" title="Delete Rule">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>
      
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious className="transition-all hover:bg-app-blue/10 hover:text-app-blue" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => <PaginationItem key={i}>
              <PaginationLink isActive={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)} className={currentPage === i + 1 ? "bg-app-blue text-white hover:bg-app-blue/90" : "hover:bg-app-blue/10 hover:text-app-blue transition-all"}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>)}
          <PaginationItem>
            <PaginationNext className="transition-all hover:bg-app-blue/10 hover:text-app-blue" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>;
};
export default RulesTable;