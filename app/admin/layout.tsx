"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Leaf,
  ChevronLeft,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// ── Admin user menu (header) ──────────────────────────────────────

function AdminUserMenu() {
  const [open, setOpen]       = useState(false);
  const [email, setEmail]     = useState<string | null>(null);
  const [name, setName]       = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setEmail(user.email ?? null);
      const full = user.user_metadata?.full_name as string | undefined;
      setName(full ?? user.email?.split("@")[0] ?? "Admin");
    });
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const initials = name
    ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "A";

  const handleSignOut = async () => {
    setPending(true);
    await signOut();
    window.location.href = "/";
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors",
          open ? "bg-blue-50 text-blue-700" : "hover:bg-blue-50 hover:text-blue-700"
        )}
      >
        <div className="w-8 h-8 rounded-full bg-blue-700 text-white text-sm font-bold flex items-center justify-center shrink-0">
          {initials}
        </div>
        <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
          {name ?? "Admin"}
        </span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-gray-400 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 z-[100] bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 animate-scale-in">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">{name ?? "Admin"}</p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{email ?? ""}</p>
            <span className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
              Admin
            </span>
          </div>
          <div className="py-1">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            >
              <User className="w-4 h-4 shrink-0" />
              View store
            </Link>
          </div>
          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleSignOut}
              disabled={pending}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {pending ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Nav items ─────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/admin",          label: "Dashboard", icon: LayoutDashboard, exact: true  },
  { href: "/admin/products", label: "Products",  icon: Package,         exact: false },
  { href: "/admin/orders",   label: "Orders",    icon: ShoppingBag,     exact: false },
] as const;

// ── Page title map ────────────────────────────────────────────────

const PAGE_TITLES: Record<string, string> = {
  "/admin":          "Dashboard",
  "/admin/products": "Product management",
  "/admin/orders":   "Order management",
};

function getPageTitle(pathname: string): string {
  for (const [key, val] of Object.entries(PAGE_TITLES)) {
    if (pathname === key || pathname.startsWith(key + "/")) return val;
  }
  return "Administration";
}

// ── Sidebar content (partagé desktop/mobile) ──────────────────────

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 shrink-0">
        <Link href="/" className="flex items-center gap-2" aria-label="RwandaShop home">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/15 text-white">
            <Leaf className="w-4 h-4" />
          </span>
          <span className="font-serif text-lg font-bold leading-none">
            <span className="text-white">Rwanda</span>
            <span className="text-amber-400">Shop</span>
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Badge */}
      <div className="px-4 pt-4 pb-2 shrink-0">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/15 text-white/80">
          Admin panel
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto" aria-label="Navigation admin">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Pied */}
      <div className="p-3 space-y-0.5 border-t border-white/10 shrink-0">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" />
          Back to store
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Layout ────────────────────────────────────────────────────────

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname                    = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar desktop (fixe) */}
      <aside className="hidden lg:flex flex-col w-60 bg-blue-900 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Overlay mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-200",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
      />

      {/* Drawer mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-blue-900 lg:hidden",
          "transition-transform duration-300 ease-out shadow-xl"
        )}
        style={{ transform: mobileOpen ? "translateX(0)" : "translateX(-100%)" }}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Zone principale */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-60">
        <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-blue-50 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-semibold text-gray-900 truncate">
              {getPageTitle(pathname)}
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-700 text-white tracking-wide">
              ADMIN
            </span>
          </div>
          <AdminUserMenu />
        </header>

        <main className="flex-1 p-4 sm:p-6 bg-slate-50/80">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
