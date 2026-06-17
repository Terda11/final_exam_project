import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { ShippingAddress, PaymentMethod, Product, Category } from "@/types";

// ── Input types ───────────────────────────────────────────────────
interface OrderItemInput {
  product_id: string;
  quantity:   number;
  price:      number;   // unit price snapshot
  line_total: number;   // price × quantity
  product?:    Product;
}

interface CreateOrderBody {
  items:            OrderItemInput[];
  shipping_address: ShippingAddress;
  payment_method:   PaymentMethod;
  notes:            string | null;
  total:            number;   // subtotal (without shipping)
  shipping_fee:     number;
  grand_total:      number;   // total + shipping_fee
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

function normalizeLegacyProductId(productId: string): string | null {
  if (productId.startsWith("b1000000-")) {
    return productId.replace(/^b1000000-/, "p1000000-");
  }
  if (productId.startsWith("p1000000-")) {
    return productId.replace(/^p1000000-/, "b1000000-");
  }
  return null;
}

async function resolveProductId(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  productId: string
): Promise<string | null> {
  const candidateIds = [productId, normalizeLegacyProductId(productId)].filter(Boolean) as string[];

  for (const id of candidateIds) {
    if (!isValidUuid(id)) continue;

    const { data, error } = await supabase
      .from("products")
      .select("id")
      .eq("id", id)
      .single();

    if (!error && data?.id) return data.id;
  }

  return null;
}

async function getCategoryIdFromProduct(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  product: Product
): Promise<string | null> {
  if (product.category) {
    return await findOrCreateCategory(supabase, product.category);
  }

  return await findOrCreateCategoryById(supabase, product.category_id);
}

async function ensureUserExists(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  userId: string
): Promise<boolean> {
  if (!isValidUuid(userId)) return false;

  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .single();

  return !error && Boolean(data?.id);
}

async function findOrCreateProduct(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  product: Product,
  fallbackArtisanId: string
): Promise<string | null> {
  const categoryId = await getCategoryIdFromProduct(supabase, product);
  if (!categoryId) return null;

  const candidateIds = [product.id, normalizeLegacyProductId(product.id)].filter(Boolean) as string[];
  for (const id of candidateIds) {
    if (!isValidUuid(id)) continue;

    const { data: existingById, error: idError } = await supabase
      .from("products")
      .select("id")
      .eq("id", id)
      .single();

    if (!idError && existingById?.id) return existingById.id;
  }

  const { data: existingByName, error: existingNameError } = await supabase
    .from("products")
    .select("id")
    .eq("name", product.name)
    .eq("category_id", categoryId)
    .single();

  if (!existingNameError && existingByName?.id) return existingByName.id;

  const artisanId = await ensureUserExists(supabase, product.artisan_id)
    ? product.artisan_id
    : fallbackArtisanId;

  const newProductId = isValidUuid(product.id) ? product.id : crypto.randomUUID();

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        id:           newProductId,
        name:         product.name,
        description:  product.description,
        price:        product.price,
        stock:        product.stock,
        category_id:  categoryId,
        image_url:    product.image_url,
        gallery:      product.gallery,
        artisan_id:   artisanId,
        is_featured:  product.is_featured,
        is_active:    product.is_active,
        weight_grams: product.weight_grams,
      },
    ])
    .select("id")
    .single();

  if (!error && data?.id) return data.id;

  const { data: fallback, error: fallbackError } = await supabase
    .from("products")
    .select("id")
    .eq("name", product.name)
    .eq("category_id", categoryId)
    .single();

  return !fallbackError && fallback?.id ? fallback.id : null;
}

async function findOrCreateCategoryById(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  categoryId: string
): Promise<string | null> {
  if (!isValidUuid(categoryId)) return null;

  const { data, error } = await supabase
    .from("categories")
    .select("id")
    .eq("id", categoryId)
    .single();

  return !error && data?.id ? data.id : null;
}

async function findOrCreateCategory(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  category: Category
): Promise<string | null> {
  const { data: existingById } = await supabase
    .from("categories")
    .select("id")
    .eq("id", category.id)
    .single();

  if (existingById?.id) return existingById.id;

  const { data: existingBySlug } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", category.slug)
    .single();

  if (existingBySlug?.id) return existingBySlug.id;

  const { data, error } = await supabase
    .from("categories")
    .insert([
      {
        id:          category.id,
        name:        category.name,
        slug:        category.slug,
        description: category.description,
        image_url:   category.image_url,
      },
    ])
    .select("id")
    .single();

  if (!error && data?.id) return data.id;

  const { data: fallback } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", category.slug)
    .single();

  return fallback?.id ?? null;
}

// ── GET /api/orders — customer's own orders only ──────────────────
// Admin order listing lives at /api/admin/orders
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const page    = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = 20;
  const from    = (page - 1) * perPage;

  const { data, error, count } = await supabase
    .from("orders")
    .select("*, order_items(*, product:products(id, name, image_url))", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, from + perPage - 1);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, total: count ?? 0, page, per_page: perPage });
}

// ── POST /api/orders ──────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  let body: CreateOrderBody;
  try {
    body = await request.json() as CreateOrderBody;
  } catch {
    return NextResponse.json({ message: "Corps de requête invalide" }, { status: 400 });
  }

  const { items, shipping_address, payment_method, notes, total, shipping_fee, grand_total } = body;

  if (!items?.length || !shipping_address || !total) {
    return NextResponse.json({ message: "Données manquantes" }, { status: 400 });
  }

  // ── 1. Create order ───────────────────────────────────────────
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([{
      user_id:          user.id,
      status:           "pending" as const,
      total:            Math.round(total * 100) / 100,
      shipping_fee:     Math.round(shipping_fee * 100) / 100,
      grand_total:      Math.round(grand_total * 100) / 100,
      shipping_address,
      payment_method:   (payment_method ?? "cash_on_delivery") as PaymentMethod,
      notes:            notes ?? null,
    }])
    .select()
    .single();

  if (orderError ?? !order) {
    return NextResponse.json(
      { message: orderError?.message ?? "Failed to create order" },
      { status: 500 }
    );
  }

  // ── 2. Ensure products exist, then create order items ──────────
  // Products from the cart include full product data. If the product doesn't
  // exist in the DB yet (seed not run), auto-create it using admin client.
  for (const item of items) {
    if (!isValidUuid(item.product_id)) continue;

    // Check if product exists
    const { data: exists } = await supabase
      .from("products")
      .select("id")
      .eq("id", item.product_id)
      .maybeSingle();

    if (!exists && item.product) {
      // Product missing — insert it using admin client
      try {
        const adminSupabase = await createAdminClient();

        // Ensure category exists
        if (item.product.category_id && isValidUuid(item.product.category_id)) {
          const { data: catExists } = await adminSupabase
            .from("categories")
            .select("id")
            .eq("id", item.product.category_id)
            .maybeSingle();

          if (!catExists && item.product.category) {
            await adminSupabase.from("categories").upsert({
              id:   item.product.category_id,
              name: item.product.category.name ?? "Uncategorized",
              slug: item.product.category.slug ?? "uncategorized",
            }, { onConflict: "id" });
          }
        }

        await adminSupabase.from("products").upsert({
          id:          item.product.id,
          name:        item.product.name,
          description: item.product.description,
          price:       item.product.price,
          stock:       item.product.stock ?? 100,
          category_id: item.product.category_id,
          artisan_id:  user.id,
          is_featured: item.product.is_featured ?? false,
          is_active:   item.product.is_active ?? true,
          image_url:   item.product.image_url,
        }, { onConflict: "id" });
      } catch (err) {
        console.error("Failed to auto-create product", item.product_id, err);
      }
    }
  }

  const resolvedItems = items.map((item) => ({
    order_id:   order.id,
    product_id: isValidUuid(item.product_id) ? item.product_id : "",
    quantity:   item.quantity,
    price:      Math.round(item.price * 100) / 100,
    line_total: Math.round(item.line_total * 100) / 100,
  }));

  const invalidItemIndex = resolvedItems.findIndex((item) => !item.product_id);
  if (invalidItemIndex !== -1) {
    await supabase.from("orders").delete().eq("id", order.id);
    return NextResponse.json(
      { message: "Invalid product ID format in cart. Please clear your cart and try again." },
      { status: 400 }
    );
  }

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(resolvedItems);

  if (itemsError) {
    // Rollback: delete the orphaned order
    await supabase.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ message: itemsError.message }, { status: 500 });
  }

  // ── 3. Decrement stock (best-effort, non-atomic) ──────────────
  try {
    const adminSupabase = await createAdminClient();
    for (const item of resolvedItems) {
      const { data: product } = await adminSupabase
        .from("products")
        .select("stock")
        .eq("id", item.product_id)
        .single();

      if (!product) continue;

      await adminSupabase
        .from("products")
        .update({ stock: Math.max(0, product.stock - item.quantity) })
        .eq("id", item.product_id);
    }
  } catch {
    // Stock decrement is best-effort — order still succeeds if admin client is unavailable
  }

  return NextResponse.json({ id: order.id }, { status: 201 });
}
