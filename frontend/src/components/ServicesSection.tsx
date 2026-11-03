"use client";

import { motion } from "framer-motion";

interface Service {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  badge: string;
}

export default function ServicesSection() {
  const services: Service[] = [
    {
      title: "VIP Private Dining Suites",
      subtitle: "Exclusive Privacy for Royals & Dignitaries",
      description: "Soundproof private dining rooms with personal butler service, private entrance, and custom floral ambience.",
      icon: "👑",
      badge: "By Reservation Only",
    },
    {
      title: "The Chef's Table Experience",
      subtitle: "Front-Row Seat to Culinary Mastery",
      description: "An intimate 8-seat counter right inside the kitchen. Executive Chef Aria personally curates a 12-course surprise tasting menu.",
      icon: "✨",
      badge: "Exclusive 8 Seats",
    },
    {
      title: "Live Fire & Charcoal Station",
      subtitle: "Interactive Teppanyaki & Robata Grill",
      description: "Watch master chefs sear prime cuts, lobster, and kebabs over open glowing charcoal flames right before your eyes.",
      icon: "🔥",
      badge: "Live Interactive",
    },
    {
      title: "White-Glove Valet & Concierge",
      subtitle: "Seamless Arrival & Luxury Transport",
      description: "Complimentary luxury valet parking, private chauffeur dispatch, and dedicated cloakroom concierge service.",
      icon: "🚗",
      badge: "Complimentary",
    },
    {
      title: "Royal Gala & Banquet Catering",
      subtitle: "Unforgettable Bespoke Events",
      description: "Bringing our Michelin-starred culinary team and royal service to your private estate, wedding, or high-level summit.",
      icon: "🍷",
      badge: "Off-Site Service",
    },
  ];

  return (
    <section className="py-24 bg-zinc-950 text-zinc-100 overflow-hidden border-t border-zinc-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <span className="text-amber-400 font-serif tracking-[0.25em] text-xs uppercase block font-medium">
            Bespoke Fine Hospitality
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            Unrivaled Luxury Services
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto font-light">
            Every detail crafted to elevate your dining journey beyond extraordinary.
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700 mx-auto mt-4" />
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv, idx) => (
            <motion.div
              key={srv.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group p-8 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-amber-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-4xl p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 group-hover:scale-110 transition-transform">
                    {srv.icon}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                    {srv.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-400 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-amber-400/80 text-xs font-serif italic mt-0.5">
                    {srv.subtitle}
                  </p>
                  <p className="text-zinc-400 text-sm font-light leading-relaxed mt-3">
                    {srv.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-800/60 mt-6 flex items-center justify-between">
                <span className="text-xs text-zinc-500 group-hover:text-amber-400 font-medium transition-colors">
                  Inquire Experience →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
