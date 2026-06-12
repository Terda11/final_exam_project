import Link from "next/link";
import { Award, ShieldCheck, PackageCheck, Headphones, ArrowRight, Star } from "lucide-react";

const FEATURES = [
  {
    icon:  Award,
    title: "100% genuine products",
    desc:  "Every device is brand-new, factory sealed, sourced from authorized distributors only. No grey-market items.",
    bg:    "bg-blue-50",
    color: "text-blue-600",
  },
  {
    icon:  ShieldCheck,
    title: "Secure checkout",
    desc:  "Mock credit card checkout — test the full payment flow safely. No real charges, no stored card details.",
    bg:    "bg-green-50",
    color: "text-green-600",
  },
  {
    icon:  PackageCheck,
    title: "Fast delivery",
    desc:  "Orders dispatched within 24 hours. Free delivery on orders over RWF 500,000 with real-time tracking.",
    bg:    "bg-amber-50",
    color: "text-amber-600",
  },
  {
    icon:  Headphones,
    title: "24/7 support",
    desc:  "Our tech specialists are available around the clock via chat, email or phone for any question.",
    bg:    "bg-purple-50",
    color: "text-purple-600",
  },
];

const TESTIMONIALS = [
  {
    quote: "My laptop arrived the next day, perfectly packaged. The checkout was the smoothest I've experienced.",
    name:  "James M.",
    role:  "Verified buyer — Laptops",
    init:  "JM",
    bg:    "bg-blue-600",
  },
  {
    quote: "The Sony headphones sound incredible. TechShop had the best price and great warranty support.",
    name:  "Aisha K.",
    role:  "Verified buyer — Audio",
    init:  "AK",
    bg:    "bg-green-600",
  },
  {
    quote: "I ordered a projector for our office. It arrived in 2 days and the setup was easy. Very impressed.",
    name:  "David U.",
    role:  "Verified buyer — Projectors",
    init:  "DU",
    bg:    "bg-purple-600",
  },
];

export default function WhyUsSection() {
  return (
    <>
      {/* ── Why us ──────────────────────────────────────────── */}
      <section className="section-surface py-14 sm:py-20" aria-labelledby="why-us-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="section-label mb-2">Why choose us</p>
            <h2 id="why-us-heading" className="text-2xl sm:text-3xl font-black text-slate-900">
              Why shop at TechShop?
            </h2>
            <p className="mt-3 text-slate-500 text-sm leading-relaxed">
              A curated electronics store built around quality, transparency, and a hassle-free experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, bg, color }) => (
              <div key={title} className="flex flex-col gap-4 p-6 rounded-xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${bg} ${color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-100 py-14 sm:py-20 border-y border-blue-100/60" aria-labelledby="testimonials-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="section-label mb-2">Testimonials</p>
            <h2 id="testimonials-heading" className="text-2xl sm:text-3xl font-black text-slate-900">
              What our customers say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="flex flex-col gap-4 bg-white/90 backdrop-blur-sm p-6 rounded-xl border-2 border-blue-100 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-sm text-slate-600 leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${t.bg} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                    {t.init}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-indigo-700 via-blue-700 to-blue-600 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Ready to upgrade your tech?
          </h2>
          <p className="text-blue-200 text-sm mb-8 leading-relaxed">
            Genuine products, fast delivery, and 2-year warranty — everything you need in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products" className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-black text-sm px-8 py-3.5 rounded-xl shadow-lg hover:bg-blue-50 active:scale-[.98] transition-all">
              Shop now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-8 py-3.5 rounded-xl border border-blue-500 transition-all">
              Create an account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
