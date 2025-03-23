import React from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui';

interface LogTablePaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const LogTablePagination: React.FC<LogTablePaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage
}) => {
  return (
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
  );
};

export default LogTablePagination;
