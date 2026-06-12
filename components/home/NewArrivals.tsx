import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { fetchProducts } from "@/lib/data/products";
import ProductCard from "@/components/products/ProductCard";

export default async function NewArrivals() {
  const { products } = await fetchProducts({ sort: "newest", perPage: 4 });

  if (products.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 py-14 sm:py-16 border-y border-indigo-100/60" aria-labelledby="new-arrivals-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="inline-flex items-center gap-1.5 section-label mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Just landed
            </p>
            <h2 id="new-arrivals-heading" className="text-2xl sm:text-3xl font-black text-slate-900">
              New Devices 2026
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              iPhone 16, Galaxy S24 Ultra, MacBook Pro M3 and more
            </p>
          </div>
          <Link href="/products?sort=newest" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors group">
            See all new <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
