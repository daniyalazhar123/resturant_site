"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => setIsSent(false), 4000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen pt-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="text-center space-y-3 mb-16">
          <span className="text-amber-400 font-serif tracking-[0.25em] text-xs uppercase block font-medium">
            Location & Concierge
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white">
            Get In Touch
          </h1>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto font-light">
            Located at the prestigious Place Vendôme in Paris. Contact our concierge for private dining inquiries and valet arrangements.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Info & Map */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-xl bg-zinc-900/60 border border-amber-500/20 backdrop-blur-md space-y-6 shadow-xl">
              <h3 className="text-2xl font-serif font-bold text-white border-b border-zinc-800 pb-4">
                Grand Concierge & Valet
              </h3>

              <div className="space-y-4 text-xs font-light text-zinc-300">
                <div className="flex items-start gap-3">
                  <span className="text-amber-400 text-lg">📍</span>
                  <div>
                    <strong className="text-white font-medium block">Address</strong>
                    12 Place Vendôme, 75001 Paris, France
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-amber-400 text-lg">📞</span>
                  <div>
                    <strong className="text-white font-medium block">Direct Telephone</strong>
                    +33 (0)1 42 68 55 00
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-amber-400 text-lg">✉️</span>
                  <div>
                    <strong className="text-white font-medium block">Private Concierge Email</strong>
                    concierge@etoiledoree.fr
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-amber-400 text-lg">🚗</span>
                  <div>
                    <strong className="text-white font-medium block">Valet Parking & Chauffeur</strong>
                    Complimentary private valet service available at the front entryway.
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Quick Chat CTA */}
              <div className="pt-2">
                <a
                  href="https://wa.me/33142685500"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold uppercase tracking-wider text-xs rounded transition-colors"
                >
                  💬 Chat on WhatsApp Concierge
                </a>
              </div>
            </div>

            {/* Map Container */}
            <div className="relative h-64 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center text-center p-6">
              <div className="space-y-2">
                <span className="text-3xl block">🗺️</span>
                <h4 className="text-sm font-serif font-bold text-white">Place Vendôme, Paris</h4>
                <p className="text-xs text-zinc-400 max-w-xs">
                  Interactive map container loaded. Metro: Tuileries / Opéra.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-6 shadow-xl">
              <h3 className="text-2xl font-serif font-bold text-white">
                Send a Concierge Message
              </h3>
              <p className="text-xs text-zinc-400 font-light">
                Inquire about private banquets, media accreditation, or customized menus.
              </p>

              {isSent && (
                <div className="p-4 rounded bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs">
                  ✓ Your message has been routed to Executive Concierge Alexander Vance. We will reply within 2 hours.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-zinc-400 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Lady Eleanor Vance"
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-zinc-400 mb-1">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="eleanor@domain.com"
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-400 mb-1">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. VIP Private Suite Inquiry"
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-400 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your event or special request..."
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-bold uppercase tracking-wider text-xs rounded hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Dispatch Message to Concierge
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
