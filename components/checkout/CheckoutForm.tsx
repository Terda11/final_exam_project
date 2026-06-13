"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  CreditCard, Banknote, Phone, AlertCircle, ChevronRight,
  Lock, Eye, EyeOff, Check,
} from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { cn, formatCardNumber, formatExpiry, formatPrice } from "@/lib/utils";
import { SHIPPING_FEE, SHIPPING_THRESHOLD } from "@/lib/constants/shipping";

const CITIES = ["Kigali", "Gisenyi", "Huye", "Musanze", "Butare"] as const;

// ── Schemas ───────────────────────────────────────────────────────

const baseSchema = z.object({
  full_name:      z.string().min(2, "Full name required (min 2 chars)"),
  email:          z.string().email("Invalid email address"),
  phone:          z.string().min(6, "Phone number required"),
  address_line1:  z.string().min(4, "Address required (min 4 chars)"),
  city:           z.enum(CITIES, { errorMap: () => ({ message: "Select a city" }) }),
  notes:          z.string().max(300, "Max 300 characters").optional(),
  payment_method: z.enum(["credit_card", "cash_on_delivery", "mtn_momo", "airtel_money"] as const),
});

const creditCardSchema = z.object({
  card_name:   z.string().min(2, "Cardholder name required"),
  card_number: z.string().regex(/^\d{4} \d{4} \d{4} \d{4}$/, "Enter a valid 16-digit card number"),
  card_expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Format: MM/YY"),
  card_cvc:    z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

type BaseFields      = z.infer<typeof baseSchema>;
type CardFields      = z.infer<typeof creditCardSchema>;
type AllFields       = BaseFields & Partial<CardFields>;
type FieldErrors     = Partial<Record<keyof AllFields, string>>;

interface CheckoutOrderItem {
  product_id: string;
  quantity: number;
  price: number;
  line_total: number;
  product: Product;
}

const INITIAL: AllFields = {
  full_name:      "",
  email:          "",
  phone:          "",
  address_line1:  "",
  city:           "Kigali",
  notes:          "",
  payment_method: "credit_card",
  card_name:      "",
  card_number:    "",
  card_expiry:    "",
  card_cvc:       "",
};

// ── Field wrapper ─────────────────────────────────────────────────

function Field({
  label, id, error, required, children,
}: {
  label: string; id: string; error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-300">
        {label}
        {required && <span className="text-red-400 ml-0.5" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

// ── Mock card visual ──────────────────────────────────────────────

function CreditCardVisual({ number, name, expiry, flipped }: {
  number: string; name: string; expiry: string; flipped: boolean;
}) {
  const displayNumber = number || "•••• •••• •••• ••••";
  const displayName   = name   || "YOUR NAME";
  const displayExpiry = expiry || "MM/YY";

  return (
    <div className="relative w-full max-w-xs mx-auto h-44 perspective-1000" aria-hidden="true">
      <div className={cn(
        "relative w-full h-full transition-transform duration-500 transform-style-3d",
        flipped && "rotate-y-180"
      )}>
        {/* Front */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden"
          style={{
            background: "linear-gradient(135deg, #1d4ed8 0%, #0891b2 60%, #0e7490 100%)",
            boxShadow: "0 20px 40px -8px rgba(29, 78, 216, 0.5)",
          }}
        >
          {/* Card grain */}
          <div className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
              backgroundSize: "200px",
            }}
          />
          <div className="relative p-5 flex flex-col h-full">
            <div className="flex justify-between items-start">
              <div className="flex gap-1">
                <div className="w-7 h-7 rounded-full bg-gold-400/80" />
                <div className="w-7 h-7 rounded-full bg-gold-500/50 -ml-3" />
              </div>
              <span className="text-white/60 text-xs font-bold uppercase tracking-widest">VISA</span>
            </div>
            {/* Chip */}
            <div className="mt-3 w-10 h-7 rounded-md bg-gold-400/70 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-px">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-2 h-1 bg-gold-600/50 rounded-sm" />
                ))}
              </div>
            </div>
            <div className="mt-auto">
              <p className="text-white font-mono tracking-[0.2em] text-sm">{displayNumber}</p>
              <div className="mt-2 flex justify-between items-end">
                <div>
                  <p className="text-white/50 text-[9px] uppercase tracking-wider">Card Holder</p>
                  <p className="text-white text-xs font-bold uppercase truncate max-w-[140px]">{displayName}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-[9px] uppercase tracking-wider">Expires</p>
                  <p className="text-white text-xs font-bold font-mono">{displayExpiry}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden rotate-y-180"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
            boxShadow: "0 20px 40px -8px rgba(29, 78, 216, 0.5)",
          }}
        >
          <div className="mt-6 w-full h-10 bg-surface-950" />
          <div className="px-5 mt-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-8 bg-white/90 rounded flex items-center justify-end px-3">
                <p className="text-gray-700 font-mono text-sm tracking-wider">
                  {flipped ? "•••" : ""}
                </p>
              </div>
              <span className="text-white/60 text-xs font-bold uppercase">CVV</span>
            </div>
            <p className="text-white/40 text-[10px] mt-4 leading-relaxed">
              This is a demo card for testing purposes only. No real payment is processed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────

export default function CheckoutForm() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();

  const [form, setForm]       = useState<AllFields>(INITIAL);
  const [errors, setErrors]   = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showCvc, setShowCvc]       = useState(false);
  const [cvcFocused, setCvcFocused] = useState(false);
  const [mockProcessing, setMockProcessing] = useState<"idle" | "authorizing" | "approved">("idle");

  const shipping   = total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const grandTotal = total + shipping;

  // ── Field change handler ──────────────────────────────────────

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    let processed = value;

    if (name === "card_number") processed = formatCardNumber(value);
    if (name === "card_expiry") processed = formatExpiry(value);
    if (name === "card_cvc")    processed = value.replace(/\D/g, "").slice(0, 4);

    setForm((prev) => ({ ...prev, [name]: processed }));
    if (errors[name as keyof AllFields]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof AllFields];
        return next;
      });
    }
  }

  // ── Submit ────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const baseResult = baseSchema.safeParse(form);
    const fieldErrors: FieldErrors = {};

    if (!baseResult.success) {
      baseResult.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof AllFields;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
    }

    if (form.payment_method === "credit_card") {
      const cardResult = creditCardSchema.safeParse(form);
      if (!cardResult.success) {
        cardResult.error.issues.forEach((issue) => {
          const key = issue.path[0] as keyof AllFields;
          if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        });
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const firstKey = Object.keys(fieldErrors)[0];
      if (firstKey) document.getElementById(firstKey)?.focus();
      return;
    }

    if (items.length === 0) return;
    setSubmitting(true);

    // ── Mock credit card authorization ────────────────────────
    if (form.payment_method === "credit_card") {
      setMockProcessing("authorizing");
      await new Promise((r) => setTimeout(r, 1800));
      setMockProcessing("approved");
      await new Promise((r) => setTimeout(r, 700));
    }

    try {
      const orderItems = items.map((item) => ({
        product_id: item.product_id,
        quantity:   item.quantity,
        price:      item.product.price,
        line_total: item.product.price * item.quantity,
        product:    item.product,
      }));

      const res = await fetch("/api/orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items:            orderItems,
          shipping_address: {
            full_name:     form.full_name,
            phone:         form.phone,
            address_line1: form.address_line1,
            address_line2: null,
            city:          form.city,
            province:      form.city === "Kigali" ? "Kigali" : "Nord",
            country:       "Rwanda",
          },
          payment_method: form.payment_method,
          notes:          form.notes ?? null,
          total,
          shipping_fee:   shipping,
          grand_total:    grandTotal,
        }),
      });

      if (!res.ok) {
        const body = await res.json() as { message?: string };
        throw new Error(body.message ?? "Failed to create order");
      }

      const order = await res.json() as { id: string };
      clearCart();
      router.push(`/order-confirmation?id=${order.id}`);
    } catch (err) {
      setMockProcessing("idle");
      setServerError(
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again."
      );
      setSubmitting(false);
    }
  }

  const isCreditCard = form.payment_method === "credit_card";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">

      {serverError && (
        <div role="alert" className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <p>{serverError}</p>
        </div>
      )}

      {/* Section 1: Customer info */}
      <fieldset className="space-y-5">
        <legend className="text-base font-bold text-white pb-1 border-b border-surface-600 w-full">
          1. Customer information
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full name" id="full_name" error={errors.full_name} required>
            <input
              id="full_name" name="full_name" type="text"
              value={form.full_name} onChange={handleChange}
              placeholder="Jane Doe"
              autoComplete="name"
              className={cn("input", errors.full_name && "input-error")}
            />
          </Field>

          <Field label="Email" id="email" error={errors.email} required>
            <input
              id="email" name="email" type="email"
              value={form.email} onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              className={cn("input", errors.email && "input-error")}
            />
          </Field>

          <Field label="Phone" id="phone" error={errors.phone} required>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" aria-hidden="true" />
              <input
                id="phone" name="phone" type="tel"
                value={form.phone} onChange={handleChange}
                placeholder="+1 555 000 0000"
                autoComplete="tel"
                className={cn("input pl-9", errors.phone && "input-error")}
              />
            </div>
          </Field>
        </div>
      </fieldset>

      {/* Section 2: Delivery */}
      <fieldset className="space-y-5">
        <legend className="text-base font-bold text-white pb-1 border-b border-surface-600 w-full">
          2. Delivery address
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Street / Address" id="address_line1" error={errors.address_line1} required>
            <input
              id="address_line1" name="address_line1" type="text"
              value={form.address_line1} onChange={handleChange}
              placeholder="123 Main St, Apt 4"
              autoComplete="street-address"
              className={cn("input", errors.address_line1 && "input-error")}
            />
          </Field>

          <Field label="City" id="city" error={errors.city} required>
            <select
              id="city" name="city"
              value={form.city} onChange={handleChange}
              className={cn("input", errors.city && "input-error")}
            >
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <div className="sm:col-span-2">
            <Field label="Delivery notes (optional)" id="notes" error={errors.notes}>
              <textarea
                id="notes" name="notes"
                value={form.notes} onChange={handleChange}
                rows={2}
                placeholder="Any instructions for the delivery driver…"
                className={cn("input resize-none", errors.notes && "input-error")}
              />
            </Field>
          </div>
        </div>
      </fieldset>

      {/* Section 3: Payment */}
      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-white pb-1 border-b border-surface-600 w-full">
          3. Payment method
        </legend>

        {/* Payment method selector */}
        <div className="space-y-3">
          {/* Credit card (mock) */}
          <label className={cn(
            "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
            isCreditCard
              ? "border-brand-500 bg-brand-500/10"
              : "border-surface-500 hover:border-surface-400"
          )}>
            <input
              type="radio" name="payment_method" value="credit_card"
              checked={isCreditCard}
              onChange={handleChange}
              className="w-4 h-4 text-brand-500 focus:ring-brand-500 border-surface-400 bg-surface-700"
            />
            <CreditCard className="w-5 h-5 text-brand-400 shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Credit / Debit card</p>
              <p className="text-xs text-slate-400 mt-0.5">Visa, Mastercard, Amex — simulated payment</p>
            </div>
            <div className="flex gap-1.5">
              {["V", "M", "A"].map((b) => (
                <span key={b} className="w-7 h-5 flex items-center justify-center bg-surface-600 border border-surface-400 rounded text-[9px] font-black text-slate-300">
                  {b}
                </span>
              ))}
            </div>
          </label>

          {/* Cash on delivery */}
          <label className={cn(
            "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
            form.payment_method === "cash_on_delivery"
              ? "border-brand-500 bg-brand-500/10"
              : "border-surface-500 hover:border-surface-400"
          )}>
            <input
              type="radio" name="payment_method" value="cash_on_delivery"
              checked={form.payment_method === "cash_on_delivery"}
              onChange={handleChange}
              className="w-4 h-4 text-brand-500 focus:ring-brand-500 border-surface-400 bg-surface-700"
            />
            <Banknote className="w-5 h-5 text-neon-400 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-white">Cash on delivery</p>
              <p className="text-xs text-slate-400 mt-0.5">Pay when your order arrives</p>
            </div>
          </label>

          {/* MTN Mobile Money */}
          <label className={cn(
            "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
            form.payment_method === "mtn_momo"
              ? "border-brand-500 bg-brand-500/10"
              : "border-surface-500 hover:border-surface-400"
          )}>
            <input
              type="radio" name="payment_method" value="mtn_momo"
              checked={form.payment_method === "mtn_momo"}
              onChange={handleChange}
              className="w-4 h-4 text-brand-500 focus:ring-brand-500 border-surface-400 bg-surface-700"
            />
            <Phone className="w-5 h-5 text-yellow-400 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-white">MTN Mobile Money</p>
              <p className="text-xs text-slate-400 mt-0.5">Pay with your MTN MoMo wallet</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-yellow-400 text-yellow-900">MTN</span>
          </label>

          {/* Airtel Money */}
          <label className={cn(
            "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
            form.payment_method === "airtel_money"
              ? "border-brand-500 bg-brand-500/10"
              : "border-surface-500 hover:border-surface-400"
          )}>
            <input
              type="radio" name="payment_method" value="airtel_money"
              checked={form.payment_method === "airtel_money"}
              onChange={handleChange}
              className="w-4 h-4 text-brand-500 focus:ring-brand-500 border-surface-400 bg-surface-700"
            />
            <Phone className="w-5 h-5 text-red-400 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-white">Airtel Money</p>
              <p className="text-xs text-slate-400 mt-0.5">Pay with your Airtel Money wallet</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-500 text-white">Airtel</span>
          </label>
        </div>

        {/* ── Credit card inputs ────────────────────────────── */}
        {isCreditCard && (
          <div className="space-y-5 animate-slide-up">
            {/* Card visual */}
            <CreditCardVisual
              number={form.card_number ?? ""}
              name={form.card_name ?? ""}
              expiry={form.card_expiry ?? ""}
              flipped={cvcFocused}
            />

            {/* Demo hint */}
            <div className="flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-xl px-4 py-3 text-xs text-brand-300">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>
                <strong>Demo mode</strong> — use any card number. Try: <code className="font-mono">4242 4242 4242 4242</code>, exp <code className="font-mono">12/27</code>, CVC <code className="font-mono">123</code>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Field label="Cardholder name" id="card_name" error={errors.card_name} required>
                <input
                  id="card_name" name="card_name" type="text"
                  value={form.card_name ?? ""} onChange={handleChange}
                  placeholder="Jane Doe"
                  autoComplete="cc-name"
                  className={cn("input", errors.card_name && "input-error")}
                />
              </Field>

              <Field label="Card number" id="card_number" error={errors.card_number} required>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" aria-hidden="true" />
                  <input
                    id="card_number" name="card_number" type="text"
                    value={form.card_number ?? ""} onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    autoComplete="cc-number"
                    inputMode="numeric"
                    maxLength={19}
                    className={cn("input pl-9 font-mono tracking-wider", errors.card_number && "input-error")}
                  />
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry date" id="card_expiry" error={errors.card_expiry} required>
                  <input
                    id="card_expiry" name="card_expiry" type="text"
                    value={form.card_expiry ?? ""} onChange={handleChange}
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                    inputMode="numeric"
                    maxLength={5}
                    className={cn("input font-mono", errors.card_expiry && "input-error")}
                  />
                </Field>

                <Field label="CVV / CVC" id="card_cvc" error={errors.card_cvc} required>
                  <div className="relative">
                    <input
                      id="card_cvc" name="card_cvc" type={showCvc ? "text" : "password"}
                      value={form.card_cvc ?? ""} onChange={handleChange}
                      onFocus={() => setCvcFocused(true)}
                      onBlur={() => setCvcFocused(false)}
                      placeholder="•••"
                      autoComplete="cc-csc"
                      inputMode="numeric"
                      maxLength={4}
                      className={cn("input pr-9 font-mono", errors.card_cvc && "input-error")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCvc((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                      aria-label={showCvc ? "Hide CVV" : "Show CVV"}
                    >
                      {showCvc ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>
              </div>
            </div>
          </div>
        )}
      </fieldset>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || items.length === 0}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-4 rounded-xl",
          "text-base font-black transition-all duration-150",
          submitting || items.length === 0
            ? "bg-surface-600 text-slate-500 cursor-not-allowed"
            : "btn-primary shadow-glow-blue hover:scale-[1.01] active:scale-100"
        )}
        aria-busy={submitting}
      >
        {mockProcessing === "authorizing" ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
            Authorizing payment…
          </>
        ) : mockProcessing === "approved" ? (
          <>
            <Check className="w-5 h-5" />
            Payment approved!
          </>
        ) : submitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
            Placing order…
          </>
        ) : (
          <>
            {isCreditCard ? <Lock className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            Place order — {formatPrice(grandTotal)}
          </>
        )}
      </button>

      <p className="text-xs text-center text-slate-500">
        By placing your order you agree to our{" "}
        <span className="underline cursor-pointer hover:text-slate-300">terms and conditions</span>.
        {isCreditCard && (
          <>
            <br />
            <Lock className="inline w-3 h-3 mr-0.5 text-neon-500" />
            All card details are simulated — no real charges will be made.
          </>
        )}
      </p>
    </form>
  );
}
