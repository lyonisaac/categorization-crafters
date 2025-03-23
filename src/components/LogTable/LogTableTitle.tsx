import React from 'react';
import { Button } from '@/components/ui';
import { Download } from 'lucide-react';

const LogTableTitle: React.FC = () => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-heading font-semibold">Action Logs</h2>
      <Button 
        className="bg-app-blue hover:bg-app-blue/90 text-white flex items-center gap-2 shadow-sm transition-all duration-200 hover:shadow"
      >
        <Download className="h-4 w-4" />
        Export Logs
      </Button>
    </div>
  );
};

export default LogTableTitle;
