"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

function normalizeCartItem(item: CartItem): CartItem {
  if (!item.product_id.startsWith("p1000000-")) return item;
  const normalizedId = item.product_id.replace(/^p1000000-/, "b1000000-");
  return {
    ...item,
    product_id: normalizedId,
    product: {
      ...item.product,
      id: normalizedId,
    },
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity) =>
        set((state) => {
          const existing = state.items.find((i) => i.product_id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === product.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { product_id: product.id, product, quantity: Math.min(quantity, product.stock) },
            ],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === productId
              ? { ...i, quantity: Math.min(Math.max(1, quantity), i.product.stock) }
              : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "techshop-cart",
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (!state?.items?.length) return;
        const normalizedItems = state.items.map(normalizeCartItem);
        const changed = normalizedItems.some(
          (item, index) => item.product_id !== state.items[index]?.product_id
        );
        if (changed) {
          set({ items: normalizedItems });
        }
      },
    }
  )
);
