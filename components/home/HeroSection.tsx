import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";

const QUICK_CATS = [
  { slug: "mobiles-tablets",   label: "Phones",      emoji: "📱" },
  { slug: "laptops-computers", label: "Laptops",     emoji: "💻" },
  { slug: "projectors",        label: "Projectors",  emoji: "📽️" },
  { slug: "audio-sound",       label: "Audio",       emoji: "🎧" },
  { slug: "accessories",       label: "Accessories", emoji: "🔌" },
];

const TRUST = [
  { icon: Truck,       text: "Free delivery over RWF 500,000" },
  { icon: ShieldCheck, text: "2-year warranty on all products" },
  { icon: RotateCcw,   text: "30-day free returns"            },
];

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 overflow-hidden">
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      {/* Right decoration circle */}
      <div className="absolute -right-32 -top-32 w-[500px] h-[500px] rounded-full bg-white/10 pointer-events-none" aria-hidden="true" />
      <div className="absolute -right-16 -bottom-24 w-80 h-80 rounded-full bg-blue-400/30 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">

        {/* ── Main content ─────────────────────────────────── */}
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5 border border-white/30">
            🇷🇼 Rwanda&apos;s Electronics Store
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
            Top Electronics.
            <br />
            <span className="text-blue-100">Best Prices.</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-lg leading-relaxed">
            Phones, laptops, projectors, audio gear and accessories — all genuine, all in stock, delivered fast across Rwanda.
          </p>

          {/* CTA row */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-black px-6 py-3 rounded-xl shadow-lg hover:bg-blue-50 active:scale-[.98] transition-all duration-150 text-sm"
            >
              Shop All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products?category=projectors"
              className="inline-flex items-center gap-2 bg-blue-800/40 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl border border-white/25 hover:bg-blue-800/60 transition-all duration-150 text-sm"
            >
              📽️ Shop Projectors
            </Link>
          </div>
        </div>

        {/* ── Category quick-links ─────────────────────────── */}
        <div className="mt-12 flex flex-wrap gap-3">
          {QUICK_CATS.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/20 transition-all duration-150"
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </Link>
          ))}
        </div>

        {/* ── Trust bar ────────────────────────────────────── */}
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {TRUST.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2 text-xs text-blue-100">
              <Icon className="w-3.5 h-3.5 text-white/70 shrink-0" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
