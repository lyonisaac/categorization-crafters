import React from 'react';
import { Input } from '@/components/ui';
import { Search } from 'lucide-react';

interface RulesTableSearchProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const RulesTableSearch: React.FC<RulesTableSearchProps> = ({
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="relative mb-8">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <Input 
        className="pl-10 glass-card shadow-sm focus:ring-2 focus:ring-app-blue/30 transition-all duration-200" 
        placeholder="Search rules..." 
        value={searchTerm} 
        onChange={e => setSearchTerm(e.target.value)} 
      />
    </div>
  );
};

export default RulesTableSearch;
