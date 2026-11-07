"use client";

import TeamShowcase from "@/components/TeamShowcase";
import ServicesSection from "@/components/ServicesSection";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  const milestones = [
    {
      year: "2018",
      title: "The Genesis at Place Vendôme",
      desc: "Conceived as an intimate 12-table salon uniting classical French culinary precision with grand Mughlai dum-pukht traditions.",
    },
    {
      year: "2021",
      title: "Three Michelin Stars Recognition",
      desc: "Honored with the highest gastronomic accolades for our wood-fired charcoal tasting menus and rare biodynamic pairings.",
    },
    {
      year: "2024",
      title: "The Royal Pavilion Expansion",
      desc: "Unveiling private dining suites, an artisanal sommelier cellar with over 1,200 vintages, and bespoke white-glove catering.",
    },
    {
      year: "2026",
      title: "AI Culinary Concierge & Global Touch",
      desc: "Integrating state-of-the-art interactive tasting menus, digital concierge recommendations, and seamless haute takeout.",
    },
  ];

  const pillars = [
    {
      icon: "🪵",
      title: "Live Wood & Clay Pots",
      description: "No shortcuts. Every broth simmers 24 hours in clay handis, and every cut is finished over glowing olive-wood embers.",
    },
    {
      icon: "🌿",
      title: "Artisanal & Biodynamic",
      description: "Direct partnerships with single-estate spice growers in Kashmir, organic French farms, and sustainable deep-sea divers.",
    },
    {
      icon: "👑",
      title: "White-Glove Hospitality",
      description: "From custom monogrammed table settings to dedicated multilingual sommeliers, your experience is completely bespoke.",
    },
  ];

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen pt-12 pb-24 overflow-hidden">
      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 mb-20">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-amber-400 font-serif tracking-[0.3em] text-xs uppercase block font-semibold"
        >
          Haute Gastronomie • Place Vendôme, Paris
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-tight"
        >
          Our Heritage &amp; Symphony
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed"
        >
          Where the classical discipline of French gastronomy converges with the opulent, slow-cooked alchemy of royal Eastern dynasties.
        </motion.p>
        <div className="h-1 w-24 bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700 mx-auto mt-6" />
      </div>

      {/* Split Story Section with Visual Overlap */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-6 space-y-6"
          >
            <span className="text-xs font-mono text-amber-500 tracking-wider uppercase block">
              Chapter I • The Philosophy
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              An Ode to Fire, Saffron &amp; Perfection
            </h2>
            <p className="text-zinc-300 font-light leading-relaxed text-sm sm:text-base">
              Founded on the belief that fine dining should be both intellectually arresting and emotionally transcendent, 
              <strong className="text-white font-medium"> L&apos;Étoile Dorée &amp; Royal Pavilion</strong> brings together culinary masters 
              from Paris, Lahore, Lucknow, Tokyo, and Hong Kong under one vaulted roof.
            </p>
            <p className="text-zinc-400 font-light leading-relaxed text-sm sm:text-base">
              We do not believe in culinary borders. A Maine lobster poached in hand-churned French butter finds its counterpart in 
              delicately toasted green cardamom and fragrant kewra water, cooked with the timeless patience of royal court kitchens.
            </p>

            <blockquote className="border-l-2 border-amber-400 pl-6 py-2 my-6 bg-zinc-900/40 rounded-r-lg">
              <p className="text-amber-300 italic font-serif text-lg sm:text-xl leading-relaxed">
                &quot;To cook for someone with devotion is to offer them a piece of eternity. Here, every dish is an artful ceremony.&quot;
              </p>
              <cite className="text-zinc-400 text-xs tracking-wider uppercase block mt-3 font-semibold font-mono">
                — Chef Aria Montclair &amp; Master Mahnoor Khan
              </cite>
            </blockquote>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/reservation"
                className="px-7 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded hover:brightness-110 transition shadow-lg shadow-amber-500/20"
              >
                Reserve Your Experience
              </Link>
              <Link
                href="/menu"
                className="px-7 py-3.5 border border-zinc-700 hover:border-amber-400 text-zinc-300 hover:text-amber-400 text-xs font-semibold uppercase tracking-wider rounded transition"
              >
                Explore The Menu
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-6 relative"
          >
            <div className="relative h-[480px] sm:h-[540px] rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30">
              <Image
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85"
                alt="Haute Cuisine Plating & Ambiance"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-zinc-950/80 backdrop-blur-md border border-amber-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-amber-400 tracking-wider block">
                    Heritage Landmark
                  </span>
                  <span className="text-sm font-serif font-bold text-white">
                    12 Place Vendôme, 75001 Paris
                  </span>
                </div>
                <span className="text-xl">🌟🌟🌟</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Culinary Pillars */}
      <section className="bg-zinc-900/30 border-y border-amber-500/15 py-20 mb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase font-serif tracking-[0.25em] text-amber-400">
              Our Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              The Three Pillars of Haute Gastronomie
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl bg-zinc-950/60 border border-zinc-800 hover:border-amber-500/40 transition-all duration-300 space-y-4 shadow-xl"
              >
                <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-serif font-bold text-white">
                  {pillar.title}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Timeline of Milestones */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs uppercase font-serif tracking-[0.25em] text-amber-400">
            A Journey of Craft
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            Historical Milestones
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto font-light">
            How a daring dream between Paris and Lahore blossomed into a Michelin-celebrated standard.
          </p>
        </div>

        <div className="relative border-l border-amber-500/30 ml-4 md:ml-32 space-y-12">
          {milestones.map((m, idx) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative pl-8 sm:pl-10 group"
            >
              {/* Timeline marker */}
              <div className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full bg-zinc-950 border-2 border-amber-400 group-hover:scale-125 group-hover:bg-amber-400 transition-all duration-300" />
              
              <div className="space-y-1">
                <span className="font-mono text-amber-400 font-bold text-sm tracking-wider">
                  {m.year}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  {m.title}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed max-w-2xl">
                  {m.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Culinary Team Showcase */}
      <TeamShowcase />

      {/* VIP Services Showcase */}
      <div className="mt-20">
        <ServicesSection />
      </div>
    </div>
  );
}
