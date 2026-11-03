"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import ParticleGoldField from "./ParticleGoldField";
import TextReveal from "./TextReveal";

export default function HeroCinematic() {
  const [stage, setStage] = useState<"exterior" | "entrance" | "interior">("exterior");

  useEffect(() => {
    const timer1 = setTimeout(() => setStage("entrance"), 4000);
    const timer2 = setTimeout(() => setStage("interior"), 7500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const stages = [
    { id: "exterior", label: "01. Facade & Emblem" },
    { id: "entrance", label: "02. Grand Entrance" },
    { id: "interior", label: "03. Royal Interior" },
  ];

  return (
    <section className="relative h-[92vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Gold Dust Particles Background */}
      <ParticleGoldField count={25} />

      {/* Background Visual Layers with Smooth Camera Zoom */}
      <AnimatePresence mode="wait">
        {stage === "exterior" && (
          <motion.div
            key="exterior"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1.0, opacity: 1 }}
            exit={{ scale: 1.15, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <Image
              src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1920&q=85"
              alt="Hotel Exterior Facade"
              fill
              priority
              className="object-cover brightness-[0.35]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/70" />
          </motion.div>
        )}

        {stage === "entrance" && (
          <motion.div
            key="entrance"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1.0, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <Image
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=85"
              alt="Grand Entrance Hall"
              fill
              priority
              className="object-cover brightness-[0.35]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-zinc-950/60" />
          </motion.div>
        )}

        {stage === "interior" && (
          <motion.div
            key="interior"
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1.0, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="object-cover w-full h-full brightness-[0.3]"
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-pouring-red-wine-into-a-glass-in-slow-motion-42211-large.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/80" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Overlay */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <Logo size="large" />
        </motion.div>

        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <span className="text-amber-400 font-serif tracking-[0.25em] text-xs sm:text-sm uppercase block font-medium">
            {stage === "exterior" && "An Iconic Parisian Architectural Landmark"}
            {stage === "entrance" && "Step Into Unrivaled Elegance & Hospitality"}
            {stage === "interior" && "A Symphony of Global Gastronomy & Fine Wine"}
          </span>

          <TextReveal
            text="Where Royalty Meets Culinary Artistry"
            className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]"
          />

          <p className="text-zinc-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Experience Michelin-starred mastery, multi-cultural culinary traditions, and white-glove service in the heart of Paris.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/reservation"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-semibold tracking-wider uppercase rounded-sm hover:brightness-110 transition-all duration-300 shadow-xl shadow-amber-500/20 text-xs sm:text-sm"
          >
            Reserve Your Experience
          </Link>
          <Link
            href="/menu"
            className="w-full sm:w-auto px-8 py-4 border border-amber-500/60 bg-zinc-950/60 backdrop-blur-md text-amber-400 font-semibold tracking-wider uppercase rounded-sm hover:bg-amber-500/10 hover:border-amber-400 transition-all duration-300 text-xs sm:text-sm"
          >
            Open Menu Book
          </Link>
        </motion.div>

        {/* Cinematic Stage Controls Indicator */}
        <div className="pt-8 flex items-center justify-center gap-3">
          {stages.map((st) => (
            <button
              key={st.id}
              onClick={() => setStage(st.id as "exterior" | "entrance" | "interior")}
              className={`text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border transition-all duration-300 cursor-pointer ${
                stage === st.id
                  ? "bg-amber-500 text-zinc-950 border-amber-500 font-semibold"
                  : "border-zinc-800 text-zinc-500 hover:text-amber-400"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
