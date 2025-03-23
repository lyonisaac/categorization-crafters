import React, { useState, useMemo } from 'react';
import { TableBody, Button } from '@/components/ui';
import { Download } from 'lucide-react';
import { LogEntry } from '@/types/log-table-types';
import { mockLogs } from '@/data/mock-logs';
import { usePagination } from '@/hooks/usePagination';
import { formatDateWithSeconds } from '@/utils/date-utils';
import SearchableTable from '@/components/common/SearchableTable';

// Import extracted components
import {
  LogTableHeader,
  LogTableRow
} from './LogTable/index';

const LogTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredLogs = useMemo(() => {
    return mockLogs.filter(log => 
      log.ruleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.outcome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedLogs
  } = usePagination({
    data: filteredLogs,
    itemsPerPage: 5
  });

  // Create export button for header content
  const headerContent = (
    <Button 
      className="bg-app-blue hover:bg-app-blue/90 text-white flex items-center gap-2 shadow-sm transition-all duration-200 hover:shadow"
    >
      <Download className="h-4 w-4" />
      Export Logs
    </Button>
  );

  return (
    <SearchableTable
      title="Action Logs"
      searchPlaceholder="Search logs..."
      headerContent={headerContent}
      tableHeader={<LogTableHeader />}
      tableBody={
        <TableBody>
          {paginatedLogs.map((log, index) => (
            <LogTableRow 
              key={log.id}
              log={log}
              index={index}
              formatDate={formatDateWithSeconds}
            />
          ))}
        </TableBody>
      }
      onSearch={setSearchTerm}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  );
};

export default LogTable;
