"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { User, ChevronDown, LogOut, Package, Settings, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { User as AppUser } from "@/types";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// ── Helpers ───────────────────────────────────────────────────────

async function fetchProfile(uid: string): Promise<AppUser | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("users")
    .select("id, email, full_name, phone, address, role, avatar_url, created_at, updated_at")
    .eq("id", uid)
    .single();
  return data ?? null;
}

function buildFallback(u: SupabaseUser): AppUser {
  return {
    id:         u.id,
    email:      u.email ?? "",
    full_name:  (u.user_metadata?.full_name as string | undefined)
                  ?? u.email?.split("@")[0]
                  ?? "User",
    phone:      null,
    address:    null,
    role:       "customer",
    avatar_url: (u.user_metadata?.avatar_url as string | undefined) ?? null,
    created_at: u.created_at,
    updated_at: u.updated_at ?? u.created_at,
  };
}

// ── Avatar ────────────────────────────────────────────────────────

function Avatar({ user }: { user: AppUser }) {
  const initials = user.full_name
    .split(" ")
    .map((n) => n[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  if (user.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatar_url}
        alt={user.full_name}
        className="w-7 h-7 rounded-full object-cover ring-2 ring-white shrink-0"
      />
    );
  }
  return (
    <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white shrink-0">
      {initials}
    </div>
  );
}

// ── Authenticated menu ────────────────────────────────────────────

function AuthenticatedMenu({ user }: { user: AppUser }) {
  const [open, setOpen]       = useState(false);
  const [pending, setPending] = useState(false);
  const ref                   = useRef<HTMLDivElement>(null);

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

  const menuItems = [
    ...(user.role === "admin"
      ? [{ href: "/admin",    icon: Settings, label: "Admin panel" }]
      : []),
    { href: "/account",        icon: User,    label: "My profile"  },
    { href: "/account/orders", icon: Package, label: "My orders"   },
  ];

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors duration-150",
          open ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
        )}
      >
        <Avatar user={user} />
        <span className="hidden sm:block text-sm font-medium max-w-[90px] truncate">
          {user.full_name.split(" ")[0]}
        </span>
        <ChevronDown className={cn("w-3.5 h-3.5 shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[199]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 top-full mt-2 w-52 z-[200] bg-white rounded-xl shadow-xl border border-gray-100 py-1.5"
            role="menu"
          >
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
                  role="menuitem"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </div>

            <div className="border-t border-gray-100 py-1">
              <button
                onClick={handleSignOut}
                disabled={pending}
                role="menuitem"
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

// ── Guest buttons ─────────────────────────────────────────────────

function GuestButtons() {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <Link
        href="/login"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
      >
        <User className="w-4 h-4 shrink-0" />
        <span className="hidden sm:inline">Sign in</span>
      </Link>
      <Link
        href="/register"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        <span className="hidden sm:inline">Register</span>
        <User className="w-4 h-4 shrink-0 sm:hidden" />
      </Link>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────

export default function UserMenu() {
  const [user, setUser]       = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let cancelled  = false;

    // 1. Load current session immediately on mount
    const init = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (cancelled) return;
        if (!authUser) { setUser(null); setLoading(false); return; }
        const profile = await fetchProfile(authUser.id);
        if (cancelled) return;
        setUser(profile ?? buildFallback(authUser));
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void init();

    // 2. React to sign-in / sign-out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          if (!cancelled) { setUser(null); setLoading(false); }
          return;
        }
        if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session?.user) {
          try {
            const profile = await fetchProfile(session.user.id);
            if (!cancelled) setUser(profile ?? buildFallback(session.user));
          } catch {
            if (!cancelled) setUser(buildFallback(session.user));
          } finally {
            if (!cancelled) setLoading(false);
          }
        }
      }
    );

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse shrink-0" />;
  }

  if (user) return <AuthenticatedMenu user={user} />;
  return <GuestButtons />;
}
