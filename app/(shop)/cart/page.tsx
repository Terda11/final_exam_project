"use client";

import Link from "next/link";
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { useCart } from "@/lib/hooks/useCart";

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-surface-700 border border-surface-600 mb-6">
        <ShoppingBag className="w-10 h-10 text-slate-400" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-black text-white mb-2">Your cart is empty</h1>
      <p className="text-slate-400 max-w-sm mb-8 text-sm">
        You haven&apos;t added any products yet. Browse our latest electronics.
      </p>
      <Link href="/products" className="inline-flex items-center gap-2 btn-primary px-6 py-3">
        Explore products
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function CartPage() {
  const { items, clearCart, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-sans text-3xl font-black text-white">My cart</h1>
          <p className="mt-1 text-sm text-slate-400">
            {itemCount} item{itemCount > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="hidden sm:flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors"
          aria-label="Clear cart"
        >
          <Trash2 className="w-4 h-4" />
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card p-5 sm:p-6">
          <ul aria-label="Items in your cart">
            {items.map((item) => (
              <CartItem key={item.product_id} item={item} />
            ))}
          </ul>
          <button
            onClick={clearCart}
            className="sm:hidden mt-4 flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors"
            aria-label="Clear cart"
          >
            <Trash2 className="w-4 h-4" />
            Clear cart
          </button>
        </div>
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
