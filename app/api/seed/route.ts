import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

const CATEGORIES = [
  { id: "c1000000-0000-0000-0000-000000000001", name: "Mobiles & Tablets", slug: "mobiles-tablets" },
  { id: "c1000000-0000-0000-0000-000000000002", name: "Laptops & Computers", slug: "laptops-computers" },
  { id: "c1000000-0000-0000-0000-000000000003", name: "Projectors", slug: "projectors" },
  { id: "c1000000-0000-0000-0000-000000000004", name: "Audio & Sound", slug: "audio-sound" },
  { id: "c1000000-0000-0000-0000-000000000005", name: "Accessories", slug: "accessories" },
];

const PRODUCTS = [
  { id: "b1000000-0000-0000-0000-000000000001", name: "Samsung Galaxy A55 5G", price: 520000, stock: 18, category_id: "c1000000-0000-0000-0000-000000000001", is_featured: true, image_url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80", description: "Samsung Galaxy A55 5G with 6.6\" Super AMOLED display, 50MP triple camera, Exynos 1480 processor, 5000mAh battery." },
  { id: "b1000000-0000-0000-0000-000000000002", name: "iPhone 15 128GB", price: 1250000, stock: 10, category_id: "c1000000-0000-0000-0000-000000000001", is_featured: true, image_url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80", description: "Apple iPhone 15 with 6.1\" Super Retina XDR display, A16 Bionic chip, 48MP main camera, and USB-C connector." },
  { id: "b1000000-0000-0000-0000-000000000003", name: "Samsung Galaxy Tab A9+ (Wi-Fi)", price: 430000, stock: 14, category_id: "c1000000-0000-0000-0000-000000000001", is_featured: false, image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80", description: "Samsung Galaxy Tab A9+ with 11\" LCD display at 90Hz, Snapdragon 695, 8GB RAM, 128GB storage." },
  { id: "b1000000-0000-0000-0000-000000000004", name: "Tecno Camon 30 Pro 5G", price: 320000, stock: 22, category_id: "c1000000-0000-0000-0000-000000000001", is_featured: false, image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80", description: "Tecno Camon 30 Pro 5G with 6.78\" AMOLED display, Dimensity 8200 processor, 50MP camera with OIS." },
  { id: "b1000000-0000-0000-0000-000000000005", name: "HP 250 G10 Laptop 15.6\"", price: 890000, stock: 8, category_id: "c1000000-0000-0000-0000-000000000002", is_featured: true, image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80", description: "HP 250 G10 with Intel Core i5-1335U, 15.6\" FHD display, 8GB RAM, 256GB SSD, Windows 11 Pro." },
  { id: "b1000000-0000-0000-0000-000000000006", name: "MacBook Air M2 13\"", price: 1850000, stock: 5, category_id: "c1000000-0000-0000-0000-000000000002", is_featured: true, image_url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80", description: "Apple MacBook Air with M2 chip, 13.6\" Liquid Retina display, 8GB unified memory, 256GB SSD." },
  { id: "b1000000-0000-0000-0000-000000000007", name: "Lenovo IdeaPad 3 14\"", price: 680000, stock: 12, category_id: "c1000000-0000-0000-0000-000000000002", is_featured: false, image_url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80", description: "Lenovo IdeaPad 3 with AMD Ryzen 5 7520U, 14\" FHD display, 8GB RAM, 512GB SSD." },
  { id: "b1000000-0000-0000-0000-000000000008", name: "Dell Latitude 5540 15.6\"", price: 1450000, stock: 6, category_id: "c1000000-0000-0000-0000-000000000002", is_featured: false, image_url: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80", description: "Dell Latitude 5540 with Intel Core i7-1365U, 15.6\" FHD, 16GB RAM, 512GB SSD, Windows 11 Pro." },
  { id: "b1000000-0000-0000-0000-000000000009", name: "Epson EB-X49 3LCD Projector", price: 780000, stock: 7, category_id: "c1000000-0000-0000-0000-000000000003", is_featured: true, image_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80", description: "Epson EB-X49 with 3600 lumens, XGA resolution, 3LCD technology, HDMI and USB connectivity." },
  { id: "b1000000-0000-0000-0000-000000000010", name: "Sony VPL-DX221 Projector", price: 728000, stock: 4, category_id: "c1000000-0000-0000-0000-000000000003", is_featured: true, image_url: "https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=800&q=80", description: "Sony VPL-DX221 with 2800 lumens, XGA resolution, 3LCD, ideal for classrooms and small offices." },
  { id: "b1000000-0000-0000-0000-000000000011", name: "Sony WH-1000XM5 Headphones", price: 380000, stock: 15, category_id: "c1000000-0000-0000-0000-000000000004", is_featured: true, image_url: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80", description: "Sony WH-1000XM5 with industry-leading noise cancellation, 30-hour battery, and multipoint connection." },
  { id: "b1000000-0000-0000-0000-000000000012", name: "JBL Charge 5 Bluetooth Speaker", price: 185000, stock: 20, category_id: "c1000000-0000-0000-0000-000000000004", is_featured: true, image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80", description: "JBL Charge 5 with powerful JBL Pro Sound, IP67 waterproof and dustproof, 20 hours of playtime." },
  { id: "b1000000-0000-0000-0000-000000000013", name: "Anker 65W USB-C Charger", price: 45000, stock: 30, category_id: "c1000000-0000-0000-0000-000000000005", is_featured: false, image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80", description: "Anker 65W USB-C GaN charger with dual ports, compatible with laptops, phones, and tablets." },
  { id: "b1000000-0000-0000-0000-000000000014", name: "Anker 20000mAh Power Bank", price: 62000, stock: 25, category_id: "c1000000-0000-0000-0000-000000000005", is_featured: false, image_url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80", description: "Anker PowerCore 20000mAh with 22.5W fast charging, dual USB-C ports, LED display." },
];

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Login required" }, { status: 401 });
  }

  let adminSupabase;
  try {
    adminSupabase = await createAdminClient();
  } catch {
    return NextResponse.json({ message: "SUPABASE_SERVICE_ROLE_KEY not configured" }, { status: 500 });
  }

  // 1. Ensure user exists in users table (needed as artisan_id FK)
  await adminSupabase.from("users").upsert({
    id:        user.id,
    email:     user.email ?? "",
    full_name: user.email?.split("@")[0] ?? "Admin",
    role:      "admin",
  }, { onConflict: "id" });

  // 2. Upsert categories
  const { error: catError } = await adminSupabase
    .from("categories")
    .upsert(CATEGORIES, { onConflict: "id" });

  if (catError) {
    return NextResponse.json({ message: "Category insert failed", error: catError.message }, { status: 500 });
  }

  // 3. Upsert products (use current user as artisan)
  const productsWithArtisan = PRODUCTS.map((p) => ({
    ...p,
    artisan_id: user.id,
    is_active:  true,
  }));

  const { error: prodError } = await adminSupabase
    .from("products")
    .upsert(productsWithArtisan, { onConflict: "id" });

  if (prodError) {
    return NextResponse.json({ message: "Product insert failed", error: prodError.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Seed complete",
    categories: CATEGORIES.length,
    products: PRODUCTS.length,
  });
}
