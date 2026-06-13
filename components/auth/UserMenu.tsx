"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { User, ChevronDown, LogOut, Package, Settings, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import type { User as AppUser } from "@/types";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// ── Avatar ────────────────────────────────────────────────────────

function Avatar({ user, size = "md" }: { user: AppUser; size?: "sm" | "md" }) {
  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizeClasses = size === "sm"
    ? "w-7 h-7 text-xs"
    : "w-8 h-8 text-sm";

  if (user.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatar_url}
        alt={user.full_name}
        className={cn("rounded-full object-cover ring-2 ring-white", sizeClasses)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-blue-600 text-white font-semibold",
        "flex items-center justify-center ring-2 ring-white shrink-0",
        sizeClasses
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

// ── Authenticated dropdown menu ───────────────────────────────────

function AuthenticatedMenu({ user }: { user: AppUser }) {
  const [open, setOpen]   = useState(false);
  const [pending, setPending] = useState(false);
  const ref               = useRef<HTMLDivElement>(null);
  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
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
      ? [{ href: "/admin", icon: Settings, label: "Admin" }]
      : []),
    { href: "/account",       icon: User,    label: "My profile" },
    { href: "/account/orders", icon: Package, label: "My orders" },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Account menu for ${user.full_name}`}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1.5 rounded-lg",
          "text-sm font-medium transition-colors duration-150",
          open
            ? "text-blue-700 bg-blue-50"
            : "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
        )}
      >
        <Avatar user={user} size="sm" />
        <span className="hidden lg:block max-w-[100px] truncate">
          {user.full_name.split(" ")[0]}
        </span>
        <ChevronDown
          className={cn("w-3.5 h-3.5 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <>
          {/* Invisible full-screen backdrop to catch outside clicks */}
          <div className="fixed inset-0 z-[199]" onClick={() => setOpen(false)} />
          <div
            className={cn(
              "absolute right-0 top-full mt-2 w-52 z-[200]",
              "bg-white rounded-xl shadow-xl border border-gray-100",
              "py-1.5 animate-scale-in"
            )}
            role="menu"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.full_name}</p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
              {user.role === "admin" && (
                <span className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  Admin
                </span>
              )}
            </div>

            {/* Items */}
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

            {/* Sign out */}
            <div className="border-t border-gray-100 py-1">
              <button
                onClick={handleSignOut}
                disabled={pending}
                role="menuitem"
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-2.5",
                  "text-sm text-red-600 hover:bg-red-50 transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {pending
                  ? <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                  : <LogOut className="w-4 h-4 shrink-0" />
                }
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
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
          "text-sm font-medium transition-colors duration-150",
          "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
        )}
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Sign in</span>
      </Link>
      <Link
        href="/register"
        className={cn(
          "flex items-center px-3 py-1.5 rounded-lg",
          "text-sm font-medium transition-colors duration-150",
          "bg-blue-600 text-white hover:bg-blue-700"
        )}
      >
        <span className="hidden sm:inline">Register</span>
        <User className="w-4 h-4 sm:hidden" />
      </Link>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────

export default function UserMenu() {
  const [user, setUser]     = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const fetchProfile = async (uid: string) => {
      const { data: profile } = await supabase
        .from("users")
        .select("id, email, full_name, phone, address, role, avatar_url, created_at, updated_at")
        .eq("id", uid)
        .single();
      return profile
        ? {
            id:         profile.id,
            email:      profile.email,
            full_name:  profile.full_name,
            phone:      profile.phone,
            address:    profile.address,
            role:       profile.role,
            avatar_url: profile.avatar_url,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
          }
        : null;
    };

    const buildFallback = (authUser: SupabaseUser): AppUser => ({
      id:         authUser.id,
      email:      authUser.email ?? "",
      full_name:  (authUser.user_metadata?.full_name as string | undefined)
                    ?? authUser.email?.split("@")[0]
                    ?? "User",
      phone:      null,
      address:    null,
      role:       "customer",
      avatar_url: (authUser.user_metadata?.avatar_url as string | undefined) ?? null,
      created_at: authUser.created_at,
      updated_at: authUser.updated_at ?? authUser.created_at,
    });

    // onAuthStateChange fires INITIAL_SESSION on mount — covers initial load + all changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session?.user || event === "SIGNED_OUT") {
          setUser(null);
          setLoading(false);
          return;
        }
        try {
          const profile = await fetchProfile(session.user.id);
          setUser(profile ?? buildFallback(session.user));
        } catch {
          setUser(buildFallback(session.user));
        } finally {
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse shrink-0" />;
  }

  if (user) return <AuthenticatedMenu user={user} />;
  return <GuestButtons />;
}
