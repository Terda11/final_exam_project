"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { User, ChevronDown, LogOut, Package, Settings, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface UserData {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url: string | null;
}

export default function UserMenu() {
  const [user, setUser]       = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]       = useState(false);
  const [pending, setPending] = useState(false);
  const ref                   = useRef<HTMLDivElement>(null);

  // Load session on mount
  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function load() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (cancelled) return;

        if (!authUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Try to get profile from DB
        const { data: profile } = await supabase
          .from("users")
          .select("id, email, full_name, role, avatar_url")
          .eq("id", authUser.id)
          .single();

        if (cancelled) return;

        if (profile) {
          setUser({
            id:         profile.id,
            email:      profile.email,
            full_name:  profile.full_name,
            role:       profile.role,
            avatar_url: profile.avatar_url,
          });
        } else {
          // Fallback from auth metadata
          setUser({
            id:         authUser.id,
            email:      authUser.email ?? "",
            full_name:  String(authUser.user_metadata?.full_name ?? authUser.email?.split("@")[0] ?? "User"),
            role:       "customer",
            avatar_url: String(authUser.user_metadata?.avatar_url ?? "") || null,
          });
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    // Listen for auth changes (sign in / sign out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setOpen(false);
      } else if (event === "SIGNED_IN") {
        // Reload on sign in
        void load();
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  const handleSignOut = async () => {
    setPending(true);
    setOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.replace("/");
  };

  // ── Loading state ────────────────────────────────────────────────
  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse shrink-0" />;
  }

  // ── Guest state ─────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <Link
          href="/login"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Sign in</span>
        </Link>
        <Link
          href="/register"
          className="flex items-center px-2.5 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <span className="hidden sm:inline">Register</span>
          <User className="w-4 h-4 sm:hidden" />
        </Link>
      </div>
    );
  }

  // ── Authenticated state ──────────────────────────────────────────
  const initials = user.full_name
    .split(" ")
    .map((n) => n[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  const menuItems = [
    ...(user.role === "admin" ? [{ href: "/admin", icon: Settings, label: "Admin panel" }] : []),
    { href: "/account",        icon: User,    label: "My profile" },
    { href: "/account/orders", icon: Package, label: "My orders"  },
  ];

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors",
          open ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
        )}
      >
        {user.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
            {initials}
          </div>
        )}
        <span className="hidden sm:block text-sm font-medium max-w-[90px] truncate">
          {user.full_name.split(" ")[0]}
        </span>
        <ChevronDown className={cn("w-3.5 h-3.5 shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[199]" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-52 z-[200] bg-white rounded-xl shadow-xl border border-gray-100 py-1.5">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.full_name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
              {user.role === "admin" && (
                <span className="mt-1 inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                  Admin
                </span>
              )}
            </div>
            <div className="py-1">
              {menuItems.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-100 py-1">
              <button
                type="button"
                onClick={handleSignOut}
                disabled={pending}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {pending ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <LogOut className="w-4 h-4 shrink-0" />}
                {pending ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
