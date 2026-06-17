"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import FilterSidebar from "./FilterSidebar";
import { cn } from "@/lib/utils";

export default function FilterDrawerToggle() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => { setOpen(false); }, [searchParams]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const activeCount = [
    searchParams.has("category"),
    searchParams.has("min_price"),
    searchParams.has("max_price"),
    searchParams.get("sort") !== null,
  ].filter(Boolean).length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-500 text-sm font-medium text-slate-300 hover:border-brand-500 hover:text-brand-400 transition-colors"
        aria-label="Open filters"
        aria-expanded={open}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {activeCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold">
            {activeCount}
          </span>
        )}
      </button>

      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden",
          "transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      <aside
        aria-label="Product filters"
        aria-hidden={!open}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 bg-surface-800 border-r border-surface-600 shadow-2xl lg:hidden",
          "flex flex-col p-5",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <FilterSidebar onClose={() => setOpen(false)} />
      </aside>
    </>
  );
}
