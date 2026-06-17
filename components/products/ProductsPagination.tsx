"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductsPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function ProductsPagination({ currentPage, totalPages }: ProductsPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) { params.delete("page"); } else { params.set("page", String(page)); }
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  function getPages(): (number | "…")[] {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (currentPage > 3) pages.push("…");
    const start = Math.max(2, currentPage - 1);
    const end   = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex items-center justify-center gap-1.5 mt-12",
        isPending && "opacity-60 pointer-events-none"
      )}
    >
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-surface-500 text-sm font-medium text-slate-400 hover:border-brand-500 hover:text-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center gap-1">
        {getPages().map((page, i) =>
          page === "…" ? (
            <span key={`ellipsis-${i}`} className="px-2 text-slate-500 select-none">…</span>
          ) : (
            <button
              key={page}
              onClick={() => goToPage(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "w-9 h-9 rounded-lg text-sm font-bold transition-colors",
                page === currentPage
                  ? "bg-brand-600 text-white shadow-sm"
                  : "border border-surface-500 text-slate-400 hover:border-brand-500 hover:text-brand-400"
              )}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-surface-500 text-sm font-medium text-slate-400 hover:border-brand-500 hover:text-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
