"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, Check, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import AuthGateModal from "@/components/auth/AuthGateModal";
import type { Product } from "@/types";

interface ToastState {
  visible: boolean;
  message: string;
  type: "success" | "error";
}

interface AddToCartActionsProps {
  product: Product;
}

export default function AddToCartActions({ product }: AddToCartActionsProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<ToastState>({ visible: false, message: "", type: "success" });
  const [authGateOpen, setAuthGateOpen] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); };
  }, []);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ visible: true, message, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 2500);
  }, []);

  function decrement() { setQuantity((q) => Math.max(1, q - 1)); }
  function increment() { setQuantity((q) => Math.min(product.stock, q + 1)); }

  async function checkAuth(): Promise<boolean> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setAuthGateOpen(true); return false; }
    return true;
  }

  async function handleAddToCart() {
    if (product.stock === 0) return;
    if (!await checkAuth()) return;
    addToCart(product, quantity);
    showToast(`${product.name} added to cart!`);
  }

  async function handleBuyNow() {
    if (product.stock === 0) return;
    if (!await checkAuth()) return;
    addToCart(product, quantity);
    router.push("/checkout");
  }

  const outOfStock = product.stock === 0;
  const lowStock   = product.stock > 0 && product.stock < 5;

  return (
    <>
    <AuthGateModal
      open={authGateOpen}
      onClose={() => setAuthGateOpen(false)}
      productName={product.name}
    />
    <div className="space-y-4">
      <p
        className={cn(
          "text-sm font-medium",
          outOfStock ? "text-red-400" : lowStock ? "text-orange-400" : "text-neon-400"
        )}
        aria-live="polite"
      >
        {outOfStock
          ? "Out of stock"
          : lowStock
          ? `⚠️ Only ${product.stock} left in stock — order soon`
          : `✓ In stock (${product.stock} available)`}
      </p>

      {/* Quantity selector */}
      {!outOfStock && (
        <div className="flex items-center gap-4">
          <div
            className="flex items-center border border-surface-500 rounded-xl overflow-hidden"
            role="group"
            aria-label="Quantity"
          >
            <button
              onClick={decrement}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-r border-surface-500"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span
              className="w-12 text-center text-sm font-bold tabular-nums text-white"
              aria-label={`Quantity: ${quantity}`}
            >
              {quantity}
            </span>
            <button
              onClick={increment}
              disabled={quantity >= product.stock}
              aria-label="Increase quantity"
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-l border-surface-500"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-500">Max {product.stock}</p>
        </div>
      )}

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm",
            "transition-all duration-150",
            outOfStock
              ? "bg-surface-600 text-slate-500 cursor-not-allowed"
              : "btn-primary hover:scale-[1.02] active:scale-100"
          )}
          aria-label={outOfStock ? "Out of stock" : "Add to cart"}
        >
          <ShoppingCart className="w-4 h-4" />
          Add to cart
        </button>

        <button
          onClick={handleBuyNow}
          disabled={outOfStock}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm",
            "transition-all duration-150",
            outOfStock
              ? "bg-surface-600 text-slate-500 cursor-not-allowed"
              : "bg-accent-500/15 text-accent-400 border border-accent-500/30 hover:bg-accent-500/25 hover:scale-[1.02] active:scale-100"
          )}
          aria-label="Buy now"
        >
          <Zap className="w-4 h-4" />
          Buy now
        </button>
      </div>

      {/* Toast notification */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          "flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium",
          "transition-all duration-300 ease-out",
          toast.visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-1 pointer-events-none",
          toast.type === "success"
            ? "bg-neon-500/10 text-neon-300 border border-neon-500/20"
            : "bg-red-500/10 text-red-400 border border-red-500/20"
        )}
      >
        {toast.type === "success" && (
          <Check className="w-4 h-4 text-neon-400 shrink-0" aria-hidden="true" />
        )}
        {toast.message}
      </div>

    </div>
    </>
  );
}
