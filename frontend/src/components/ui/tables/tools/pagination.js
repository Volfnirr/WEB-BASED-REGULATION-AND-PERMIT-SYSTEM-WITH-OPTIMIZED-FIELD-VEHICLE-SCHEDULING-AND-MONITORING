import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className,
}) {
  const pageCount = Math.max(totalPages, 1);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const previousDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= pageCount;

  return (
    <nav
      aria-label="Table pagination"
      className={cn(
        "my-4 flex flex-col gap-3 rounded-md bg-white px-3 py-2 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p aria-live="polite" className="text-[#64748B]">
        Showing {startItem}–{endItem} of {totalItems}
      </p>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={previousDisabled}
          aria-label="Go to previous page"
          className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-[#DCE2E8] px-2.5 text-xs text-[#475569] transition-colors hover:bg-[#F5F6F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005221]/30 disabled:pointer-events-none disabled:opacity-45"
        >
          <ChevronLeft aria-hidden="true" className="size-3.5" />
          <span>Previous</span>
        </button>
        <span className="sr-only" aria-live="polite">
          Page {currentPage} of {pageCount}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(currentPage + 1, pageCount))}
          disabled={nextDisabled}
          aria-label="Go to next page"
          className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-[#DCE2E8] px-2.5 text-xs text-[#475569] transition-colors hover:bg-[#F5F6F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005221]/30 disabled:pointer-events-none disabled:opacity-45"
        >
          <span>Next</span>
          <ChevronRight aria-hidden="true" className="size-3.5" />
        </button>
      </div>
    </nav>
  );
}
