"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, UserPlus, X, ShoppingBag, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthGateModalProps {
  open: boolean;
  onClose: () => void;
  productName?: string;
}

export default function AuthGateModal({ open, onClose, productName }: AuthGateModalProps) {
  const pathname = usePathname();
  const redirect = encodeURIComponent(pathname);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-gate-title"
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-white via-blue-50 to-indigo-50 shadow-2xl animate-scale-in overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-6 pt-8 pb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
            <ShoppingBag className="w-7 h-7" />
          </div>

          <h2 id="auth-gate-title" className="text-xl font-black text-slate-900">
            Sign in to order
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            {productName
              ? `Create a free account or sign in to add "${productName}" to your cart and complete your order.`
              : "Create a free account or sign in to add items to your cart and complete your order."}
          </p>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Secure checkout · Fast delivery across Rwanda
          </div>
        </div>

        <div className="px-6 pb-6 space-y-3">
          <Link
            href={`/login?redirect=${redirect}`}
            onClick={onClose}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl",
              "bg-blue-600 px-5 py-3 text-sm font-bold text-white",
              "hover:bg-blue-700 active:scale-[.98] transition-all shadow-md"
            )}
          >
            <LogIn className="w-4 h-4" />
            Sign in
          </Link>

          <Link
            href={`/register?redirect=${redirect}`}
            onClick={onClose}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl",
              "bg-white px-5 py-3 text-sm font-bold text-blue-700",
              "border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
            )}
          >
            <UserPlus className="w-4 h-4" />
            Create free account
          </Link>
        </div>
      </div>
    </div>
  );
}
