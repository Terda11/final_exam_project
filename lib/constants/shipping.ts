/** Shipping fee (RWF) — free when cart subtotal meets threshold. */
export const SHIPPING_FEE = Number(
  process.env.NEXT_PUBLIC_SHIPPING_FEE ?? 2000
);

export const SHIPPING_THRESHOLD = Number(
  process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD ?? 20000
);
