import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchFeaturedProducts } from "@/lib/data/products";
import ProductCard from "@/components/products/ProductCard";

export default async function FeaturedProducts() {
  const products = await fetchFeaturedProducts(8);
  if (products.length === 0) return null;

  return (
    <section className="section-surface py-14 sm:py-20 border-y border-blue-100/50" aria-labelledby="featured-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="section-label mb-1.5">⭐ Best sellers</p>
            <h2 id="featured-heading" className="text-2xl sm:text-3xl font-black text-slate-900">
              Featured Products
            </h2>
          </div>
          <Link href="/products" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors group">
            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/products" className="btn-primary text-sm px-8 py-3">
            View all products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
