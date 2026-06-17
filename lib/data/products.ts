import { createClient } from "@/lib/supabase/server";
import { ELECTRONICS_SLUGS } from "@/lib/constants/categories";
import {
  DEMO_CATEGORIES,
  getDemoProductById,
  getDemoSimilarProducts,
  queryDemoProducts,
} from "@/lib/data/demo-products";
import type { CategorySlug, Product, ProductSortKey } from "@/types";

export interface ProductQueryParams {
  category?: CategorySlug;
  search?: string;
  sort?: ProductSortKey;
  page?: number;
  perPage?: number;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}

const PER_PAGE_DEFAULT = 12;

export async function fetchProducts(
  params: ProductQueryParams = {}
): Promise<{ products: Product[]; total: number; source: "supabase" | "demo" }> {
  const page = Math.max(1, params.page ?? 1);
  const perPage = params.perPage ?? PER_PAGE_DEFAULT;
  const sort = params.sort ?? "newest";

  try {
    const supabase = await createClient();
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from("products")
      .select("*, category:categories(*), artisan:users(id, full_name, avatar_url)", {
        count: "exact",
      })
      .eq("is_active", true);

    if (params.featured) query = query.eq("is_featured", true);
    if (params.category) query = query.eq("category_id", await getCategoryId(params.category));
    if (params.search?.trim()) query = query.ilike("name", `%${params.search.trim()}%`);
    if (params.minPrice != null) query = query.gte("price", params.minPrice);
    if (params.maxPrice != null) query = query.lte("price", params.maxPrice);

    switch (sort) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "name_asc":
        query = query.order("name", { ascending: true });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const { data, count, error } = await query.range(from, to);

    if (!error && data && data.length > 0) {
      const electronics = (data as unknown as Product[]).filter(
        (p) => p.category && ELECTRONICS_SLUGS.includes(p.category.slug)
      );
      if (electronics.length > 0) {
        return {
          products: electronics,
          total: count ?? electronics.length,
          source: "supabase",
        };
      }
    }
  } catch {
    // Fall through to demo catalogue.
  }

  const demo = queryDemoProducts({
    category: params.category,
    search: params.search,
    sort,
    page,
    perPage,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    featured: params.featured,
  });

  return { ...demo, source: "demo" };
}

async function getCategoryId(slug: CategorySlug): Promise<string> {
  const demoId = DEMO_CATEGORIES.find((c) => c.slug === slug)?.id;
  if (demoId) return demoId;

  try {
    const supabase = await createClient();
    const { data } = await supabase.from("categories").select("id").eq("slug", slug).single();
    return data?.id ?? "";
  } catch {
    return "";
  }
}

export async function fetchFeaturedProducts(limit = 8): Promise<Product[]> {
  const { products } = await fetchProducts({ featured: true, perPage: limit });
  return products;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), artisan:users(id, full_name, avatar_url)")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (!error && data) {
      const product = data as unknown as Product;
      if (product.category && ELECTRONICS_SLUGS.includes(product.category.slug)) {
        return product;
      }
    }
  } catch {
    // Fall through to demo catalogue.
  }

  return getDemoProductById(id);
}

export async function fetchSimilarProducts(
  categoryId: string,
  excludeId: string
): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), artisan:users(id, full_name, avatar_url)")
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .neq("id", excludeId)
      .order("created_at", { ascending: false })
      .limit(4);

    if (!error && data && data.length > 0) {
      const electronics = (data as unknown as Product[]).filter(
        (p) => p.category && ELECTRONICS_SLUGS.includes(p.category.slug)
      );
      if (electronics.length > 0) return electronics;
    }
  } catch {
    // Fall through to demo catalogue.
  }

  return getDemoSimilarProducts(categoryId, excludeId);
}
