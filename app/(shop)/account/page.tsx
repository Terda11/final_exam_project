import Link from "next/link";
import type { Metadata } from "next";
import { User, Mail, Phone, MapPin, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My profile — TechShop",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("full_name, email, phone, address, role, created_at")
    .eq("id", authUser.id)
    .single();

  const address = profile?.address as {
    line1?: string;
    line2?: string;
    city?: string;
    province?: string;
    country?: string;
  } | null;

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">My profile</h1>
          <p className="text-slate-400 mt-1 text-sm">Your account details and delivery information.</p>
        </div>

        <div className="card p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
              {(profile?.full_name ?? "U")
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-bold text-white">{profile?.full_name ?? "Customer"}</p>
              <span className={cn(
                "inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                profile?.role === "admin"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-blue-500/20 text-blue-300"
              )}>
                {profile?.role ?? "customer"}
              </span>
            </div>
          </div>

          <dl className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <dt className="text-slate-500 text-xs">Email</dt>
                <dd className="text-white font-medium">{profile?.email ?? authUser.email}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <dt className="text-slate-500 text-xs">Phone</dt>
                <dd className="text-white font-medium">{profile?.phone ?? "Not provided"}</dd>
              </div>
            </div>
            {address?.line1 && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <dt className="text-slate-500 text-xs">Saved address</dt>
                  <dd className="text-white font-medium">
                    {address.line1}
                    {address.line2 && <>, {address.line2}</>}
                    <br />
                    <span className="text-slate-400">
                      {address.city}, {address.province} — {address.country ?? "Rwanda"}
                    </span>
                  </dd>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <dt className="text-slate-500 text-xs">Member since</dt>
                <dd className="text-white font-medium">
                  {profile?.created_at
                    ? new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
                        new Date(profile.created_at)
                      )
                    : "—"}
                </dd>
              </div>
            </div>
          </dl>
        </div>

        <Link
          href="/account/orders"
          className="card p-5 flex items-center justify-between gap-4 hover:border-brand-500/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-brand-400" />
            <div>
              <p className="font-semibold text-white group-hover:text-brand-300 transition-colors">
                View my orders
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Track status and order history</p>
            </div>
          </div>
          <span className="text-brand-400 text-sm font-medium">→</span>
        </Link>
      </div>
    </div>
  );
}
