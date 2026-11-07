"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Profile {
  id: number;
  full_name: string;
  email: string;
  role: string;
  points: number;
}

interface ReservationRow {
  reference_code: string;
  date: string;
  time: string;
  guests: number;
  table_type: string;
  status: string;
}

interface OrderRow {
  order_code: string;
  total_amount: number;
  items_summary: string;
  status: string;
  order_type: string;
  created_at: string;
}

interface FavoriteRow {
  name: string;
  price: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"reservations" | "orders" | "favorites">("reservations");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeReservations, setActiveReservations] = useState<ReservationRow[]>([]);
  const [pastOrders, setPastOrders] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  // No favorites API exists yet — intentionally empty (no mock data).
  const favorites: FavoriteRow[] = [];

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const opts: RequestInit = { credentials: "include", cache: "no-store" };
        const [meRes, resRes, ordRes] = await Promise.all([
          fetch("/api/v1/auth/me", opts),
          fetch("/api/v1/reservations/", opts),
          fetch("/api/v1/orders/", opts),
        ]);

        if (meRes.status === 401) {
          router.replace("/login?redirect=/dashboard");
          return;
        }
        if (!meRes.ok || !resRes.ok || !ordRes.ok) {
          throw new Error("Failed to load your VIP profile.");
        }

        const [me, resData, ordData] = await Promise.all([
          meRes.json(),
          resRes.json(),
          ordRes.json(),
        ]);
        if (!active) return;
        setProfile(me);
        setActiveReservations(resData.reservations || []);
        setPastOrders(ordData.orders || []);
      } catch (err) {
        if (active) {
          setLoadError(err instanceof Error ? err.message : "Failed to load your VIP profile.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [router]);

  const initials = (profile?.full_name || "VIP")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  if (isLoading) {
    return (
      <div className="bg-zinc-950 text-zinc-400 min-h-screen pt-24 text-center text-xs uppercase tracking-wider">
        Loading your VIP portal...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-zinc-950 min-h-screen pt-24 text-center space-y-4">
        <p className="text-xs text-red-300">{loadError}</p>
        <Link href="/login?redirect=/dashboard" className="text-xs text-amber-400 hover:underline">
          Sign in again →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen pt-10 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl mb-12">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full border-2 border-amber-400 overflow-hidden relative shadow-lg shadow-amber-500/20 flex-shrink-0 flex items-center justify-center bg-zinc-900 text-amber-400 font-serif text-2xl font-bold">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif font-bold text-white">{profile?.full_name}</h1>
                <span className="text-[9px] uppercase tracking-wider font-semibold text-zinc-950 bg-gradient-to-r from-amber-300 to-amber-500 px-2 py-0.5 rounded font-mono">
                  {profile?.role === "ADMIN" ? "Administrator" : "VIP Member"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-light mt-1">
                Member ID: <span className="font-mono text-amber-400">#{profile?.id}</span> • {profile?.email}
              </p>
            </div>
          </div>

          <div className="flex gap-6 text-center border-t md:border-t-0 border-zinc-800 pt-4 md:pt-0 w-full md:w-auto justify-around">
            <div>
              <span className="text-2xl font-serif font-bold text-amber-400 block">
                {(profile?.points ?? 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-zinc-500 uppercase">Haute Reward Points</span>
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-white block">{activeReservations.length}</span>
              <span className="text-[10px] text-zinc-500 uppercase">Total Reservations</span>
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
            {activeReservations.length === 0 && (
              <p className="text-xs text-zinc-500">
                No reservations yet. <Link href="/reservation" className="text-amber-400 hover:underline">Book a table →</Link>
              </p>
            )}
            {activeReservations.map((res) => (
              <div
                key={res.reference_code}
                className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-serif font-bold text-white">{res.table_type}</span>
                    <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      {res.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-light">
                    📅 {res.date} at {res.time} • 👥 {res.guests} {res.guests === 1 ? "Guest" : "Guests"} •{" "}
                    <span className="font-mono text-amber-400">{res.reference_code}</span>
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Link
                    href="/reservation"
                    className="px-4 py-2 bg-zinc-950 border border-zinc-800 text-amber-400 text-xs rounded hover:border-amber-400 transition-colors text-center w-full sm:w-auto"
                  >
                    New Booking
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            {pastOrders.length === 0 && (
              <p className="text-xs text-zinc-500">
                No pre-orders yet. <Link href="/menu" className="text-amber-400 hover:underline">Browse the menu →</Link>
              </p>
            )}
            {pastOrders.map((ord) => (
              <div
                key={ord.order_code}
                className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-xs font-mono text-amber-400">{ord.order_code}</span>
                  <p className="text-sm font-serif font-medium text-white">{ord.items_summary}</p>
                  <p className="text-xs text-zinc-500">
                    {new Date(ord.created_at).toLocaleDateString()} • {ord.order_type} • {ord.status}
                  </p>
                </div>
                <span className="text-amber-400 font-bold font-serif text-lg">€{Number(ord.total_amount).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {favorites.length === 0 && (
              <p className="text-xs text-zinc-500">
                No favorite dishes saved yet. <Link href="/menu" className="text-amber-400 hover:underline">Explore the menu →</Link>
              </p>
            )}
            {favorites.map((fav) => (
              <div
                key={fav.name}
                className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800"
              >
                <div>
                  <h4 className="font-serif font-semibold text-white text-sm">{fav.name}</h4>
                  <span className="text-amber-400 font-bold text-sm block mt-1">{fav.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
