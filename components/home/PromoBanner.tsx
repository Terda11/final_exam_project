import Link from "next/link";
import { ArrowRight, Truck, CreditCard, ShieldCheck } from "lucide-react";

const PERKS = [
  { icon: Truck,       label: "Free delivery",    sub: "On orders over RWF 500,000" },
  { icon: CreditCard,  label: "Secure payment",   sub: "Card, MoMo & cash"          },
  { icon: ShieldCheck, label: "2-year warranty",  sub: "On all electronics"         },
] as const;

export default function PromoBanner() {
  return (
    <section aria-label="Benefits & promotions">

      {/* ── Perks strip ─────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-sky-50 border-y border-blue-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {PERKS.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-4 py-5 sm:px-8 first:sm:pl-0 last:sm:pr-0">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 shrink-0">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Promo banner ────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">New arrivals 2026</p>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                iPhone 16 &amp; latest laptops 💻
              </h2>
              <p className="text-blue-100 text-sm mt-1.5 max-w-md">
                Brand-new devices — iPhone 16 Pro Max, MacBook Pro M3, Galaxy S24 Ultra and more.
              </p>
            </div>
            <Link
              href="/products?category=mobiles-tablets"
              className="shrink-0 inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 font-black text-sm px-7 py-3.5 rounded-xl shadow-lg transition-all duration-150 hover:scale-105 active:scale-100 whitespace-nowrap"
            >
              Shop New Phones
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
