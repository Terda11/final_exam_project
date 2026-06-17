"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useCart } from "@/lib/hooks/useCart";

export default function CheckoutPage() {
  const { items } = useCart();
  const router    = useRouter();

  useEffect(() => {
    if (items.length === 0) router.replace("/cart");
  }, [items.length, router]);

  if (items.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="mb-8">
        <h1 className="font-sans text-3xl font-black text-white">
          Checkout
        </h1>
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
          <Lock className="w-3.5 h-3.5 text-neon-400" aria-hidden="true" />
          Secure checkout — all payments are simulated
        </div>
      </div>

      {/* Steps */}
      <ol className="flex items-center gap-0 mb-10 max-w-sm" aria-label="Order steps">
        {[
          { step: 1, label: "Cart",     done: true  },
          { step: 2, label: "Shipping", done: false },
          { step: 3, label: "Confirm",  done: false },
        ].map(({ step, label, done }, i, arr) => (
          <li key={step} className="flex items-center">
            <div className="flex items-center gap-2">
              <span
                className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-xs font-black
                  ${done
                    ? "bg-brand-600 text-white"
                    : step === 2
                    ? "bg-brand-500/20 text-brand-400 ring-2 ring-brand-500"
                    : "bg-surface-600 text-slate-500"}
                `}
                aria-current={step === 2 ? "step" : undefined}
              >
                {done ? "✓" : step}
              </span>
              <span className={`text-xs font-medium hidden sm:inline ${
                step === 2 ? "text-brand-400" : done ? "text-slate-400" : "text-slate-500"
              }`}>
                {label}
              </span>
            </div>
            {i < arr.length - 1 && (
              <div className="w-8 h-px bg-surface-500 mx-2" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <CheckoutForm />
        </div>
        <div className="lg:col-span-2">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
