import Link from "next/link";
import type { Metadata } from "next";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS, type PaymentMethod } from "@/types";
import type { OrderStatus } from "@/types";

export const metadata: Metadata = {
  title: "My orders — TechShop",
  robots: { index: false, follow: false },
};

interface RawOrder {
  id:           string;
  status:       string;
  grand_total:  number;
  payment_method: string;
  created_at:   string;
  order_items:  { id: string }[];
}

function shortRef(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day:   "numeric",
    month: "short",
    year:  "numeric",
  }).format(new Date(iso));
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    "bg-amber-500/20 text-amber-300",
  confirmed:  "bg-blue-500/20 text-blue-300",
  processing: "bg-purple-500/20 text-purple-300",
  shipped:    "bg-indigo-500/20 text-indigo-300",
  delivered:  "bg-green-500/20 text-green-400",
  cancelled:  "bg-red-500/20 text-red-400",
  refunded:   "bg-slate-500/20 text-slate-400",
};

export default async function AccountOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, grand_total, payment_method, created_at, order_items(id)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orderList = (orders ?? []) as RawOrder[];

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">My orders</h1>
            <p className="text-slate-300 mt-1 text-sm">
              {orderList.length} order{orderList.length !== 1 ? "s" : ""} placed
            </p>
          </div>
          <Link href="/account" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
            ← Back to profile
          </Link>
        </div>

        {orderList.length === 0 ? (
          <div className="card p-12 text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-white font-semibold">No orders yet</p>
            <p className="text-slate-300 text-sm">Browse our catalogue and place your first order.</p>
            <Link href="/products" className="btn-primary inline-block px-6 py-2.5 text-sm mt-2">
              Shop now
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {orderList.map((order) => {
              const status = order.status as OrderStatus;
              const payment = order.payment_method as PaymentMethod;
              const itemCount = order.order_items?.length ?? 0;

              return (
                <li key={order.id}>
                  <Link
                    href={`/order-confirmation?id=${order.id}`}
                    className="card p-5 flex items-center gap-4 hover:border-brand-500/40 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-brand-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          Order #{shortRef(order.id)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_COLORS[status] ?? STATUS_COLORS.pending}`}>
                          {ORDER_STATUS_LABELS[status] ?? order.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        {formatDate(order.created_at)} · {itemCount} item{itemCount !== 1 ? "s" : ""} · {PAYMENT_METHOD_LABELS[payment] ?? order.payment_method}
                      </p>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-2">
                      <span className="font-bold text-white tabular-nums text-sm">
                        {formatPrice(order.grand_total)}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-400 transition-colors" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
