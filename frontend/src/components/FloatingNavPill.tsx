"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function FloatingNavPill() {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.6, type: "spring" }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden sm:flex items-center gap-2 p-2 rounded-full bg-zinc-950/85 backdrop-blur-xl border border-amber-500/30 shadow-2xl shadow-amber-500/10"
    >
      <Link
        href="/menu"
        className="px-4 py-2 text-xs font-serif tracking-wider uppercase text-amber-400 hover:text-white rounded-full hover:bg-zinc-900 transition-all flex items-center gap-1.5"
      >
        <span>📖</span>
        <span>Menu Book</span>
      </Link>

      <div className="w-[1px] h-4 bg-zinc-800" />

      <Link
        href="/reservation"
        className="px-5 py-2 text-xs font-serif tracking-wider uppercase bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-bold rounded-full hover:brightness-110 transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
      >
        <span>👑</span>
        <span>Reserve Table</span>
      </Link>

      <div className="w-[1px] h-4 bg-zinc-800" />

      <Link
        href="/checkout"
        className="px-4 py-2 text-xs font-serif tracking-wider uppercase text-zinc-300 hover:text-amber-400 rounded-full hover:bg-zinc-900 transition-all flex items-center gap-1.5"
      >
        <span>🛍️</span>
        <span>Pre-Order</span>
      </Link>

      <div className="w-[1px] h-4 bg-zinc-800" />

      <a
        href="https://wa.me/33142685500"
        target="_blank"
        rel="noreferrer"
        className="p-2 text-xs text-emerald-400 hover:text-emerald-300 rounded-full hover:bg-zinc-900 transition-all"
        title="WhatsApp Concierge"
      >
        💬
      </a>
    </motion.div>
  );
}
