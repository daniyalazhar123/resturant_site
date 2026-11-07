"use client";

import { useState, useEffect } from "react";
import { z } from "zod";

export interface CartItem {
  id: string;
  name: string;
  price: string;
  priceNumber: number;
  image: string;
  category: string;
  quantity: number;
}

const CartItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.string(),
  priceNumber: z.number().nonnegative(),
  image: z.string(),
  category: z.string(),
  quantity: z.number().int().positive(),
});

const CART_KEY = "etoile_cart_items";

export function getCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const validated: CartItem[] = [];
    for (const item of parsed) {
      const res = CartItemSchema.safeParse(item);
      if (res.success) {
        validated.push(res.data);
      }
    }
    return validated;
  } catch {
    return [];
  }
}

export function saveCartToStorage(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  } catch (err) {
    console.error("Failed to save cart to storage", err);
  }
}

export function useCartState() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCartFromStorage());

    const handleUpdate = () => {
      setCart(getCartFromStorage());
    };

    window.addEventListener("cart-updated", handleUpdate);
    return () => window.removeEventListener("cart-updated", handleUpdate);
  }, []);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    const current = getCartFromStorage();
    const existingIndex = current.findIndex((i) => i.id === item.id);

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = current.map((c, idx) =>
        idx === existingIndex ? { ...c, quantity: c.quantity + 1 } : c
      );
    } else {
      updated = [...current, { ...item, quantity: 1 }];
    }

    saveCartToStorage(updated);
  };

  const removeFromCart = (id: string) => {
    const current = getCartFromStorage();
    const updated = current.filter((i) => i.id !== id);
    saveCartToStorage(updated);
  };

  const updateQuantity = (id: string, delta: number) => {
    const current = getCartFromStorage();
    const updated = current
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    saveCartToStorage(updated);
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.priceNumber * item.quantity, 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };
}
