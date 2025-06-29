import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: PaginationProps) => {
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
      <div className="text-sm text-gray-600">
        Showing {(currentPage - 1) * 6 + 1} -{" "}
        {Math.min(currentPage * 6, totalItems)} of {totalItems} events
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant={currentPage === 1 ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(1)}
            >
              1
            </Button>
            {startPage > 2 && (
              <Button variant="outline" size="icon" disabled>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <Button variant="outline" size="icon" disabled>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant={currentPage === totalPages ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
