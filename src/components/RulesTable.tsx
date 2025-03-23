
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  Button,
  Input,
} from '@/components/ui';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Copy,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Mock data for demonstration
const mockRules = [
  {
    id: '1',
    name: 'Grocery Stores',
    criteria: 'Payee contains "Kroger", "Walmart", or "Trader Joe\'s"',
    actions: 'Assign to category: Groceries',
    lastModified: '2023-10-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'Utilities',
    criteria: 'Payee contains "Electric" or "Water"',
    actions: 'Assign to category: Utilities',
    lastModified: '2023-10-14T10:15:00Z'
  },
  {
    id: '3',
    name: 'Coffee Shops',
    criteria: 'Payee contains "Starbucks" or "Dunkin"',
    actions: 'Assign to category: Dining Out',
    lastModified: '2023-10-13T08:45:00Z'
  },
  {
    id: '4',
    name: 'Salary',
    criteria: 'Payee contains "Employer" and Amount > 1000',
    actions: 'Assign to category: Income, Add flag: Income',
    lastModified: '2023-10-12T16:20:00Z'
  },
  {
    id: '5',
    name: 'Subscriptions',
    criteria: 'Payee contains "Netflix" or "Spotify"',
    actions: 'Assign to category: Subscriptions',
    lastModified: '2023-10-11T12:00:00Z'
  }
];

const RulesTable: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
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
  
  const filteredRules = mockRules.filter(rule => 
    rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.criteria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.actions.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Transaction Rules</h2>
        <Button 
          className="bg-app-blue hover:bg-app-blue/90 text-white flex items-center gap-2"
          onClick={() => navigate('/rule-editor')}
        >
          <Plus className="h-4 w-4" />
          Create New Rule
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          className="pl-10 glass-card"
          placeholder="Search rules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="overflow-hidden rounded-lg glass-card">
        <Table>
          <TableHeader className="bg-white/80">
            <TableRow>
              <TableHead>Rule Name</TableHead>
              <TableHead className="hidden md:table-cell">Criteria</TableHead>
              <TableHead className="hidden md:table-cell">Actions</TableHead>
              <TableHead className="hidden sm:table-cell">Last Modified</TableHead>
              <TableHead className="text-right">Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRules.map((rule) => (
              <TableRow 
                key={rule.id}
                className="transition-all-300 hover:bg-white/50"
              >
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell className="hidden md:table-cell">{rule.criteria}</TableCell>
                <TableCell className="hidden md:table-cell">{rule.actions}</TableCell>
                <TableCell className="hidden sm:table-cell">{formatDate(rule.lastModified)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 transition-all-300 hover:text-app-blue hover:border-app-blue"
                    onClick={() => navigate(`/rule-editor/${rule.id}`)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 transition-all-300 hover:text-app-blue hover:border-app-blue"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 transition-all-300 hover:text-app-delete hover:border-app-delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-center sm:justify-end space-x-2 pt-2">
        <Button 
          variant="outline"
          size="icon"
          className="h-8 w-8 transition-all-300"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm">Page 1 of 1</div>
        <Button 
          variant="outline"
          size="icon"
          className="h-8 w-8 transition-all-300"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RulesTable;
