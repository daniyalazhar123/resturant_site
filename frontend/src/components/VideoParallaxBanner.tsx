"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function VideoParallaxBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.0, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0.4, 1, 1, 0.4]);
  const textY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={containerRef} className="relative h-[65vh] min-h-[450px] overflow-hidden bg-zinc-950 flex items-center justify-center border-y border-amber-500/20">
      {/* Animated Video Background with Parallax Scale */}
      <motion.div style={{ scale, opacity }} className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full brightness-[0.35]"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-thick-sirloin-steak-sizzling-on-the-grill-41629-large.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dark Vignette & Gold Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-zinc-950" />
      </motion.div>

      {/* Floating Scroll Text Overlay */}
      <motion.div style={{ y: textY }} className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-4">
        <span className="text-amber-400 font-serif tracking-[0.3em] text-xs uppercase block font-medium">
          Live Wood-Fire & Charcoal Magic
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white leading-tight">
          Where Sizzling Flames Meet <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 font-serif">
            Unforgettable Flavor
          </span>
        </h2>
        <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
          Experience the sizzle of prime wagyu cuts, fresh lobster thermidor, and hand-churned saffron spices over open glowing coals.
        </p>
        <div className="pt-4">
          <Link
            href="/reservation"
            className="inline-block px-8 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-semibold tracking-wider uppercase rounded-sm hover:brightness-110 transition-all duration-300 shadow-xl shadow-amber-500/20 text-xs sm:text-sm"
          >
            Reserve Chef's Counter
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
