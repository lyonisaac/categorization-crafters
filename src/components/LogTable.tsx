
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
} from '@/components/ui';
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Filter,
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
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'duplicate':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getOutcomeColor = (outcome: string) => {
    return outcome === 'success'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };
  
  const filteredLogs = mockLogs.filter(log => 
    log.ruleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.outcome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Action Logs</h2>
        <Button 
          className="bg-app-blue hover:bg-app-blue/90 text-white flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10 glass-card"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2 glass-card">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>
      
      <div className="overflow-hidden rounded-lg glass-card">
        <Table>
          <TableHeader className="bg-white/80">
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Rule Name</TableHead>
              <TableHead>Outcome</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow 
                key={log.id}
                className="transition-all-300 hover:bg-white/50"
              >
                <TableCell>{formatDate(log.timestamp)}</TableCell>
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

export default LogTable;
