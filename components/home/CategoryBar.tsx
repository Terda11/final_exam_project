import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DEMO_CATEGORIES } from "@/lib/data/demo-products";
import { ELECTRONICS_SLUGS } from "@/lib/constants/categories";
import { CATEGORY_EMOJIS } from "@/types";
import type { Category, CategorySlug } from "@/types";

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    const filtered = (data ?? []).filter((c) =>
      ELECTRONICS_SLUGS.includes(c.slug as CategorySlug)
    ) as Category[];

    if (filtered.length > 0) return filtered;
  } catch {
    // Fall through to demo categories.
  }

  return DEMO_CATEGORIES;
}

const CAT_STYLES: Record<string, { bg: string; icon: string; border: string; hover: string }> = {
  "mobiles-tablets":   { bg: "bg-blue-50",    icon: "bg-blue-100 text-blue-600",     border: "border-blue-200",    hover: "hover:border-blue-400 hover:bg-blue-50"    },
  "laptops-computers": { bg: "bg-indigo-50",  icon: "bg-indigo-100 text-indigo-600", border: "border-indigo-200",  hover: "hover:border-indigo-400 hover:bg-indigo-50"  },
  "projectors":        { bg: "bg-purple-50",  icon: "bg-purple-100 text-purple-600", border: "border-purple-200",  hover: "hover:border-purple-400 hover:bg-purple-50"  },
  "audio-sound":       { bg: "bg-emerald-50", icon: "bg-emerald-100 text-emerald-600", border: "border-emerald-200", hover: "hover:border-emerald-400 hover:bg-emerald-50" },
  "accessories":       { bg: "bg-amber-50",   icon: "bg-amber-100 text-amber-600",   border: "border-amber-200",   hover: "hover:border-amber-400 hover:bg-amber-50"    },
};
const DEFAULT_STYLE = { bg: "bg-slate-50", icon: "bg-slate-100 text-slate-600", border: "border-slate-200", hover: "hover:border-slate-300" };

export default async function CategoryBar() {
  const categories = await getCategories();
  if (categories.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-100 py-14 sm:py-16 border-b border-blue-100/60" aria-labelledby="categories-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="section-label mb-1.5">Shop by category</p>
            <h2 id="categories-heading" className="text-2xl sm:text-3xl font-black text-slate-900">
              What are you looking for?
            </h2>
          </div>
          <Link href="/products" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors group">
            Browse all <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const emoji = CATEGORY_EMOJIS[cat.slug as keyof typeof CATEGORY_EMOJIS] ?? "⚡";
            const s     = CAT_STYLES[cat.slug] ?? DEFAULT_STYLE;
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`group flex flex-col items-center gap-3 p-5 rounded-xl bg-white/80 backdrop-blur-sm border-2 ${s.border} ${s.hover} shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md text-center`}
              >
                <div className={`flex items-center justify-center w-14 h-14 rounded-xl text-2xl ${s.icon} group-hover:scale-110 transition-transform duration-200`}>
                  {emoji}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-tight">{cat.name}</p>
                  {cat.description && (
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">{cat.description}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-5 sm:hidden text-center">
          <Link href="/products" className="text-sm font-semibold text-blue-600 hover:underline">
            View all products →
          </Link>
        </div>
      </div>
    </section>
  );
}
