"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  requests: string;
}

export default function Reservation() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    requests: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const timeSlots = [
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
  ];

  const validateForm = () => {
    const tempErrors: Partial<FormData> = {};
    if (!formData.name.trim()) tempErrors.name = "Full name is required.";
    if (!formData.email.trim()) {
      tempErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address.";
    }
    if (!formData.phone.trim()) tempErrors.phone = "Phone number is required.";
    if (!formData.date) tempErrors.date = "Please select a date.";
    if (!formData.time) tempErrors.time = "Please select a time.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          guests: "2",
          requests: "",
        });
      } else if (data.errors) {
        const serverErrors: Partial<FormData> = {};
        data.errors.forEach((err: { field: string; message: string }) => {
          serverErrors[err.field as keyof FormData] = err.message;
        });
        setErrors(serverErrors);
      }
    } catch {
      setErrors({ name: "Network error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen py-16">
      {/* Header Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16 mt-8">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-amber-500 font-serif tracking-widest text-sm uppercase block"
        >
          Reserve a Table
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl sm:text-5xl font-serif font-bold text-white"
        >
          Secure Your Experience
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-zinc-500 text-sm sm:text-base max-w-xl mx-auto font-light"
        >
          Book your table in advance. For parties larger than 8, please contact our events team directly.
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="h-1 w-20 bg-amber-500 mx-auto mt-6 origin-center"
        ></motion.div>
      </div>

      {/* Form Area */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-zinc-900/40 border border-zinc-900 p-6 sm:p-10 rounded-sm shadow-2xl backdrop-blur-md"
        >
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12 space-y-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-500 text-3xl font-semibold"
                >
                  ✓
                </motion.div>
                <h2 className="text-2xl font-serif font-bold text-white">
                  Booking Request Received
                </h2>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                  Thank you for your reservation. A confirmation email has been sent. We look forward to hosting you at L'Étoile Dorée.
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="pt-6"
                >
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 text-amber-500 text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-sm hover:border-amber-500 hover:bg-zinc-950 transition-all duration-300 cursor-pointer"
                  >
                    Book Another Table
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-zinc-950 border rounded-sm text-sm focus:outline-none transition-colors ${
                        errors.name ? "border-red-500 focus:border-red-500" : "border-zinc-800 focus:border-amber-500"
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-xs text-red-500 font-light">{errors.name}</p>}
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-zinc-950 border rounded-sm text-sm focus:outline-none transition-colors ${
                        errors.email ? "border-red-500 focus:border-red-500" : "border-zinc-800 focus:border-amber-500"
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-xs text-red-500 font-light">{errors.email}</p>}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-zinc-950 border rounded-sm text-sm focus:outline-none transition-colors ${
                        errors.phone ? "border-red-500 focus:border-red-500" : "border-zinc-800 focus:border-amber-500"
                      }`}
                      placeholder="+33 6 12 34 56 78"
                    />
                    {errors.phone && <p className="text-xs text-red-500 font-light">{errors.phone}</p>}
                  </div>

                  {/* Number of Guests */}
                  <div className="space-y-2">
                    <label htmlFor="guests" className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Number of Guests
                    </label>
                    <select
                      name="guests"
                      id="guests"
                      value={formData.guests}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-sm text-sm focus:outline-none focus:border-amber-500 text-zinc-300 cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num.toString()}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Booking Date */}
                  <div className="space-y-2">
                    <label htmlFor="date" className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Select Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-zinc-950 border rounded-sm text-sm focus:outline-none text-zinc-300 transition-colors cursor-pointer ${
                        errors.date ? "border-red-500 focus:border-red-500" : "border-zinc-800 focus:border-amber-500"
                      }`}
                    />
                    {errors.date && <p className="text-xs text-red-500 font-light">{errors.date}</p>}
                  </div>

                  {/* Booking Time */}
                  <div className="space-y-2">
                    <label htmlFor="time" className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Select Time
                    </label>
                    <select
                      name="time"
                      id="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-zinc-950 border rounded-sm text-sm focus:outline-none text-zinc-300 transition-colors cursor-pointer ${
                        errors.time ? "border-red-500 focus:border-red-500" : "border-zinc-800 focus:border-amber-500"
                      }`}
                    >
                      <option value="">Choose a time slot</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    {errors.time && <p className="text-xs text-red-500 font-light">{errors.time}</p>}
                  </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-2">
                  <label htmlFor="requests" className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Special Requests / Dietary Requirements
                  </label>
                  <textarea
                    name="requests"
                    id="requests"
                    rows={4}
                    value={formData.requests}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-sm text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-700"
                    placeholder="e.g. Vegetarian diet, wheelchair accessibility, celebrating an anniversary..."
                  ></textarea>
                </div>

                {/* Submit Button with Framer scale effects */}
                <div className="pt-2">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-4 bg-amber-500 text-zinc-950 font-semibold tracking-wider uppercase rounded-sm hover:bg-amber-400 disabled:opacity-50 transition-all duration-300 shadow-lg shadow-amber-500/20 cursor-pointer text-xs sm:text-sm"
                  >
                    {isSubmitting ? "Requesting Table..." : "Request Table Reservation"}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
