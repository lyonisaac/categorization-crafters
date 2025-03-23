import React, { useState } from 'react';
import { Table, TableBody } from '@/components/ui';
import { mockLogs } from '@/types/log-table-types';

// Import extracted components
import {
  LogTableHeader,
  LogTableRow,
  LogTablePagination,
  LogTableSearch,
  LogTableTitle
} from './LogTable/index';

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
  
  const filteredLogs = mockLogs.filter(log => 
    log.ruleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.outcome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock pagination - in a real app this would use actual pagination logic
  const totalPages = Math.ceil(filteredLogs.length / 5);

  return (
    <div className="space-y-6 animate-slide-in">
      <LogTableTitle />
      
      <LogTableSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="overflow-hidden rounded-lg glass-card shadow-md">
        <Table>
          <LogTableHeader />
          <TableBody>
            {filteredLogs.map((log, index) => (
              <LogTableRow 
                key={log.id}
                log={log}
                index={index}
                formatDate={formatDate}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      
      <LogTablePagination 
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default LogTable;
