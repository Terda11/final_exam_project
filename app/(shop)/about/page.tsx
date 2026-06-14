import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap, Heart, ShieldCheck, Truck, Users,
  Mail, Phone, ArrowRight, Star,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About — TechShop",
  description:
    "Learn about TechShop's mission: bringing the latest electronics to everyone with genuine products, fast delivery, and expert support.",
};

const STATS = [
  { value: "18+",    label: "Products in stock"      },
  { value: "4.9/5",  label: "Average customer rating"},
  { value: "24/7",   label: "Customer support"       },
  { value: "2-year", label: "Warranty on all items"  },
];

const VALUES = [
  {
    icon:  ShieldCheck,
    title: "100% genuine products",
    desc:  "Every item is brand-new, factory sealed, and sourced directly from authorized distributors. No grey-market items.",
    color: "bg-brand-500/15 text-brand-400",
  },
  {
    icon:  Truck,
    title: "Fast delivery",
    desc:  "Orders dispatched within 24 hours. Free shipping on all orders over $100 with real-time tracking.",
    color: "bg-neon-500/15 text-neon-400",
  },
  {
    icon:  Heart,
    title: "Expert support",
    desc:  "Our tech specialists are available around the clock via chat, email, or phone for any questions.",
    color: "bg-accent-500/15 text-accent-400",
  },
  {
    icon:  Users,
    title: "Community-first",
    desc:  "TechShop is built around honest reviews, transparent pricing, and a genuine passion for technology.",
    color: "bg-gold-500/15 text-gold-400",
  },
];

const TEAM = [
  { name: "Alex Chen",     role: "Founder & CEO",        initials: "AC" },
  { name: "Sarah Kim",     role: "Head of Products",     initials: "SK" },
  { name: "Marcus Webb",   role: "Engineering Lead",     initials: "MW" },
  { name: "Priya Sharma",  role: "Customer Experience",  initials: "PS" },
];

const CATEGORIES = [
  { emoji: "📱", name: "Mobiles & Tablets",   slug: "mobiles-tablets",   desc: "Samsung, iPhone, Tecno, tablets and more." },
  { emoji: "💻", name: "Laptops & Computers", slug: "laptops-computers", desc: "HP, Dell, Lenovo, MacBook for work and study." },
  { emoji: "📽️", name: "Projectors",          slug: "projectors",        desc: "Sony, Epson, Acer and projection screens." },
  { emoji: "🎧", name: "Audio & Sound",        slug: "audio-sound",       desc: "Headphones, speakers and soundbars." },
  { emoji: "🔌", name: "Accessories",          slug: "accessories",       desc: "Chargers, cables, cases and peripherals." },
];

export default function AboutPage() {
  return (
    <div className="bg-surface-900">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-surface-950 text-white">
        <div className="absolute inset-0 bg-gradient-glow opacity-50 pointer-events-none" aria-hidden="true" />
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgb(59 130 246 / .07) 1px, transparent 1px), linear-gradient(90deg, rgb(59 130 246 / .07) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 glass border border-brand-500/30 rounded-full px-4 py-1.5 text-sm font-medium text-brand-300 mb-6">
            <Zap className="w-3.5 h-3.5" />
            Premium Electronics Store
          </div>
          <h1 className="font-sans text-4xl sm:text-5xl font-black leading-tight mb-6">
            The future of tech
            <br />
            <span className="gradient-text">starts here.</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            TechShop is your one-stop destination for the latest electronics. We believe everyone deserves access to genuine, top-quality tech — at fair prices, with exceptional support.
          </p>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <section className="bg-surface-800 border-y border-surface-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`px-6 py-10 text-center ${
                  i < STATS.length - 1 ? "sm:border-r border-surface-600" : ""
                }`}
              >
                <dt className="text-3xl font-black gradient-text">{s.value}</dt>
                <dd className="mt-1 text-sm text-slate-300">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Our story ────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="section-label mb-3">Our story</p>
            <h2 className="font-sans text-3xl font-black text-white mb-5 leading-tight">
              Built by tech enthusiasts, for tech enthusiasts
            </h2>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                TechShop was founded in 2024 with a simple idea: buying electronics online should be easy, transparent, and trustworthy — no hidden fees, no counterfeit products, no headaches.
              </p>
              <p>
                We hand-pick every product in our catalogue, working only with authorized distributors and official brand channels. Our team tests every major product before listing it.
              </p>
              <p>
                This demo includes a fully functional <strong className="text-white">mock payment system</strong> — you can complete a real checkout flow with a simulated credit card transaction, without any real charges.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.slice(0, 4).map((c) => (
              <div key={c.name} className="card p-4 hover:border-brand-500/40 transition-colors group">
                <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">{c.emoji}</span>
                <p className="text-sm font-semibold text-white">{c.name}</p>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────── */}
      <section className="bg-surface-800 py-20 border-y border-surface-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-label mb-3">What drives us</p>
            <h2 className="font-sans text-3xl font-black text-white">Our values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="card p-6 hover:border-brand-500/40 transition-all hover:shadow-card-hover">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 ${v.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Our catalogue</p>
          <h2 className="font-sans text-3xl font-black text-white mb-4">
            Five categories, endless possibilities
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            From pocket-sized smartphones to home theatre setups — we have the tech you need.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              href={`/products?category=${c.slug}`}
              className="flex items-start gap-4 p-5 rounded-2xl border border-surface-600 bg-surface-800 hover:border-brand-500/40 hover:bg-surface-700 transition-all group"
            >
              <span className="text-3xl leading-none mt-0.5 group-hover:scale-110 transition-transform">{c.emoji}</span>
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  {c.name}
                  <ArrowRight className="w-3 h-3 text-brand-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────── */}
      <section className="bg-surface-800 py-20 border-y border-surface-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-label mb-3">The team</p>
            <h2 className="font-sans text-3xl font-black text-white">The people behind TechShop</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {TEAM.map((m) => (
              <div key={m.name} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white text-lg font-black flex items-center justify-center mx-auto mb-3 shadow-glow-blue">
                  {m.initials}
                </div>
                <p className="text-sm font-semibold text-white">{m.name}</p>
                <p className="text-xs text-slate-300 mt-0.5">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ──────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="flex justify-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-gold-400 text-gold-400" />
          ))}
        </div>
        <blockquote className="font-sans text-xl text-white font-bold leading-relaxed mb-6">
          &ldquo;I ordered a MacBook Pro and it arrived the next morning in perfect condition. TechShop&apos;s checkout was the smoothest online purchase I&apos;ve ever made.&rdquo;
        </blockquote>
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-600 text-white text-sm font-black flex items-center justify-center">
            JM
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">James Morrison</p>
            <p className="text-xs text-slate-300">Verified buyer — Laptops</p>
          </div>
        </div>
      </section>

      {/* ── Contact / CTA ────────────────────────────────────────── */}
      <section className="bg-brand-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-sans text-2xl font-black mb-3">Ready to upgrade?</h2>
              <p className="text-brand-200 text-sm leading-relaxed mb-6">
                Browse hundreds of genuine electronics products with fast delivery and a 2-year warranty guarantee.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white text-brand-700 font-black text-sm px-5 py-2.5 rounded-xl hover:bg-brand-50 transition-colors"
              >
                Shop now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 text-brand-200">
                <Mail className="w-4 h-4 shrink-0 text-brand-300" />
                <a href="mailto:support@techshop.io" className="hover:text-white transition-colors">
                  support@techshop.io
                </a>
              </li>
              <li className="flex items-center gap-3 text-brand-200">
                <Phone className="w-4 h-4 shrink-0 text-brand-300" />
                <a href="tel:+1800123456" className="hover:text-white transition-colors">
                  1-800-123-456
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
