"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { ShoppingCart, Menu, X, Search, Zap, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { cn } from "@/lib/utils";
import UserMenu from "@/components/auth/UserMenu";
import type { CategorySlug } from "@/types";

interface Cat { slug: CategorySlug; label: string; emoji: string; }

const CATS: Cat[] = [
  { slug: "mobiles-tablets",   label: "Mobiles & Tablets",    emoji: "📱" },
  { slug: "laptops-computers", label: "Laptops & Computers",  emoji: "💻" },
  { slug: "projectors",        label: "Projectors",           emoji: "📽️" },
  { slug: "audio-sound",       label: "Audio & Sound",        emoji: "🎧" },
  { slug: "accessories",       label: "Accessories",          emoji: "🔌" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

// ── Search bar ─────────────────────────────────────────────────────
function SearchBar() {
  const [open, setOpen] = useState(false);
  const [q, setQ]       = useState("");
  const ref             = useRef<HTMLInputElement>(null);
  const pathname        = usePathname();
  const close           = useCallback(() => { setOpen(false); setQ(""); }, []);

  useEffect(() => { if (open) ref.current?.focus(); }, [open]);
  useEffect(() => { close(); }, [pathname, close]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(true); }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [close]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-500 text-sm px-4 py-2 rounded-xl transition-colors"
        aria-label="Search"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search products…</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 ml-2">⌘K</kbd>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={close} />
          <div className="absolute right-0 top-full mt-2 w-80 z-50 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-scale-in">
            <form action="/products" className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                ref={ref} name="search" type="search"
                value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Search for a product…"
                className="flex-1 text-sm text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
              />
              {q && <button type="button" onClick={() => setQ("")}><X className="w-3.5 h-3.5 text-slate-400" /></button>}
            </form>
            <div className="p-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Categories</p>
              <div className="flex flex-wrap gap-1.5">
                {CATS.map((c) => (
                  <Link key={c.slug} href={`/products?category=${c.slug}`} onClick={close}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 rounded-full text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    {c.emoji} {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Categories dropdown ─────────────────────────────────────────────
function CatDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const open_  = () => { if (t.current) clearTimeout(t.current); setOpen(true); };
  const close_ = () => { t.current = setTimeout(() => setOpen(false), 150); };

  return (
    <div ref={ref} className="relative" onMouseEnter={open_} onMouseLeave={close_}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
        aria-haspopup="true" aria-expanded={open}
      >
        Categories <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-fade-in"
          onMouseEnter={open_} onMouseLeave={close_}
        >
          {CATS.map((c) => (
            <Link
              key={c.slug}
              href={`/products?category=${c.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-slate-50 last:border-0"
            >
              <span className="text-lg leading-none">{c.emoji}</span>
              <span className="font-medium">{c.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Cart icon ───────────────────────────────────────────────────────
function CartBtn({ count }: { count: number }) {
  const pathname = usePathname();
  return (
    <Link
      href="/cart"
      aria-label={`Cart${count > 0 ? ` — ${count} items` : ""}`}
      className={cn(
        "relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150",
        isActive(pathname, "/cart")
          ? "bg-blue-600 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white"
      )}
    >
      <ShoppingCart className="w-4.5 h-4.5" />
      {count > 0 && (
        <>
          <span className="hidden sm:inline">{count}</span>
          <span className={cn(
            "absolute -top-1.5 -right-1.5 sm:hidden",
            "w-4 h-4 flex items-center justify-center",
            "bg-blue-600 text-white text-[9px] font-black rounded-full ring-2 ring-white"
          )}>
            {count > 9 ? "9+" : count}
          </span>
        </>
      )}
    </Link>
  );
}

// ── Main Navbar ─────────────────────────────────────────────────────
export default function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [catOpen, setCatOpen]       = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => { setDrawerOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      {/* ── Top announcement bar ──────────────────────────── */}
      <div className="bg-blue-700 text-white text-xs font-semibold text-center py-2 px-4">
        🚚 Free delivery on orders over RWF 500,000 &nbsp;·&nbsp; ✅ 2-year warranty on all electronics
      </div>

      {/* ── Main header ───────────────────────────────────── */}
      <header className={cn(
        "sticky top-0 z-40 w-full bg-white transition-shadow duration-200",
        scrolled ? "shadow-md" : "border-b border-slate-100"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="TechShop — Home">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white shadow-sm group-hover:bg-blue-700 transition-colors">
                <Zap className="w-4.5 h-4.5" />
              </span>
              <div className="leading-none">
                <span className="text-xl font-black text-slate-900 tracking-tight">Tech</span>
                <span className="text-xl font-black text-blue-600 tracking-tight">Shop</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {[
                { href: "/",         label: "Home"     },
                { href: "/products", label: "Products" },
                { href: "/about",    label: "About"    },
              ].map(({ href, label }) => (
                <Link
                  key={href} href={href}
                  aria-current={isActive(pathname, href) ? "page" : undefined}
                  className={cn(
                    "text-sm font-semibold px-3 py-2 rounded-lg transition-colors",
                    isActive(pathname, href)
                      ? "text-blue-700 bg-blue-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {label}
                </Link>
              ))}
              <CatDropdown />
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:block"><SearchBar /></div>
              <CartBtn count={itemCount} />
              <div className="hidden sm:block"><UserMenu /></div>
              <button
                onClick={() => setDrawerOpen(true)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Open menu" aria-expanded={drawerOpen}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category strip — desktop */}
        <div className="hidden md:block border-t border-slate-100 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 h-10 overflow-x-auto scrollbar-hide">
              {CATS.map((c) => {
                const active = pathname.includes(c.slug);
                return (
                  <Link
                    key={c.slug}
                    href={`/products?category=${c.slug}`}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors",
                      active
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-white hover:text-blue-700 hover:shadow-sm"
                    )}
                  >
                    <span>{c.emoji}</span>
                    {c.label}
                  </Link>
                );
              })}
              <Link
                href="/products"
                className="ml-auto px-3 py-1.5 text-xs font-semibold text-blue-600 hover:underline whitespace-nowrap"
              >
                All products →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────── */}
      <div className={cn(
        "fixed inset-0 z-50 md:hidden transition-opacity duration-300",
        drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
        <aside className={cn(
          "absolute inset-y-0 left-0 w-72 bg-white flex flex-col shadow-2xl",
          "transition-transform duration-300",
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100">
            <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center"><Zap className="w-4 h-4" /></span>
              <span className="font-black text-lg"><span className="text-slate-900">Tech</span><span className="text-blue-600">Shop</span></span>
            </Link>
            <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile search */}
          <div className="px-4 py-3 border-b border-slate-100">
            <form action="/products" className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input name="search" type="search" placeholder="Search products…"
                className="flex-1 text-sm bg-transparent outline-none placeholder:text-slate-400 text-slate-800" />
            </form>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
            {[
              { href: "/",         label: "Home"     },
              { href: "/products", label: "All Products" },
              { href: "/about",    label: "About"    },
            ].map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setDrawerOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                  isActive(pathname, href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50"
                )}>
                {label}
              </Link>
            ))}

            <div className="pt-3 pb-1 px-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categories</p>
            </div>
            {CATS.map((c) => (
              <Link key={c.slug} href={`/products?category=${c.slug}`} onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                <span className="text-xl leading-none">{c.emoji}</span>
                {c.label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-slate-100">
            <Link href="/cart" onClick={() => setDrawerOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm">
              <span className="flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> My Cart</span>
              {itemCount > 0 && <span className="bg-white text-blue-700 text-xs font-black px-2 py-0.5 rounded-full">{itemCount}</span>}
            </Link>
            <div className="mt-2 px-3 py-1"><UserMenu /></div>
          </div>
        </aside>
      </div>
    </>
  );
}
