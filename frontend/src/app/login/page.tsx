"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [redirectTo, setRedirectTo] = useState("/dashboard");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const rawRedirect = params.get("redirect");
    // Prevent open redirect vulnerabilities: only allow relative internal paths
    if (rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")) {
      setRedirectTo(rawRedirect);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Invalid email or password");
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Authentication failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen pt-16 pb-24 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-zinc-900/60 border border-amber-500/25 shadow-2xl backdrop-blur-md space-y-6"
      >
        <div className="text-center space-y-2">
          <span className="text-amber-400 font-serif tracking-[0.25em] text-xs uppercase block">
            Private Concierge Access
          </span>
          <h1 className="text-3xl font-serif font-bold text-white">VIP Member Sign In</h1>
          <p className="text-xs text-zinc-400 font-light">
            Access your private dining reservations, pre-orders, and loyalty privileges.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase font-semibold tracking-wider text-zinc-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="vip@etoiledoree.fr"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-semibold tracking-wider text-zinc-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              maxLength={72}
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-bold uppercase tracking-wider text-xs rounded hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Authenticating..." : "Sign In to VIP Portal"}
          </button>
        </form>

        <div className="pt-4 border-t border-zinc-800 text-center text-xs text-zinc-400">
          Not yet a member of L&apos;Étoile Dorée?{" "}
          <Link
            href={`/register?redirect=${encodeURIComponent(redirectTo)}`}
            className="text-amber-400 font-semibold hover:underline"
          >
            Request VIP Membership →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
