"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { X } from "lucide-react";
import PriceRangeSlider from "./PriceRangeSlider";
import { CATEGORY_LABELS, CATEGORY_EMOJIS, CATEGORY_SLUGS } from "@/types";
import { cn } from "@/lib/utils";
import type { CategorySlug } from "@/types";

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest first"       },
  { value: "price_asc",  label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "name_asc",   label: "Name A → Z"         },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export default function FilterSidebar({ onClose }: { onClose?: () => void }) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const activeCategory = searchParams.get("category") as CategorySlug | null;
  const activeSort     = (searchParams.get("sort") ?? "newest") as SortValue;

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) { params.set(key, value); } else { params.delete(key); }
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  function toggleCategory(slug: CategorySlug) {
    setParam("category", activeCategory === slug ? null : slug);
    onClose?.();
  }

  function clearAll() {
    startTransition(() => router.push(pathname));
    onClose?.();
  }

  const hasFilters =
    searchParams.has("category") ||
    searchParams.has("min_price") ||
    searchParams.has("max_price") ||
    searchParams.get("sort") !== null;

  return (
    <div className="flex flex-col h-full">
      {/* Mobile drawer header */}
      {onClose && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Filters</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Desktop header */}
      {!onClose && (
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Filters</h2>
          {hasFilters && (
            <button onClick={clearAll} className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors">
              Clear all
            </button>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Sort */}
        <section aria-labelledby="sort-heading">
          <h3 id="sort-heading" className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Sort by</h3>
          <div className="space-y-1">
            {SORT_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setParam("sort", value === "newest" ? null : value)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                  activeSort === value
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <div className="border-t border-slate-100" />

        {/* Categories */}
        <section aria-labelledby="category-heading">
          <h3 id="category-heading" className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Category</h3>
          <div className="space-y-1">
            {CATEGORY_SLUGS.map((slug) => {
              const active = activeCategory === slug;
              return (
                <label
                  key={slug}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer select-none transition-colors",
                    active ? "bg-blue-50" : "hover:bg-slate-50"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleCategory(slug)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-base leading-none">{CATEGORY_EMOJIS[slug]}</span>
                  <span className={cn("text-sm", active ? "text-blue-700 font-semibold" : "text-slate-700")}>
                    {CATEGORY_LABELS[slug]}
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        <div className="border-t border-slate-100" />

        {/* Price */}
        <section aria-labelledby="price-heading">
          <h3 id="price-heading" className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Price range (RWF)</h3>
          <PriceRangeSlider />
        </section>
      </div>

      {/* Mobile apply */}
      {onClose && hasFilters && (
        <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
          <button onClick={clearAll} className="flex-1 btn-secondary py-2.5 text-sm">Clear</button>
          <button onClick={onClose}  className="flex-1 btn-primary py-2.5 text-sm">View results</button>
        </div>
      )}
    </div>
  );
}
