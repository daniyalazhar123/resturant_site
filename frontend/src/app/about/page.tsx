"use client";

import TeamShowcase from "@/components/TeamShowcase";
import ServicesSection from "@/components/ServicesSection";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen pt-8 pb-20">
      {/* Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-amber-400 font-serif tracking-[0.25em] text-xs uppercase block font-medium"
        >
          Our Heritage & Legacy
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl sm:text-6xl font-serif font-bold text-white"
        >
          L'Étoile Dorée & Royal Pavilion
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto font-light"
        >
          A fusion of French fine dining mastery and royal Eastern culinary heritage.
        </motion.p>
      </div>

      {/* Split Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-6 space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Where Classical Elegance Meets <br />
              <span className="text-amber-400 font-serif">Eastern Royal Traditions</span>
            </h2>
            <p className="text-zinc-400 font-light leading-relaxed text-sm sm:text-base">
              Founded with a vision to redefine haute gastronomy, L'Étoile Dorée & Royal Pavilion brings together young culinary prodigies from Paris, Lahore, Lucknow, Tokyo, and Hong Kong under one roof.
            </p>
            <p className="text-zinc-400 font-light leading-relaxed text-sm sm:text-base">
              Every dish is cooked over live wood charcoal, slow Dum Pukht clay pots, or high-flame woks using organic produce and wild-caught seafood.
            </p>
            <blockquote className="border-l-2 border-amber-400 pl-4 py-2">
              <p className="text-amber-400 italic font-serif text-lg leading-relaxed">
                "Gastronomy is the universal language of emotion, artistry, and royal hospitality."
              </p>
              <cite className="text-zinc-500 text-xs tracking-wider uppercase block mt-2 font-semibold">
                — Chef Aria Montclair & Team
              </cite>
            </blockquote>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-6 relative h-[420px] rounded-xl overflow-hidden shadow-2xl border border-amber-500/20"
          >
            <Image
              src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80"
              alt="Plating Food in Kitchen"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Team Showcase */}
      <TeamShowcase />

      {/* Services Section */}
      <ServicesSection />
    </div>
  );
}
