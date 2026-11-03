"use client";

import MenuBook from "@/components/MenuBook";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MenuPage() {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen pt-8 pb-20">
      {/* Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-12">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-amber-400 font-serif tracking-[0.25em] text-xs uppercase block font-medium"
        >
          Royal Culinary Collection
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl sm:text-6xl font-serif font-bold text-white"
        >
          Explore Our Global Gastronomy
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto font-light"
        >
          Authentic Pakistani, Indian, Chinese, Thai, Seafood, and French delights prepared by world-class chefs.
        </motion.p>
      </div>

      {/* Interactive Menu Book Component */}
      <MenuBook />

      {/* CTA Reservation Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mt-16">
        <div className="p-8 rounded-xl bg-zinc-900/60 border border-amber-500/30 backdrop-blur-md space-y-4 shadow-2xl">
          <h3 className="text-2xl font-serif font-bold text-white">
            Wish to Experience These Delicacies Live?
          </h3>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto font-light">
            Reserve a table in our main dining hall or book a private VIP suite with personal chef service.
          </p>
          <div className="pt-2">
            <Link
              href="/reservation"
              className="inline-block px-8 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-semibold tracking-wider uppercase rounded hover:brightness-110 transition-all duration-300 shadow-lg shadow-amber-500/20 text-xs sm:text-sm"
            >
              Book Table Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
