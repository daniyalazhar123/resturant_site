"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Logo({ size = "normal" }: { size?: "small" | "normal" | "large" }) {
  const isLarge = size === "large";
  const isSmall = size === "small";

  return (
    <Link href="/" className="group flex items-center gap-3 select-none">
      {/* Golden Emblem Badge */}
      <motion.div
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-amber-500 to-amber-700 p-[1px] shadow-lg shadow-amber-500/20 ${
          isLarge ? "w-14 h-14" : isSmall ? "w-8 h-8" : "w-10 h-10"
        }`}
      >
        {/* Inner Glass Core */}
        <div className="w-full h-full rounded-full bg-zinc-950/90 backdrop-blur-md flex items-center justify-center border border-amber-500/30 group-hover:border-amber-400 transition-colors">
          {/* SVG Monogram Emblem */}
          <svg
            viewBox="0 0 40 40"
            fill="none"
            className={`${isLarge ? "w-8 h-8" : isSmall ? "w-5 h-5" : "w-6 h-6"} text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]`}
          >
            <path
              d="M20 3L23.5 14H35L26 21L29.5 32L20 25L10.5 32L14 21L5 14H16.5L20 3Z"
              fill="url(#goldGradient)"
              stroke="#F59E0B"
              strokeWidth="0.75"
            />
            <circle cx="20" cy="20" r="14" stroke="#D4AF37" strokeWidth="0.8" strokeDasharray="2 2" />
            <defs>
              <linearGradient id="goldGradient" x1="5" y1="3" x2="35" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FEF08A" />
                <stop offset="0.5" stopColor="#F59E0B" />
                <stop offset="1" stopColor="#B45309" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </motion.div>

      {/* Typography Brand Name */}
      <div className="flex flex-col">
        <span
          className={`font-serif font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-400 to-amber-600 leading-none ${
            isLarge ? "text-2xl sm:text-3xl" : isSmall ? "text-base" : "text-lg sm:text-xl"
          }`}
        >
          L'ÉTOILE DORÉE
        </span>
        <span
          className={`font-serif tracking-[0.3em] uppercase text-amber-500/80 font-medium ${
            isLarge ? "text-xs mt-1" : isSmall ? "text-[8px]" : "text-[9px]"
          }`}
        >
          & Royal Pavilion
        </span>
      </div>
    </Link>
  );
}
