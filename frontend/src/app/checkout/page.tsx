"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartState } from "@/lib/cartStore";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCartState();
  const [orderType, setOrderType] = useState<"takeout" | "delivery">("takeout");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    time: "19:00",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const successParam = params.get("success");
    const canceledParam = params.get("canceled");
    const returnedOrderCode = params.get("order_code");

    if (successParam === "true" && returnedOrderCode) {
      setOrderId(returnedOrderCode);
      setIsSuccess(true);
      clearCart();
    } else if (canceledParam === "true") {
      setErrorMessage(
        "Stripe payment was canceled. You can review your order below and try again whenever you are ready."
      );
    }
  }, [clearCart]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        order_type: orderType === "takeout" ? "Takeout" : "Delivery",
        items: cart.map((item) => ({
          item_id: item.id,
          quantity: item.quantity,
        })),
      };
      const res = await fetch("/api/v1/orders/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.message || "Failed to initialize checkout");
      }

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }

      setOrderId(data.order_code);
      setIsSuccess(true);
      clearCart();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred during checkout."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen pt-10 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="text-center space-y-3 mb-12">
          <span className="text-amber-400 font-serif tracking-[0.25em] text-xs uppercase block font-medium">
            Gourmet Takeout & Pre-Orders
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white">
            Pre-Order Checkout
          </h1>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto font-light">
            Order fresh haute cuisine prepared by our master chefs for luxury pickup or white-glove delivery.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700 mx-auto mt-4" />
        </div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto p-10 rounded-2xl bg-zinc-900/60 border border-amber-500/30 text-center space-y-6 shadow-2xl backdrop-blur-md"
            >
              <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto text-amber-400 text-4xl">
                ✓
              </div>
              <h2 className="text-3xl font-serif font-bold text-white">
                Pre-Order Confirmed!
              </h2>
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono">
                Order ID: <span className="text-amber-400 font-bold">{orderId}</span>
              </div>
              <p className="text-zinc-300 text-sm font-light leading-relaxed max-w-md mx-auto">
                Thank you for your order. A receipt and real-time tracking link have been sent to your email.
              </p>
              <div className="pt-4 flex items-center justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="px-6 py-3 bg-amber-500 text-zinc-950 font-semibold text-xs uppercase tracking-wider rounded hover:bg-amber-400 transition-colors"
                >
                  Track in VIP Dashboard
                </Link>
                <Link
                  href="/menu"
                  className="px-6 py-3 border border-zinc-700 text-zinc-300 font-semibold text-xs uppercase tracking-wider rounded hover:border-amber-400 transition-colors"
                >
                  Browse Menu Again
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Form & Payment */}
              <div className="lg:col-span-7 space-y-8">
                {/* Pickup vs Delivery Toggle */}
                <div className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType("takeout")}
                    className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer ${
                      orderType === "takeout"
                        ? "bg-amber-500 text-zinc-950 shadow"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    🛍️ Luxury Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType("delivery")}
                    className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer ${
                      orderType === "delivery"
                        ? "bg-amber-500 text-zinc-950 shadow"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    🚗 White-Glove Delivery
                  </button>
                </div>

                <form onSubmit={handleCheckout} className="space-y-6">
                  {/* Guest Contact */}
                  <div className="space-y-4 p-6 rounded-xl bg-zinc-900/40 border border-zinc-800">
                    <h3 className="text-base font-serif font-bold text-amber-400">
                      1. Contact Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-zinc-400 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Lord Alexander Vance"
                          className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-zinc-400 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="alexander@domain.com"
                          className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase font-semibold text-zinc-400 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+33 6 12 34 56 78"
                          className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PCI-DSS SAQ-A Hosted Stripe Checkout Notice */}
                  <div className="space-y-3 p-6 rounded-xl bg-zinc-900/40 border border-amber-500/30">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-serif font-bold text-amber-400">
                        2. Secure Stripe Hosted Payment (PCI-DSS SAQ-A)
                      </h3>
                      <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold">
                        256-Bit TLS Encrypted
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 font-light leading-relaxed">
                      For your security and strict PCI-DSS compliance, L&apos;Étoile Dorée never collects or stores raw credit card numbers on our servers. Clicking the button below will redirect you to our official <strong>Stripe Hosted Checkout</strong> page to complete your payment securely.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-4 rounded-lg bg-red-950/50 border border-red-500/40 text-xs text-red-200">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || cart.length === 0}
                    className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-bold uppercase tracking-wider text-xs rounded hover:brightness-110 transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "Redirecting to Stripe Checkout..." : `Proceed to Secure Stripe Checkout (€${totalPrice.toFixed(2)})`}
                  </button>
                </form>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 rounded-xl bg-zinc-900/60 border border-amber-500/20 backdrop-blur-md space-y-6">
                  <h3 className="text-xl font-serif font-bold text-white border-b border-zinc-800 pb-3">
                    Order Summary
                  </h3>

                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-xs text-zinc-400">Your pre-order cart is empty.</p>
                      <Link href="/menu" className="text-xs text-amber-400 hover:underline mt-2 inline-block">
                        Go to Menu →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 border border-zinc-800">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                            <div>
                              <h4 className="font-serif font-medium text-white">{item.name}</h4>
                              <span className="text-[10px] text-zinc-500 font-mono">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>
                          <span className="font-serif font-bold text-amber-400">
                            €{(item.priceNumber * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-zinc-800 pt-4 space-y-2 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Subtotal</span>
                      <span>€{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>White-Glove Packaging</span>
                      <span className="text-amber-400">Complimentary</span>
                    </div>
                    <div className="flex justify-between text-white font-bold font-serif text-base border-t border-zinc-800 pt-3">
                      <span>Total Due</span>
                      <span className="text-amber-400">€{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
