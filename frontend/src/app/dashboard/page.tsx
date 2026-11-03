"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"reservations" | "orders" | "favorites">("reservations");

  const activeReservations = [
    {
      id: "RES-9941",
      date: "October 18, 2026",
      time: "20:00",
      guests: "4 Guests",
      table: "VIP Suite 02 (Place Vendôme View)",
      status: "Confirmed",
    },
  ];

  const pastOrders = [
    {
      id: "ED-884912",
      date: "September 28, 2026",
      items: ["Maine Lobster Thermidor (x2)", "Château Margaux 2015"],
      total: "€171.00",
      type: "Takeout Pre-Order",
    },
  ];

  const favorites = [
    {
      name: "Butter-Poached Maine Lobster Thermidor",
      price: "€68",
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Royal Mutton Dum Biryani Azafrán",
      price: "€36",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen pt-10 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl mb-12">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full border-2 border-amber-400 overflow-hidden relative shadow-lg shadow-amber-500/20 flex-shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt="VIP Guest"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif font-bold text-white">Lady Eleanor Vance</h1>
                <span className="text-[9px] uppercase tracking-wider font-semibold text-zinc-950 bg-gradient-to-r from-amber-300 to-amber-500 px-2 py-0.5 rounded font-mono">
                  Royal Gold VIP
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-light mt-1">
                Member ID: <span className="font-mono text-amber-400">#ED-VIP-2026</span> • Paris, France
              </p>
            </div>
          </div>

          <div className="flex gap-6 text-center border-t md:border-t-0 border-zinc-800 pt-4 md:pt-0 w-full md:w-auto justify-around">
            <div>
              <span className="text-2xl font-serif font-bold text-amber-400 block">1,850</span>
              <span className="text-[10px] text-zinc-500 uppercase">Haute Reward Points</span>
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-white block">12</span>
              <span className="text-[10px] text-zinc-500 uppercase">Total Visits</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 mb-8 gap-4">
          <button
            onClick={() => setActiveTab("reservations")}
            className={`pb-3 text-xs uppercase font-serif tracking-wider font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "reservations"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Active Reservations ({activeReservations.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 text-xs uppercase font-serif tracking-wider font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "orders"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Pre-Order History ({pastOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`pb-3 text-xs uppercase font-serif tracking-wider font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "favorites"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Favorite Dishes ({favorites.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "reservations" && (
          <div className="space-y-4">
            {activeReservations.map((res) => (
              <div
                key={res.id}
                className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-serif font-bold text-white">{res.table}</span>
                    <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      {res.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-light">
                    📅 {res.date} at {res.time} • 👥 {res.guests}
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Link
                    href="/reservation"
                    className="px-4 py-2 bg-zinc-950 border border-zinc-800 text-amber-400 text-xs rounded hover:border-amber-400 transition-colors text-center w-full sm:w-auto"
                  >
                    Modify Booking
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            {pastOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-xs font-mono text-amber-400">{ord.id}</span>
                  <p className="text-sm font-serif font-medium text-white">{ord.items.join(", ")}</p>
                  <p className="text-xs text-zinc-500">{ord.date} • {ord.type}</p>
                </div>
                <span className="text-amber-400 font-bold font-serif text-lg">{ord.total}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {favorites.map((fav) => (
              <div
                key={fav.name}
                className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800"
              >
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={fav.image} alt={fav.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-white text-sm">{fav.name}</h4>
                  <span className="text-amber-400 font-bold text-sm block mt-1">{fav.price}</span>
                  <Link href="/menu" className="text-[10px] text-amber-400 hover:underline mt-1 block">
                    Order Again →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
