import { notFound }       from "next/navigation";
import Link                from "next/link";
import { Suspense }        from "react";
import type { Metadata }   from "next";
import { Truck, ShieldCheck, ChevronRight, RotateCcw } from "lucide-react";

import { fetchProductById, fetchSimilarProducts } from "@/lib/data/products";
import ProductGallery      from "@/components/products/ProductGallery";
import AddToCartActions    from "@/components/products/AddToCartActions";
import ProductCard         from "@/components/products/ProductCard";
import { CATEGORY_LABELS } from "@/types";
import { formatPrice, getImageUrl } from "@/lib/utils";
import type { Product }    from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  return fetchProductById(id);
}

async function getSimilarProducts(categoryId: string, excludeId: string): Promise<Product[]> {
  return fetchSimilarProducts(categoryId, excludeId);
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product not found" };

  const ogImage = getImageUrl(product.image_url);
  const desc    = product.description.slice(0, 155);

  return {
    title: product.name,
    description: desc,
    openGraph: {
      title:       `${product.name} — TechShop`,
      description: desc,
      images:      [{ url: ogImage, width: 800, height: 800, alt: product.name }],
      type:        "website",
    },
    twitter: {
      card:        "summary_large_image",
      title:       product.name,
      description: desc,
      images:      [ogImage],
    },
  };
}

function Breadcrumb({ product }: { product: Product }) {
  const categoryLabel = product.category
    ? CATEGORY_LABELS[product.category.slug]
    : null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-8">
      <Link href="/" className="hover:text-brand-400 transition-colors">Home</Link>
      <ChevronRight className="w-3 h-3 shrink-0" aria-hidden="true" />
      <Link href="/products" className="hover:text-brand-400 transition-colors">Products</Link>
      {categoryLabel && product.category && (
        <>
          <ChevronRight className="w-3 h-3 shrink-0" aria-hidden="true" />
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-brand-400 transition-colors">
            {categoryLabel}
          </Link>
        </>
      )}
      <ChevronRight className="w-3 h-3 shrink-0" aria-hidden="true" />
      <span className="text-white font-medium truncate max-w-[180px]">{product.name}</span>
    </nav>
  );
}

async function SimilarProducts({ product }: { product: Product }) {
  const similar = await getSimilarProducts(product.category_id, product.id);
  if (similar.length === 0) return null;

  return (
    <section className="mt-20 border-t border-surface-600 pt-14" aria-labelledby="similar-heading">
      <div className="flex items-center justify-between mb-8">
        <h2 id="similar-heading" className="font-sans text-2xl font-black text-white">
          You may also like
        </h2>
        {product.category && (
          <Link
            href={`/products?category=${product.category.slug}`}
            className="text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
          >
            View all →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {similar.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();
  const p = product as Product;

  const images: string[] = [
    ...(p.image_url ? [p.image_url] : []),
    ...(p.gallery ?? []),
  ];
  if (images.length === 0) images.push("/placeholder-product.jpg");

  const categoryLabel = p.category ? CATEGORY_LABELS[p.category.slug] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb product={p} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProductGallery images={images} productName={p.name} />

        <div className="flex flex-col gap-6">
          <div>
            {categoryLabel && p.category && (
              <Link
                href={`/products?category=${p.category.slug}`}
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-brand-400 hover:text-brand-300 transition-colors mb-2"
              >
                {categoryLabel}
              </Link>
            )}
            <h1 className="font-sans text-3xl sm:text-4xl font-black text-white leading-tight">
              {p.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-white tabular-nums">
              {formatPrice(p.price)}
            </span>
            {p.weight_grams && (
              <span className="text-sm text-slate-500">{p.weight_grams}g</span>
            )}
          </div>

          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">{p.description}</p>

          <AddToCartActions product={p} />

          <ul className="border-t border-surface-600 pt-6 space-y-3">
            <li className="flex items-center gap-3 text-sm text-slate-400">
              <Truck className="w-5 h-5 text-brand-400 shrink-0" aria-hidden="true" />
              <span>Fast delivery — 2 to 5 business days</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-400">
              <ShieldCheck className="w-5 h-5 text-brand-400 shrink-0" aria-hidden="true" />
              <span>2-year manufacturer warranty included</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-400">
              <RotateCcw className="w-5 h-5 text-brand-400 shrink-0" aria-hidden="true" />
              <span>30-day free returns</span>
            </li>
          </ul>
        </div>
      </div>

      <Suspense fallback={
        <div className="mt-20 border-t border-surface-600 pt-14">
          <div className="h-8 w-48 bg-surface-700 rounded-lg animate-pulse mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="aspect-square bg-surface-600" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-14 bg-surface-600 rounded" />
                  <div className="h-4 w-3/4 bg-surface-600 rounded" />
                  <div className="h-9 bg-surface-600 rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }>
        <SimilarProducts product={p} />
      </Suspense>
    </div>
  );
}
