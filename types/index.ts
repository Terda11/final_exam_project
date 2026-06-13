import { z } from "zod";

// ── Primitives ────────────────────────────────────────────────────

export type UUID          = string;
export type ISODateString = string;
export type USD           = number;

// ── User ──────────────────────────────────────────────────────────

export type UserRole = "customer" | "admin";

export interface User {
  id:         UUID;
  email:      string;
  full_name:  string;
  phone:      string | null;
  address:    UserAddress | null;
  role:       UserRole;
  avatar_url: string | null;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface UserAddress {
  line1:     string;
  line2?:    string;
  city:      string;
  province:  Province;
  country:   "Rwanda";
}

export const userAddressSchema = z.object({
  line1:    z.string().min(3, "Address too short"),
  line2:    z.string().optional(),
  city:     z.string().min(2, "City required"),
  province: z.enum(["Kigali", "Nord", "Sud", "Est", "Ouest"]),
  country:  z.literal("Rwanda"),
});

export type Province = "Kigali" | "Nord" | "Sud" | "Est" | "Ouest";

// ── Category ──────────────────────────────────────────────────────

export interface Category {
  id:          UUID;
  name:        string;
  slug:        CategorySlug;
  description: string | null;
  image_url:   string | null;
  created_at:  ISODateString;
}

export type CategorySlug =
  | "mobiles-tablets"
  | "laptops-computers"
  | "projectors"
  | "audio-sound"
  | "accessories";

export const CATEGORY_SLUGS: CategorySlug[] = [
  "mobiles-tablets",
  "laptops-computers",
  "projectors",
  "audio-sound",
  "accessories",
];

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  "mobiles-tablets":   "Mobiles & Tablets",
  "laptops-computers": "Laptops & Computers",
  "projectors":        "Projectors",
  "audio-sound":       "Audio & Sound",
  "accessories":       "Accessories",
};

export const CATEGORY_EMOJIS: Record<CategorySlug, string> = {
  "mobiles-tablets":   "📱",
  "laptops-computers": "💻",
  "projectors":        "📽️",
  "audio-sound":       "🎧",
  "accessories":       "🔌",
};

// ── Product ───────────────────────────────────────────────────────

export interface Product {
  id:           UUID;
  name:         string;
  description:  string;
  price:        USD;
  stock:        number;
  category_id:  UUID;
  category?:    Category;
  image_url:    string | null;
  gallery:      string[];
  artisan_id:   UUID;
  artisan?:     Pick<User, "id" | "full_name" | "avatar_url">;
  is_featured:  boolean;
  is_active:    boolean;
  weight_grams: number | null;
  created_at:   ISODateString;
  updated_at:   ISODateString;
}

export const productSchema = z.object({
  name:         z.string().min(2, "Name required").max(120),
  description:  z.string().min(10, "Description too short").max(2000),
  price:        z.number().positive("Price must be > 0"),
  stock:        z.number().int().min(0, "Stock must be ≥ 0"),
  category_id:  z.string().uuid("Invalid category"),
  image_url:    z.string().url("Invalid image URL").nullable(),
  gallery:      z.array(z.string().url()).max(8).default([]),
  is_featured:  z.boolean().default(false),
  is_active:    z.boolean().default(true),
  weight_grams: z.number().int().positive().nullable().default(null),
});

export type ProductFormValues = z.infer<typeof productSchema>;

// ── Cart ──────────────────────────────────────────────────────────

export interface CartItem {
  product_id: UUID;
  product:    Product;
  quantity:   number;
}

export interface Cart {
  items: CartItem[];
  total: USD;
}

export const addToCartSchema = z.object({
  product_id: z.string().uuid(),
  quantity:   z.number().int().min(1).max(99),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;

// ── Order ─────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending:    "Pending",
  confirmed:  "Confirmed",
  processing: "Processing",
  shipped:    "Shipped",
  delivered:  "Delivered",
  cancelled:  "Cancelled",
  refunded:   "Refunded",
};

export type PaymentMethod =
  | "credit_card"
  | "cash_on_delivery"
  | "mtn_momo"
  | "airtel_money";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  credit_card:      "Credit / Debit card",
  cash_on_delivery: "Cash on delivery",
  mtn_momo:         "MTN Mobile Money",
  airtel_money:     "Airtel Money",
};

export interface Order {
  id:               UUID;
  user_id:          UUID;
  customer?:        Pick<User, "id" | "full_name" | "email" | "phone">;
  items:            OrderItem[];
  status:           OrderStatus;
  total:            USD;
  shipping_fee:     USD;
  grand_total:      USD;
  shipping_address: ShippingAddress;
  payment_method:   PaymentMethod;
  notes:            string | null;
  created_at:       ISODateString;
  updated_at:       ISODateString;
}

export interface OrderItem {
  id:         UUID;
  order_id:   UUID;
  product_id: UUID;
  product?:   Pick<Product, "id" | "name" | "image_url" | "category_id">;
  quantity:   number;
  price:      USD;
  line_total: USD;
}

// ── Shipping ──────────────────────────────────────────────────────

export interface ShippingAddress {
  full_name:     string;
  phone:         string;
  address_line1: string;
  address_line2: string | null;
  city:          string;
  province:      Province;
  country:       "Rwanda";
}

export const shippingAddressSchema = z.object({
  full_name:     z.string().min(2, "Full name required"),
  phone:         z.string().min(6, "Phone number required"),
  address_line1: z.string().min(4, "Address required"),
  address_line2: z.string().nullable().default(null),
  city:          z.string().min(2, "City required"),
  province:      z.enum(["Kigali", "Nord", "Sud", "Est", "Ouest"]),
  country:       z.literal("Rwanda").default("Rwanda"),
});

export type ShippingAddressFormValues = z.infer<typeof shippingAddressSchema>;

export const checkoutSchema = z.object({
  shipping_address: shippingAddressSchema,
  payment_method:   z.enum(["credit_card", "cash_on_delivery", "mtn_momo", "airtel_money"]),
  notes:            z.string().max(300).nullable().default(null),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

// ── API helpers ───────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data:        T[];
  total:       number;
  page:        number;
  per_page:    number;
  total_pages: number;
}

export interface ApiSuccess<T> {
  data:     T;
  message?: string;
}

export interface ApiError {
  message:  string;
  code:     string;
  status:   number;
  details?: Record<string, string[]>;
}

// ── Filters / Query params ────────────────────────────────────────

export interface ProductFilters {
  category_id?:   UUID;
  category_slug?: CategorySlug;
  featured?:      boolean;
  active?:        boolean;
  min_price?:     USD;
  max_price?:     USD;
  search?:        string;
  page?:          number;
  per_page?:      number;
  sort?:          ProductSortKey;
}

export type ProductSortKey =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "name_asc";

export interface OrderFilters {
  status?:  OrderStatus;
  user_id?: UUID;
  page?:    number;
  per_page?: number;
}
