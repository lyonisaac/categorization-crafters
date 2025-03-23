import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui';

const LogTableHeader: React.FC = () => {
  return (
    <TableHeader className="bg-white/80 backdrop-blur-sm">
      <TableRow className="border-b border-gray-200">
        <TableHead className="font-medium">Timestamp</TableHead>
        <TableHead className="font-medium">Action</TableHead>
        <TableHead className="font-medium">Rule Name</TableHead>
        <TableHead className="font-medium">Outcome</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default LogTableHeader;
