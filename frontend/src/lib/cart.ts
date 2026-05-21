"use client";

import { useEffect, useState } from "react";
import { PRODUCTS, type Product } from "@/lib/products";

const STORAGE_KEY = "gh-cart-v1";

export interface CartItem {
  id: string;
  qty: number;
}

export interface CartLine extends CartItem {
  product: Product;
  subtotal: number;
}

interface CartState {
  items: CartItem[];
  hydrated: boolean;
}

function readStorage(): CartItem[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (x): x is CartItem =>
        typeof x?.id === "string" && typeof x?.qty === "number" && x.qty > 0
    );
  } catch {
    return null;
  }
}

function writeStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota errors */
  }
}

// Default seed so users see a populated cart on first visit
const DEFAULT_SEED: CartItem[] = [
  { id: "p01", qty: 2 }, // Tomat Ceri Segar
  { id: "p03", qty: 1 }, // Beras Pandan Wangi
  { id: "p10", qty: 3 }, // Jahe Merah
];

export function useCart() {
  const [state, setState] = useState<CartState>({ items: [], hydrated: false });

  // Hydrate from storage (with seed fallback)
  useEffect(() => {
    const stored = readStorage();
    if (stored && stored.length > 0) {
      setState({ items: stored, hydrated: true });
    } else if (stored === null) {
      // first ever visit -> seed
      writeStorage(DEFAULT_SEED);
      setState({ items: DEFAULT_SEED, hydrated: true });
    } else {
      // empty array stored
      setState({ items: [], hydrated: true });
    }
  }, []);

  // Persist on change after hydration
  useEffect(() => {
    if (state.hydrated) writeStorage(state.items);
  }, [state.items, state.hydrated]);

  const setQty = (id: string, qty: number) =>
    setState((s) => ({
      ...s,
      items: s.items
        .map((it) => (it.id === id ? { ...it, qty: Math.max(0, qty) } : it))
        .filter((it) => it.qty > 0),
    }));

  const increment = (id: string) =>
    setState((s) => ({
      ...s,
      items: s.items.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it)),
    }));

  const decrement = (id: string) =>
    setState((s) => ({
      ...s,
      items: s.items
        .map((it) => (it.id === id ? { ...it, qty: it.qty - 1 } : it))
        .filter((it) => it.qty > 0),
    }));

  const remove = (id: string) =>
    setState((s) => ({ ...s, items: s.items.filter((it) => it.id !== id) }));

  const clear = () => setState((s) => ({ ...s, items: [] }));

  const lines: CartLine[] = state.items
    .map((it) => {
      const product = PRODUCTS.find((p) => p.id === it.id);
      if (!product) return null;
      return { ...it, product, subtotal: product.price * it.qty };
    })
    .filter((x): x is CartLine => x !== null);

  const totalItems = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.subtotal, 0);

  return {
    hydrated: state.hydrated,
    items: state.items,
    lines,
    totalItems,
    subtotal,
    setQty,
    increment,
    decrement,
    remove,
    clear,
  };
}
