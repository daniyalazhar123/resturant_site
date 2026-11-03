"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartState } from "@/lib/cartStore";

export default function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCartState();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Slide-out Cart Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-zinc-950 border-l border-amber-500/20 p-6 flex flex-col justify-between shadow-2xl"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🛒</span>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">Your Pre-Order</h3>
                    <p className="text-xs text-amber-500 font-light">
                      {totalItems} {totalItems === 1 ? "Item" : "Items"} Selected
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Items List */}
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <span className="text-4xl block">🍽️</span>
                  <p className="text-zinc-400 text-sm font-light">Your pre-order cart is empty.</p>
                  <Link
                    href="/menu"
                    onClick={onClose}
                    className="inline-block px-6 py-2 bg-amber-500 text-zinc-950 text-xs font-semibold uppercase rounded tracking-wider hover:bg-amber-400 transition-colors"
                  >
                    Browse Menu Book
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 items-center justify-between"
                    >
                      <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0 border border-zinc-800">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-grow space-y-1">
                        <h4 className="text-sm font-serif font-medium text-white line-clamp-1">
                          {item.name}
                        </h4>
                        <span className="text-xs text-amber-400 font-bold">{item.price}</span>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-5 h-5 bg-zinc-800 text-zinc-300 rounded flex items-center justify-center text-xs hover:bg-amber-500 hover:text-zinc-950"
                          >
                            -
                          </button>
                          <span className="text-xs font-mono">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-5 h-5 bg-zinc-800 text-zinc-300 rounded flex items-center justify-center text-xs hover:bg-amber-500 hover:text-zinc-950"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-zinc-500 hover:text-red-400 p-1"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout CTA */}
            {cart.length > 0 && (
              <div className="border-t border-zinc-800 pt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400 font-light">Subtotal</span>
                  <span className="text-amber-400 font-bold font-serif text-lg">
                    €{totalPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500">
                  Tax included. Pre-orders are prepared fresh upon your selected pickup/arrival time.
                </p>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full text-center py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-semibold uppercase tracking-wider text-xs rounded hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
                >
                  Proceed to Checkout (€{totalPrice.toFixed(2)})
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
