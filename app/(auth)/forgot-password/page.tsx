"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { z } from "zod";
import { Zap, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

function ForgotPasswordForm() {
  const [email, setEmail]       = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [sent, setSent]         = useState(false);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const result = schema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid email");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      result.data.email,
      { redirectTo: `${window.location.origin}/auth/callback?next=/account/reset-password` }
    );
    setLoading(false);

    if (resetError) {
      setError("Unable to send reset email. Please try again.");
      return;
    }

    setSent(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group" aria-label="TechShop — Home">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white shadow-sm group-hover:bg-blue-700 transition-colors">
              <Zap className="w-5 h-5" />
            </span>
            <span className="font-black text-2xl">
              <span className="text-slate-900">Tech</span>
              <span className="text-blue-600">Shop</span>
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-black text-slate-900">Reset password</h1>
          <p className="text-slate-500 text-sm mt-1">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <div className="card p-8 space-y-6">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle2 className="w-12 h-12 text-blue-600" />
              </div>
              <p className="font-semibold text-slate-900">Check your inbox</p>
              <p className="text-sm text-slate-600">
                We sent a password reset link to <span className="font-semibold">{email}</span>.
                The link expires in 1 hour.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  autoComplete="email"
                  autoFocus
                  className={cn("input", error && "border-red-400 focus:ring-red-500")}
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
