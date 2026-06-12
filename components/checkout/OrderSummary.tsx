"use client";

import Image from "next/image";
import { useCart } from "@/lib/hooks/useCart";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { SHIPPING_FEE, SHIPPING_THRESHOLD } from "@/components/cart/CartSummary";
import { cn } from "@/lib/utils";

export default function OrderSummary() {
  const { items, total } = useCart();
  const shipping   = total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const grandTotal = total + shipping;

  return (
    <aside className="card p-5 sticky top-20" aria-label="Order summary">
      <h2 className="text-base font-bold text-white mb-4">
        Your order ({items.length} item{items.length > 1 ? "s" : ""})
      </h2>

      <ul className="divide-y divide-surface-600 mb-4" aria-label="Items ordered">
        {items.map((item) => (
          <li key={item.product_id} className="py-3 flex gap-3 items-center">
            <div className="relative w-14 h-14 flex-none rounded-lg overflow-hidden bg-surface-700">
              <Image
                src={getImageUrl(item.product.image_url)}
                alt={item.product.name}
                fill
                className="object-cover"
                sizes="56px"
              />
              <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-brand-600 text-white text-[10px] font-bold rounded-full">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{item.product.name}</p>
              <p className="text-xs text-slate-400 mt-0.5 tabular-nums">
                {formatPrice(item.product.price)} × {item.quantity}
              </p>
            </div>
            <span className="text-sm font-bold text-white tabular-nums flex-none">
              {formatPrice(item.product.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="border-t border-surface-600 pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-slate-400">
          <dt>Subtotal</dt>
          <dd className="tabular-nums text-white">{formatPrice(total)}</dd>
        </div>
        <div className="flex justify-between text-slate-400">
          <dt>Shipping</dt>
          <dd className={cn("tabular-nums", shipping === 0 ? "text-neon-400 font-medium" : "text-white")}>
            {shipping === 0 ? "Free" : formatPrice(shipping)}
          </dd>
        </div>
        <div className="flex justify-between font-black text-white text-base pt-2 border-t border-surface-600">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatPrice(grandTotal)}</dd>
        </div>
      </dl>
    </aside>
  );
}
