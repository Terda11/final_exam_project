import type { Category, CategorySlug, Product, ProductSortKey } from "@/types";

const NOW = "2026-01-01T00:00:00.000Z";
const ADMIN_ID = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";

export const DEMO_CATEGORIES: Category[] = [
  {
    id: "c1000000-0000-0000-0000-000000000001",
    name: "Mobiles & Tablets",
    slug: "mobiles-tablets",
    description: "Smartphones, iPhones, Android phones, tablets and mobile accessories.",
    image_url: null,
    created_at: NOW,
  },
  {
    id: "c1000000-0000-0000-0000-000000000002",
    name: "Laptops & Computers",
    slug: "laptops-computers",
    description: "Laptops, desktops, chromebooks and computing peripherals.",
    image_url: null,
    created_at: NOW,
  },
  {
    id: "c1000000-0000-0000-0000-000000000003",
    name: "Projectors",
    slug: "projectors",
    description: "Business and home cinema projectors and screens.",
    image_url: null,
    created_at: NOW,
  },
  {
    id: "c1000000-0000-0000-0000-000000000004",
    name: "Audio & Sound",
    slug: "audio-sound",
    description: "Headphones, earbuds, speakers and soundbars.",
    image_url: null,
    created_at: NOW,
  },
  {
    id: "c1000000-0000-0000-0000-000000000005",
    name: "Accessories",
    slug: "accessories",
    description: "Cables, chargers, power banks, cases and more.",
    image_url: null,
    created_at: NOW,
  },
];

const categoryBySlug = Object.fromEntries(
  DEMO_CATEGORIES.map((c) => [c.slug, c])
) as Record<CategorySlug, Category>;

function product(
  id: string,
  name: string,
  description: string,
  price: number,
  stock: number,
  slug: CategorySlug,
  isFeatured: boolean,
  imageUrl: string
): Product {
  const category = categoryBySlug[slug];
  return {
    id,
    name,
    description,
    price,
    stock,
    category_id: category.id,
    category,
    image_url: imageUrl,
    gallery: [],
    artisan_id: ADMIN_ID,
    is_featured: isFeatured,
    is_active: true,
    weight_grams: null,
    created_at: NOW,
    updated_at: NOW,
  };
}

export const DEMO_PRODUCTS: Product[] = [
  product(
    "p1000000-0000-0000-0000-000000000001",
    "Samsung Galaxy A55 5G",
    "Samsung Galaxy A55 5G with 6.6\" Super AMOLED display, 50MP triple camera, and 5000mAh battery. 8GB RAM / 256GB storage.",
    520000,
    18,
    "mobiles-tablets",
    true,
    "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000002",
    "iPhone 15 128GB",
    "Apple iPhone 15 with 6.1\" Super Retina XDR display, A16 Bionic chip, 48MP main camera, and USB-C connector.",
    1250000,
    10,
    "mobiles-tablets",
    true,
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000003",
    "Samsung Galaxy Tab A9+ (Wi-Fi)",
    "11\" LCD tablet with Snapdragon 695, 8GB RAM, 128GB storage, and quad speakers tuned by Dolby Atmos.",
    430000,
    14,
    "mobiles-tablets",
    false,
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000004",
    "Tecno Camon 30 Pro 5G",
    "6.67\" AMOLED curved display, 50MP AI triple camera, Dimensity 7020, and 45W flash charging.",
    320000,
    22,
    "mobiles-tablets",
    false,
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000005",
    "HP 250 G10 Laptop 15.6\"",
    "Intel Core i5-1335U, 8GB RAM, 512GB SSD, 15.6\" Full HD IPS display, and Windows 11 Home.",
    890000,
    8,
    "laptops-computers",
    true,
    "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000006",
    "Lenovo IdeaPad Slim 3 i3",
    "Intel Core i3-1215U, 8GB RAM, 256GB SSD, 15.6\" FHD display, and Wi-Fi 6. Lightweight at 1.62kg.",
    650000,
    12,
    "laptops-computers",
    false,
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000007",
    "MacBook Air M2 13\"",
    "Apple M2 chip, 8GB unified memory, 256GB SSD, 13.6\" Liquid Retina display, up to 18 hours battery.",
    1850000,
    5,
    "laptops-computers",
    true,
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000008",
    "Dell Inspiron 15 Core i7",
    "Intel Core i7-1355U, 16GB DDR4, 512GB SSD, NVIDIA GeForce MX550, and 15.6\" FHD display.",
    1150000,
    7,
    "laptops-computers",
    false,
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000009",
    "Epson EB-X49 3LCD Projector",
    "3600 lumens colour brightness, XGA resolution, HDMI and VGA connectivity, 6000-hour lamp life.",
    780000,
    6,
    "projectors",
    true,
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000010",
    "Sony VPL-DX221 Projector",
    "2800 ANSI lumens XGA desktop projector with HDMI, USB display, and Reality Creation technology.",
    728000,
    4,
    "projectors",
    true,
    "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000013",
    "Sony WH-1000XM5 Headphones",
    "Industry-leading noise cancelling over-ear headphones with 30 hours battery and Bluetooth 5.2.",
    380000,
    15,
    "audio-sound",
    true,
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000014",
    "JBL Charge 5 Bluetooth Speaker",
    "IP67 waterproof portable speaker with JBL Pro Sound, 20 hours playtime, and built-in power bank.",
    185000,
    20,
    "audio-sound",
    true,
    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000016",
    "Logitech Wireless Presenter R400",
    "Wireless presentation remote with 15m range, laser pointer, and plug-and-play USB receiver.",
    50000,
    35,
    "accessories",
    false,
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000017",
    "Anker 65W USB-C GaN Charger",
    "65W GaN charger with 2x USB-C and 1x USB-A ports. Charges laptop, tablet, and phone at once.",
    65000,
    40,
    "accessories",
    false,
    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000018",
    "Samsung T7 Portable SSD 1TB",
    "1050MB/s read speeds, USB 3.2 Gen 2, AES 256-bit encryption, and shock-resistant metal body.",
    135000,
    25,
    "accessories",
    true,
    "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&q=80"
  ),

  // ── New 2025–2026 devices ───────────────────────────────────────
  product(
    "p1000000-0000-0000-0000-000000000019",
    "iPhone 16 Pro Max 256GB",
    "Apple iPhone 16 Pro Max with 6.9\" Super Retina XDR display, A18 Pro chip, 48MP Fusion camera system, Action Button, and USB-C. Titanium design.",
    1680000,
    8,
    "mobiles-tablets",
    true,
    "https://images.unsplash.com/photo-1725574787862-2643afaa9d2e?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000020",
    "iPhone 16 128GB",
    "Apple iPhone 16 with 6.1\" display, A18 chip, 48MP dual camera, Dynamic Island, and all-day battery life. Available in Ultramarine, Teal, Pink.",
    1380000,
    12,
    "mobiles-tablets",
    true,
    "https://images.unsplash.com/photo-1725495698938-0668c371b169?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000021",
    "Samsung Galaxy S24 Ultra 256GB",
    "Galaxy S24 Ultra with 6.8\" QHD+ AMOLED, Snapdragon 8 Gen 3, 200MP camera, S Pen built-in, and Galaxy AI features. Titanium frame.",
    1450000,
    10,
    "mobiles-tablets",
    true,
    "https://images.unsplash.com/photo-1610945265064-0e34e55198df?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000022",
    "Google Pixel 9 Pro 128GB",
    "Google Pixel 9 Pro with 6.3\" Super Actua display, Tensor G4 chip, best-in-class AI photography, and 7 years of OS updates.",
    1120000,
    9,
    "mobiles-tablets",
    true,
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000023",
    "iPad Air M2 11\" 128GB",
    "Apple iPad Air with M2 chip, 11\" Liquid Retina display, 128GB storage, Wi-Fi 6E, and support for Apple Pencil Pro.",
    980000,
    11,
    "mobiles-tablets",
    false,
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000024",
    "MacBook Pro 14\" M3 Pro",
    "MacBook Pro 14\" with M3 Pro chip, 18GB unified memory, 512GB SSD, Liquid Retina XDR display, and up to 18 hours battery.",
    2450000,
    4,
    "laptops-computers",
    true,
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000025",
    "ASUS Vivobook 15 OLED",
    "ASUS Vivobook 15 with Intel Core i5-1335U, 16GB RAM, 512GB SSD, 15.6\" OLED display, and Windows 11 Home.",
    820000,
    14,
    "laptops-computers",
    true,
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000026",
    "Lenovo ThinkPad E14 Gen 5",
    "Lenovo ThinkPad E14 with AMD Ryzen 5 7530U, 16GB RAM, 512GB SSD, 14\" FHD IPS display, and military-grade durability.",
    950000,
    9,
    "laptops-computers",
    false,
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000027",
    "HP Pavilion 15 Core i7",
    "HP Pavilion 15 with Intel Core i7-1355U, 16GB RAM, 1TB SSD, 15.6\" FHD micro-edge display, and B&O audio.",
    1050000,
    7,
    "laptops-computers",
    true,
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000028",
    "Acer Nitro 5 Gaming Laptop",
    "Acer Nitro 5 with Intel Core i5-13420H, NVIDIA RTX 4050 6GB, 16GB RAM, 512GB SSD, and 15.6\" 144Hz FHD display.",
    1280000,
    6,
    "laptops-computers",
    true,
    "https://images.unsplash.com/photo-1603302576837-37561b976382?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000029",
    "Apple Watch Series 10 GPS 46mm",
    "Apple Watch Series 10 with largest display yet, S10 chip, advanced health sensors, and 18-hour battery. Aluminium case.",
    520000,
    16,
    "accessories",
    true,
    "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000030",
    "Bose QuietComfort Ultra Earbuds",
    "Bose QuietComfort Ultra with immersive audio, world-class noise cancellation, 6-hour battery, and IPX4 water resistance.",
    420000,
    18,
    "audio-sound",
    true,
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80"
  ),
  product(
    "p1000000-0000-0000-0000-000000000031",
    "BenQ TH685i 4K Gaming Projector",
    "BenQ TH685i with 3500 lumens, 4K HDR, 240Hz gaming mode, Android TV built-in, and low 8.3ms input lag.",
    1450000,
    3,
    "projectors",
    true,
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80"
  ),
];

export interface DemoProductQuery {
  category?: CategorySlug;
  search?: string;
  sort?: ProductSortKey;
  page?: number;
  perPage?: number;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}

function sortProducts(products: Product[], sort: ProductSortKey): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price_asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price_desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name_asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "oldest":
      return sorted.sort((a, b) => a.created_at.localeCompare(b.created_at));
    default:
      return sorted.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
}

export function queryDemoProducts(params: DemoProductQuery = {}): {
  products: Product[];
  total: number;
} {
  const page = Math.max(1, params.page ?? 1);
  const perPage = params.perPage ?? 12;
  const sort = params.sort ?? "newest";

  let filtered = DEMO_PRODUCTS.filter((p) => p.is_active);

  if (params.featured) {
    filtered = filtered.filter((p) => p.is_featured);
  }

  if (params.category) {
    filtered = filtered.filter((p) => p.category?.slug === params.category);
  }

  if (params.search?.trim()) {
    const term = params.search.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }

  if (params.minPrice != null) {
    filtered = filtered.filter((p) => p.price >= params.minPrice!);
  }

  if (params.maxPrice != null) {
    filtered = filtered.filter((p) => p.price <= params.maxPrice!);
  }

  filtered = sortProducts(filtered, sort);
  const total = filtered.length;
  const from = (page - 1) * perPage;

  return {
    products: filtered.slice(from, from + perPage),
    total,
  };
}

export function getDemoProductById(id: string): Product | null {
  return DEMO_PRODUCTS.find((p) => p.id === id && p.is_active) ?? null;
}

export function getDemoSimilarProducts(categoryId: string, excludeId: string): Product[] {
  return DEMO_PRODUCTS.filter(
    (p) => p.category_id === categoryId && p.id !== excludeId && p.is_active
  )
    .slice(0, 4);
}
