
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Input,
  Button,
  Badge,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui';
import {
  Search,
  Download,
  Filter,
  Calendar,
} from 'lucide-react';

// Mock data for log entries
const mockLogs = [
  {
    id: '1',
    timestamp: '2023-10-15T14:35:22Z',
    action: 'create',
    ruleName: 'Grocery Stores',
    outcome: 'success',
  },
  {
    id: '2',
    timestamp: '2023-10-15T10:22:43Z',
    action: 'update',
    ruleName: 'Utilities',
    outcome: 'success',
  },
  {
    id: '3',
    timestamp: '2023-10-14T16:47:09Z',
    action: 'delete',
    ruleName: 'Restaurants',
    outcome: 'success',
  },
  {
    id: '4',
    timestamp: '2023-10-14T11:15:38Z',
    action: 'duplicate',
    ruleName: 'Clothing Stores',
    outcome: 'success',
  },
  {
    id: '5',
    timestamp: '2023-10-13T09:30:14Z',
    action: 'update',
    ruleName: 'Coffee Shops',
    outcome: 'failure',
  },
  {
    id: '6',
    timestamp: '2023-10-12T13:45:51Z',
    action: 'create',
    ruleName: 'Salary',
    outcome: 'success',
  },
  {
    id: '7',
    timestamp: '2023-10-11T18:20:33Z',
    action: 'delete',
    ruleName: 'Entertainment',
    outcome: 'success',
  },
];

const LogTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };
  
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
  
  const filteredLogs = mockLogs.filter(log => 
    log.ruleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.outcome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock pagination - in a real app this would use actual pagination logic
  const totalPages = Math.ceil(filteredLogs.length / 5);

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Action Logs</h2>
        <Button 
          className="bg-app-blue hover:bg-app-blue/90 text-white flex items-center gap-2 shadow-sm transition-all duration-200 hover:shadow"
        >
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10 glass-card shadow-sm focus:ring-2 focus:ring-app-blue/30 transition-all duration-200 w-full"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex items-center gap-2 glass-card shadow-sm hover:bg-white/50 transition-all duration-200 flex-1 sm:flex-none">
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
          <Button variant="outline" className="flex items-center gap-2 glass-card shadow-sm hover:bg-white/50 transition-all duration-200 flex-1 sm:flex-none">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-lg glass-card shadow-md">
        <Table>
          <TableHeader className="bg-white/80 backdrop-blur-sm">
            <TableRow className="border-b border-gray-200">
              <TableHead className="font-medium">Timestamp</TableHead>
              <TableHead className="font-medium">Action</TableHead>
              <TableHead className="font-medium">Rule Name</TableHead>
              <TableHead className="font-medium">Outcome</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log, index) => (
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
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              className="transition-all hover:bg-app-blue/10 hover:text-app-blue" 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink 
                isActive={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? "bg-app-blue text-white hover:bg-app-blue/90" : "hover:bg-app-blue/10 hover:text-app-blue transition-all"}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext 
              className="transition-all hover:bg-app-blue/10 hover:text-app-blue" 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default LogTable;
