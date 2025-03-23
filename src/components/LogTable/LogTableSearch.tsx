import React from 'react';
import { Input, Button } from '@/components/ui';
import { Search, Calendar, Filter } from 'lucide-react';

interface LogTableSearchProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const LogTableSearch: React.FC<LogTableSearchProps> = ({
  searchTerm,
  setSearchTerm
}) => {
  return (
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
  );
};

export default LogTableSearch;
