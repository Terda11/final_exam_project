import Link from "next/link";
import { Mail, Phone, Zap } from "lucide-react";
import type { CategorySlug } from "@/types";

const CATEGORIES: { slug: CategorySlug; label: string; emoji: string }[] = [
  { slug: "mobiles-tablets",   label: "Mobiles & Tablets",   emoji: "📱" },
  { slug: "laptops-computers", label: "Laptops & Computers", emoji: "💻" },
  { slug: "projectors",        label: "Projectors",          emoji: "📽️" },
  { slug: "audio-sound",       label: "Audio & Sound",       emoji: "🎧" },
  { slug: "accessories",       label: "Accessories",         emoji: "🔌" },
];

const NAV = [
  { href: "/",         label: "Home"       },
  { href: "/products", label: "Products"   },
  { href: "/about",    label: "About"      },
  { href: "/cart",     label: "My cart"    },
];

function SocialIcon({ label }: { label: "Twitter" | "Instagram" | "Facebook" }) {
  if (label === "Twitter") {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  if (label === "Instagram") {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <Zap className="w-4 h-4" />
              </span>
              <span className="font-black text-xl">
                <span className="text-white">Tech</span>
                <span className="text-blue-400">Shop</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Rwanda&apos;s trusted electronics store. Genuine products, fast delivery, 2-year warranty.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {[
                { href: "https://twitter.com",   label: "Twitter" as const },
                { href: "https://instagram.com", label: "Instagram" as const },
                { href: "https://facebook.com",  label: "Facebook" as const },
              ].map(({ href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">
                  <SocialIcon label={label} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              {NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">Categories</h3>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/products?category=${c.slug}`} className="flex items-center gap-2 hover:text-white transition-colors">
                    <span>{c.emoji}</span>{c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:support@techshop.rw" className="flex items-center gap-2 hover:text-white transition-colors group">
                  <Mail className="w-4 h-4 text-blue-400 group-hover:text-blue-300 shrink-0" />
                  support@techshop.rw
                </a>
              </li>
              <li>
                <a href="tel:+250788000000" className="flex items-center gap-2 hover:text-white transition-colors group">
                  <Phone className="w-4 h-4 text-blue-400 group-hover:text-blue-300 shrink-0" />
                  +250 788 000 000
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-xs font-bold text-slate-300 mb-3">We accept</p>
              <div className="flex flex-wrap gap-2">
                {["Visa", "Mastercard", "MTN MoMo", "Airtel"].map((p) => (
                  <span key={p} className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-semibold text-slate-300">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>&copy; 2026 <span className="text-slate-400 font-semibold">TechShop Rwanda</span>. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Payments are simulated — no real charges made
          </p>
        </div>
      </div>
    </footer>
  );
}
