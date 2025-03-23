import React, { useState, ReactNode } from 'react';
import { Table, TableBody, TableHeader, Input } from '@/components/ui';
import { Search } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui';

interface SearchableTableProps {
  title: string;
  searchPlaceholder: string;
  headerContent?: ReactNode;
  tableHeader: ReactNode;
  tableBody: ReactNode;
  onSearch: (searchTerm: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * A reusable component for tables with search functionality and pagination
 */
const SearchableTable: React.FC<SearchableTableProps> = ({
  title,
  searchPlaceholder,
  headerContent,
  tableHeader,
  tableBody,
  onSearch,
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className={`space-y-6 animate-slide-in ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-semibold">{title}</h2>
        {headerContent}
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          className="pl-10 glass-card shadow-sm focus:ring-2 focus:ring-app-blue/30 transition-all duration-200" 
          placeholder={searchPlaceholder} 
          value={searchTerm} 
          onChange={handleSearchChange} 
        />
      </div>
      
      <div className="overflow-hidden rounded-lg glass-card shadow-md">
        <Table>
          {tableHeader}
          {tableBody}
        </Table>
      </div>
      
      {totalPages > 0 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                className="transition-all hover:bg-app-blue/10 hover:text-app-blue font-heading" 
                onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  isActive={currentPage === i + 1} 
                  onClick={() => onPageChange(i + 1)} 
                  className={`font-heading ${currentPage === i + 1 ? "bg-app-blue text-white hover:bg-app-blue/90" : "hover:bg-app-blue/10 hover:text-app-blue transition-all"}`}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                className="transition-all hover:bg-app-blue/10 hover:text-app-blue font-heading" 
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default SearchableTable;
