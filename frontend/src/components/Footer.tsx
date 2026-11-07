"use client";

import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  const pressBadges = ["MICHELIN GUIDE 2026", "VOGUE GOURMET", "FORBES LUXURY", "GQ DINING"];

  return (
    <footer className="bg-zinc-950 text-zinc-100 border-t border-amber-500/15 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Press / Media Badges */}
        <div className="border-b border-zinc-900 pb-12 mb-16">
          <p className="text-center text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-medium mb-6">
            Featured & Recognized In
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-60">
            {pressBadges.map((badge) => (
              <span
                key={badge}
                className="font-serif text-sm tracking-[0.2em] uppercase text-amber-400/80 font-bold"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-zinc-900">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="normal" />
            <p className="text-zinc-400 text-xs font-light leading-relaxed max-w-sm">
              L'Étoile Dorée & Royal Pavilion is a premier haute gastronomie destination celebrating French fine dining and royal Eastern culinary heritage.
            </p>
            <div className="pt-2 text-xs text-amber-500 font-mono">
              📍 12 Place Vendôme, 75001 Paris, France
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-light">
              <li><Link href="/" className="hover:text-amber-400">Home</Link></li>
              <li><Link href="/menu" className="hover:text-amber-400">Culinary Menu</Link></li>
              <li><Link href="/about" className="hover:text-amber-400">Our Heritage</Link></li>
              <li><Link href="/reservation" className="hover:text-amber-400">VIP Booking</Link></li>
            </ul>
          </div>

          {/* Guest Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
              Guest Services
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-light">
              <li><Link href="/checkout" className="hover:text-amber-400">Pre-Order Takeout</Link></li>
              <li><Link href="/contact" className="hover:text-amber-400">Valet & Location</Link></li>
              <li><Link href="/dashboard" className="hover:text-amber-400">VIP Portal</Link></li>
              <li><Link href="/contact" className="hover:text-amber-400">Private Catering</Link></li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
              Hours of Service
            </h4>
            <div className="text-xs text-zinc-400 space-y-1 font-light">
              <p><span className="text-white font-medium">Lunch:</span> 12:00 – 15:30</p>
              <p><span className="text-white font-medium">Dinner:</span> 18:00 – 23:30</p>
              <p className="text-amber-500 pt-1">Open 7 Days a Week</p>
            </div>
          </div>
        </div>

        {/* Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-4">
          <p>© 2026 L'Étoile Dorée & Royal Pavilion. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-amber-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-amber-400">Terms of Haute Dining</Link>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
