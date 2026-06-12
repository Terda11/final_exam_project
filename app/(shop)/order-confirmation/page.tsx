import Link          from "next/link";
import { notFound }  from "next/navigation";
import { Suspense }  from "react";
import type { Metadata } from "next";
import {
  CheckCircle, Package, MapPin, Clock, ArrowRight, ShoppingBag,
} from "lucide-react";

import { createClient }  from "@/lib/supabase/server";
import ConfettiCanvas    from "@/components/order/ConfettiCanvas";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { ORDER_STATUS_LABELS }      from "@/types";
import type { Order }               from "@/types";

export const metadata: Metadata = {
  title: "Order confirmed — TechShop",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

interface RawOrderItem {
  id:         string;
  order_id:   string;
  product_id: string;
  quantity:   number;
  price:      number;
  line_total: number;
  product?: {
    id:          string;
    name:        string;
    image_url:   string | null;
    category_id: string;
  } | null;
}

interface RawOrder {
  id:               string;
  user_id:          string;
  status:           string;
  total:            number;
  shipping_fee:     number;
  grand_total:      number;
  shipping_address: Order["shipping_address"];
  payment_method:   string;
  notes:            string | null;
  created_at:       string;
  updated_at:       string;
  order_items:      RawOrderItem[];
}

async function getOrder(id: string): Promise<RawOrder | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*, product:products(id, name, image_url, category_id))")
    .eq("id", id)
    .eq("user_id", user?.id ?? "")
    .single();
  return data as RawOrder | null;
}

function shortRef(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day:    "numeric",
    month:  "long",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function OrderItemRow({ item }: { item: RawOrderItem }) {
  return (
    <li className="flex items-center gap-4 py-3.5 border-b border-surface-600 last:border-0">
      <div className="relative w-14 h-14 flex-none rounded-xl overflow-hidden bg-surface-700" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getImageUrl(item.product?.image_url ?? null)}
          alt={item.product?.name ?? "Product"}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-brand-600 text-white text-[10px] font-bold rounded-full">
          {item.quantity}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {item.product?.name ?? "Deleted product"}
        </p>
        <p className="text-xs text-slate-400 mt-0.5 tabular-nums">
          {formatPrice(item.price)} × {item.quantity}
        </p>
      </div>
      <span className="text-sm font-bold text-white tabular-nums flex-none">
        {formatPrice(item.line_total)}
      </span>
    </li>
  );
}

export default async function OrderConfirmationPage({ searchParams }: PageProps) {
  const { id } = await searchParams;
  if (!id) notFound();
  const orderId = id as string;

  const order = await getOrder(orderId);

  if (!order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-surface-700 border border-surface-500 mx-auto mb-5">
          <Package className="w-8 h-8 text-slate-400" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">Order not found</h1>
        <p className="text-slate-400 text-sm mb-6">
          Reference{" "}
          <span className="font-mono font-semibold text-white">{shortRef(orderId)}</span>{" "}
          does not match any order on your account.
        </p>
        <Link href="/products" className="btn-primary inline-flex items-center gap-2">
          Continue shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const { shipping_address: addr } = order;
  const statusLabel = ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]
    ?? order.status;

  const paymentLabel = order.payment_method === "credit_card"
    ? "Credit / Debit card (simulated)"
    : order.payment_method === "cash_on_delivery"
    ? "Cash on delivery"
    : order.payment_method;

  return (
    <>
      <Suspense fallback={null}>
        <ConfettiCanvas />
      </Suspense>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Success header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neon-500/10 border-4 border-neon-500/20 mb-5 animate-scale-in">
            <CheckCircle className="w-10 h-10 text-neon-400" aria-hidden="true" />
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-black text-white animate-slide-up">
            Order confirmed! 🎉
          </h1>
          <p className="mt-3 text-slate-400 animate-slide-up">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-surface-700 border border-surface-500 text-slate-300 px-4 py-2 rounded-full text-sm">
            <span className="text-slate-500">Ref.</span>
            <span className="font-mono font-bold text-white tracking-wider">#{shortRef(order.id)}</span>
            <span className="text-xs text-slate-500">·</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              order.status === "pending"
                ? "bg-gold-500/20 text-gold-400"
                : "bg-neon-500/20 text-neon-400"
            }`}>
              {statusLabel}
            </span>
          </div>
        </div>

        <div className="space-y-4">

          {/* Order items */}
          <div className="card p-5 sm:p-6">
            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-400" aria-hidden="true" />
              Items ordered
            </h2>
            <p className="text-xs text-slate-500 mb-4">Placed on {formatDate(order.created_at)}</p>
            <ul aria-label="Order items">
              {order.order_items.map((item) => (
                <OrderItemRow key={item.id} item={item} />
              ))}
            </ul>
            <dl className="mt-4 pt-4 border-t border-surface-600 space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <dt>Subtotal</dt>
                <dd className="tabular-nums text-white">{formatPrice(order.total)}</dd>
              </div>
              <div className="flex justify-between text-slate-400">
                <dt>Shipping</dt>
                <dd className="tabular-nums">
                  {order.shipping_fee === 0
                    ? <span className="text-neon-400 font-medium">Free</span>
                    : <span className="text-white">{formatPrice(order.shipping_fee)}</span>}
                </dd>
              </div>
              <div className="flex justify-between font-black text-white text-base pt-2 border-t border-surface-600">
                <dt>Total paid</dt>
                <dd className="tabular-nums">{formatPrice(order.grand_total)}</dd>
              </div>
            </dl>
            <div className="mt-3 pt-3 border-t border-surface-600 text-xs text-slate-500 flex items-center gap-2">
              <span>Payment:</span>
              <span className="text-slate-300 font-medium">{paymentLabel}</span>
            </div>
          </div>

          {/* Delivery address */}
          <div className="card p-5 sm:p-6">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-400" aria-hidden="true" />
              Delivery address
            </h2>
            <address className="not-italic text-sm text-slate-300 space-y-1">
              <p className="font-semibold text-white">{addr.full_name}</p>
              <p>{addr.phone}</p>
              <p>{addr.address_line1}</p>
              {addr.address_line2 && <p>{addr.address_line2}</p>}
              <p>{addr.city}, {addr.province}</p>
              <p>{addr.country}</p>
            </address>
            {order.notes && (
              <p className="mt-3 text-xs text-slate-500 italic border-t border-surface-600 pt-3">
                Note: {order.notes}
              </p>
            )}
          </div>

          {/* Next steps */}
          <div className="card p-5 sm:p-6 bg-brand-600/10 border-brand-600/20">
            <h2 className="text-base font-bold text-brand-300 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" aria-hidden="true" />
              What happens next
            </h2>
            <ul className="space-y-3 text-sm text-slate-300">
              {[
                "You will receive a confirmation email shortly",
                "Our team will prepare your order within 24 hours",
                "Estimated delivery: 2 – 5 business days",
                `Payment: ${paymentLabel}`,
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex-none w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href="/products" className="flex-1 flex items-center justify-center gap-2 btn-primary py-3">
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            Continue shopping
          </Link>
          <Link href="/" className="flex-1 flex items-center justify-center gap-2 btn-secondary py-3">
            Back to home
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  );
}
