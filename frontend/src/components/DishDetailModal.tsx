"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCartState } from "@/lib/cartStore";

export interface DishDetail {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  price: string;
  priceNumber: number;
  category: string;
  image: string;
  rating?: string;
  pairing?: string;
  ingredients?: string[];
  dietary?: string[];
}

export default function DishDetailModal({
  dish,
  onClose,
}: {
  dish: DishDetail | null;
  onClose: () => void;
}) {
  const { addToCart } = useCartState();

  if (!dish) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-3xl bg-zinc-950 border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-zinc-900/80 text-zinc-300 hover:text-white flex items-center justify-center border border-zinc-700 cursor-pointer"
          >
            ✕
          </button>

          {/* Left Image Column */}
          <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[280px]">
            <Image src={dish.image} alt={dish.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent md:hidden" />
          </div>

          {/* Right Details Column */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-4 overflow-y-auto">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.2em] font-serif text-amber-400 font-semibold">
                {dish.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                {dish.name}
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold font-serif text-2xl">{dish.price}</span>
                {dish.rating && (
                  <span className="text-xs text-zinc-400 font-mono bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                    {dish.rating}
                  </span>
                )}
              </div>

              <p className="text-zinc-300 text-xs sm:text-sm font-light leading-relaxed">
                {dish.description}
              </p>

              {/* Pairing Note */}
              {dish.pairing && (
                <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <span className="text-[9px] uppercase font-semibold text-amber-400 tracking-wider block">
                    Sommelier Pairing
                  </span>
                  <p className="text-xs text-zinc-300 font-serif italic">🥂 {dish.pairing}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  addToCart({
                    id: dish.id,
                    name: dish.name,
                    price: dish.price,
                    priceNumber: dish.priceNumber,
                    image: dish.image,
                    category: dish.category,
                  });
                  onClose();
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-semibold tracking-wider uppercase text-xs rounded hover:brightness-110 transition-all shadow-md shadow-amber-500/10 cursor-pointer"
              >
                Add to Pre-Order ({dish.price})
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
