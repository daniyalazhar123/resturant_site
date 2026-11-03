"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import CartDrawer from "./CartDrawer";
import { useCartState } from "@/lib/cartStore";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCartState();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "About", href: "/about" },
    { name: "Reservation", href: "/reservation" },
    { name: "Takeout", href: "/checkout" },
    { name: "Contact", href: "/contact" },
    { name: "VIP Portal", href: "/dashboard" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/85 backdrop-blur-md border-b border-amber-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs tracking-wider uppercase transition-colors duration-200 ${
                    isActive(link.href)
                      ? "text-amber-400 font-semibold border-b border-amber-400 pb-0.5"
                      : "text-zinc-300 hover:text-amber-400"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Action Icons & CTA */}
            <div className="hidden md:flex items-center gap-4">
              {/* Pre-Order Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-amber-400 transition-all cursor-pointer"
                aria-label="View pre-order cart"
              >
                <span className="text-base">🛒</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-zinc-950 font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Table Booking CTA */}
              <Link
                href="/reservation"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-zinc-950 text-xs font-semibold tracking-wider uppercase rounded hover:brightness-110 transition-all duration-300 shadow-md shadow-amber-500/10"
              >
                Book Table
              </Link>
            </div>

            {/* Mobile Actions & Menu Trigger */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full bg-zinc-900 text-amber-400 cursor-pointer"
              >
                <span className="text-sm">🛒</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-zinc-950 font-bold text-[9px] rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="p-2 text-zinc-400 hover:text-amber-400 focus:outline-none"
              >
                {isOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-screen opacity-100 border-b border-zinc-900 bg-zinc-950/95" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded text-sm tracking-wider uppercase transition-colors ${
                  isActive(link.href)
                    ? "bg-zinc-900 text-amber-400 font-semibold"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-amber-400"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3">
              <Link
                href="/reservation"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-3 bg-amber-500 text-zinc-950 text-xs font-semibold uppercase tracking-wider rounded"
              >
                Book Table
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Drawer Popup */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
