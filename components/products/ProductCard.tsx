"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check, Heart, Star, Eye } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, getImageUrl, cn } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/types";
import type { Product } from "@/types";
import AuthGateModal from "@/components/auth/AuthGateModal";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [authGateOpen, setAuthGateOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (product.stock === 0 || added) return;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setAuthGateOpen(true); return; }

    setAdded(true);
    addToCart(product, 1);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdded(false), 1800);
  }

  const categoryLabel = product.category ? CATEGORY_LABELS[product.category.slug] : null;
  const isLowStock    = product.stock > 0 && product.stock < 5;
  const isOutOfStock  = product.stock === 0;

  return (
    <>
    <AuthGateModal
      open={authGateOpen}
      onClose={() => setAuthGateOpen(false)}
      productName={product.name}
    />
    <article className={cn(
      "group relative flex h-full flex-col overflow-hidden rounded-xl",
      "border-2 border-blue-100 bg-white/90 backdrop-blur-sm shadow-card",
      "transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-card-hover"
    )}>

      {/* Image box — square, clearly bordered */}
      <div className="relative aspect-square border-b-2 border-slate-200 bg-slate-50">
        <Link href={`/products/${product.id}`} tabIndex={-1} aria-hidden="true" className="block h-full">
          <Image
            src={getImageUrl(product.image_url)}
            alt={product.name}
            fill
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width:640px)100vw,(max-width:1024px)50vw,33vw"
          />
        </Link>

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.is_featured && (
            <span className="badge bg-amber-100 text-amber-700 border border-amber-200">
              <Star className="w-2.5 h-2.5 fill-current" />
              Featured
            </span>
          )}
          {isLowStock && (
            <span className="badge bg-orange-100 text-orange-700 border border-orange-200">
              Only {product.stock} left
            </span>
          )}
          {isOutOfStock && (
            <span className="badge bg-red-100 text-red-600 border border-red-200">
              Sold out
            </span>
          )}
        </div>

        <button
          onClick={(e) => { e.preventDefault(); setWishlisted(v => !v); }}
          className={cn(
            "absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-md flex items-center justify-center",
            "bg-white shadow-sm border border-slate-200 transition-all duration-150",
            "opacity-0 group-hover:opacity-100",
            wishlisted ? "text-red-500 border-red-200 bg-red-50" : "text-slate-400 hover:text-red-500"
          )}
          aria-label="Add to wishlist"
        >
          <Heart className={cn("w-4 h-4", wishlisted && "fill-current")} />
        </button>

        <Link
          href={`/products/${product.id}`}
          className={cn(
            "absolute bottom-3 left-1/2 -translate-x-1/2 z-10",
            "inline-flex items-center gap-1.5 bg-white text-slate-700",
            "text-xs font-semibold px-3 py-1.5 rounded-md shadow-sm border border-slate-200",
            "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0",
            "transition-all duration-200 whitespace-nowrap"
          )}
        >
          <Eye className="w-3.5 h-3.5" />
          Quick view
        </Link>
      </div>

      {/* Info box — name then price directly underneath */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {categoryLabel && (
          <Link
            href={`/products?category=${product.category?.slug}`}
            className="self-start text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 hover:bg-blue-100 transition-colors"
          >
            {categoryLabel}
          </Link>
        )}

        <Link href={`/products/${product.id}`} className="block">
          <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 hover:text-blue-700 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-lg font-black text-blue-700 tabular-nums leading-none">
          {formatPrice(product.price)}
        </p>

        {isLowStock && (
          <p className="text-[11px] font-semibold text-orange-600">
            {product.stock} in stock
          </p>
        )}
      </div>

      <div className="border-t-2 border-slate-100 px-4 pb-4 pt-3 mt-auto">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-all duration-200",
            added
              ? "bg-green-600 text-white scale-[.98]"
              : isOutOfStock
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[.98] shadow-sm"
          )}
          aria-label={isOutOfStock ? "Out of stock" : `Add ${product.name} to cart`}
        >
          {added ? (
            <><Check className="w-4 h-4" /> Added to cart!</>
          ) : isOutOfStock ? (
            "Out of stock"
          ) : (
            <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
          )}
        </button>
      </div>
    </article>

    </>
  );
}
