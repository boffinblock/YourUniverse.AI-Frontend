"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Helper to generate the visible page numbers & ellipsis (optimizes for large page counts)
function getPageNumbers(current: number, total: number): (number | "...")[] {
  const delta = 2; // number of pages to show around current
  const range: (number | "...")[] = [];

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    } else if (range[range.length - 1] !== "...") {
      range.push("...");
    }
  }
  return range;
}

export function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Defensive to make debugging safer:
  if (
    typeof currentPage !== "number" ||
    typeof totalPages !== "number" ||
    totalPages < 1
  ) {
    // Could render nothing, or a fallback/error boundary
    console.error("Pagination: Invalid props", { currentPage, totalPages });
    return null;
  }

  // Clamp currentPage to valid bounds
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  const pageNumbers = getPageNumbers(safeCurrentPage, totalPages);

  // Debug output for fast troubleshooting.
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug(
      "PaginationElement render",
      JSON.stringify({
        safeCurrentPage,
        totalPages,
        pageNumbers,
      })
    );
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={e => {
              e.preventDefault();
              if (safeCurrentPage > 1) onPageChange(safeCurrentPage - 1);
            }}
            aria-disabled={safeCurrentPage === 1}
            className={cn("", safeCurrentPage === 1 ? "pointer-events-none opacity-50 backdrop-blur-2xl" : "")}
          />
        </PaginationItem>

        {/* Pages with ellipsis - hidden on mobile, compact on small screens */}
        {pageNumbers.map((page, idx) =>
          page === "..." ? (
            <PaginationItem key={`ellipsis-${idx}`} className="hidden md:list-item">
              <span className="px-2 text-muted-foreground select-none">…</span>
            </PaginationItem>
          ) : (
            <PaginationItem key={page} className="hidden md:list-item">
              <PaginationLink
                href="#"
                isActive={page === safeCurrentPage}
                onClick={e => {
                  e.preventDefault();
                  if (page !== safeCurrentPage) onPageChange(Number(page));
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Mobile: show current page indicator between page numbers and Next */}
        <PaginationItem className="md:hidden flex items-center px-2 text-sm text-muted-foreground shrink-0">
          <span>{safeCurrentPage} / {totalPages}</span>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={e => {
              e.preventDefault();
              if (safeCurrentPage < totalPages) onPageChange(safeCurrentPage + 1);
            }}
            aria-disabled={safeCurrentPage === totalPages}
            className={cn(
              safeCurrentPage === totalPages ? "pointer-events-none opacity-50 backdrop-blur-2xl" : ""
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
