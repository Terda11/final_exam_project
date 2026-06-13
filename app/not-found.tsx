import Link from "next/link";
import { Zap, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6">

        <Link href="/" className="inline-flex items-center gap-2 group justify-center" aria-label="TechShop — Home">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white shadow-sm group-hover:bg-blue-700 transition-colors">
            <Zap className="w-5 h-5" />
          </span>
          <span className="font-black text-2xl">
            <span className="text-slate-900">Tech</span>
            <span className="text-blue-600">Shop</span>
          </span>
        </Link>

        <div className="card p-10 space-y-5">
          <p className="text-7xl font-black text-blue-600">404</p>
          <div>
            <h1 className="text-xl font-black text-slate-900">Page not found</h1>
            <p className="text-slate-500 text-sm mt-2">
              This page doesn&apos;t exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/" className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 justify-center">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            <Link href="/products" className="btn-secondary px-5 py-2.5 text-sm flex items-center gap-2 justify-center">
              <Search className="w-4 h-4" />
              Browse products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
