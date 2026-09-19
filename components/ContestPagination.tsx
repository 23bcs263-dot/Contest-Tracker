import { ChevronLeft, ChevronRight } from "lucide-react";

interface ContestPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ContestPagination({ currentPage, totalPages, onPageChange }: ContestPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Contest pages" className="mt-7 flex items-center justify-center gap-2">
      <button
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
      </button>
      <div className="w-[16rem] overflow-x-auto sm:w-[22rem] [scrollbar-width:thin]">
        <div className="flex min-w-max gap-1 px-1 py-1">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => onPageChange(page)}
              className={`h-9 min-w-9 shrink-0 rounded-lg px-2 font-mono text-xs transition ${page === currentPage ? "bg-cyan-400 font-bold text-[#071014]" : "border border-white/[0.08] text-slate-500 hover:border-cyan-400/40 hover:text-cyan-300"}`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
      <button
        aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </nav>
  );
}