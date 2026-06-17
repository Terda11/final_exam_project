"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { useRef, useTransition, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 300;

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get("search") ?? "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  function pushSearch(term: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (term) { params.set("search", term); } else { params.delete("search"); }
    params.delete("page");
    startTransition(() => { router.push(`${pathname}?${params.toString()}`); });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const term = e.target.value;
    setValue(term);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => pushSearch(term), DEBOUNCE_MS);
  }

  function handleClear() {
    setValue("");
    if (timerRef.current) clearTimeout(timerRef.current);
    pushSearch("");
  }

  return (
    <div className="relative flex-1">
      <Search
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors",
          isPending ? "text-brand-400 animate-pulse" : "text-slate-500"
        )}
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Search for a product…"
        aria-label="Search products"
        className="input pl-9 pr-8"
      />
      {value && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
