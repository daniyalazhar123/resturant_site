"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCartState } from "@/lib/cartStore";

export interface SignatureDish {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: string;
  priceNumber: number;
  category: string;
  image: string;
  rating: string;
  pairing: string;
  badge: string;
}

export default function CardStack3D({
  onSelectDish,
}: {
  onSelectDish?: (dish: SignatureDish) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { addToCart } = useCartState();

  const dishes: SignatureDish[] = [
    {
      id: "sf-1",
      name: "Butter-Poached Lobster Thermidor",
      subtitle: "Haute French Seafood Craft",
      description: "Succulent Maine lobster flambéed with aged Cognac, baked in shell with Gruyère, heavy cream, and Dijon emulsion.",
      price: "€68",
      priceNumber: 68,
      category: "Ocean & Seafood Treasures",
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
      rating: "★ 4.9 (128 reviews)",
      pairing: "Dom Pérignon Brut Vintage 2015",
      badge: "Chef's 3-Star Special",
    },
    {
      id: "cn-3",
      name: "Sichuan Sizzling Tenderloin",
      subtitle: "Prime Wok-Seared Angus Cut",
      description: "Prime Angus beef tenderloin wok-tossed with red lantern chilies, Sichuan peppercorns, garlic shoots, and sesame oil.",
      price: "€44",
      priceNumber: 44,
      category: "Chinese & Asian Mastery",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      rating: "★ 5.0 (210 reviews)",
      pairing: "Château Margaux Premier Grand Cru",
      badge: "Signature Charcoal Cut",
    },
    {
      id: "pk-1",
      name: "Royal Mutton Dum Biryani",
      subtitle: "Shahi Mughlai Heritage",
      description: "Aged Basmati rice slow-cooked in sealed clay pot with tender goat meat, saffron, kewra water, and fried shallots.",
      price: "€36",
      priceNumber: 36,
      category: "Pakistani Royal Cuisine",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
      rating: "★ 4.9 (185 reviews)",
      pairing: "Gold Leaf Saffron Rose Elixir",
      badge: "Royal Dum Special",
    },
    {
      id: "cn-1",
      name: "Imperial Peking Roast Duck",
      subtitle: "Asian Heritage Feasts",
      description: "Crispy skin roasted duck carved table-side, served with hand-rolled steamed pancakes, cucumber, and hoisin glaze.",
      price: "€58",
      priceNumber: 58,
      category: "Chinese & Asian Mastery",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      rating: "★ 4.8 (95 reviews)",
      pairing: "Dragon Pearl Jasmine Tea",
      badge: "Imperial Feast",
    },
    {
      id: "ds-1",
      name: "Gold Leaf Shahi Tukda",
      subtitle: "Royal Sweet Masterpiece",
      description: "Saffron brioche soaked in cardamom rabri, layered with pistachios, silver leaf, and 24-karat edible gold flake.",
      price: "€20",
      priceNumber: 20,
      category: "Grand Desserts & Elixirs",
      image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
      rating: "★ 4.9 (140 reviews)",
      pairing: "Kashmiri Kahwa Tea",
      badge: "24K Gold Sweet",
    },
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % dishes.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + dishes.length) % dishes.length);
  };

  const currentDish = dishes[activeIndex];

  return (
    <section className="py-24 bg-zinc-950 text-zinc-100 overflow-hidden border-t border-amber-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-16">
          <span className="text-amber-400 font-serif tracking-[0.25em] text-xs uppercase block font-medium">
            Interactive 3D Showcase
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            Signature Dishes & Chef Specials
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto font-light">
            Swipe or click through our 3D culinary card stack showcasing our most celebrated creations.
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700 mx-auto mt-4" />
        </div>

        {/* 3D Stack Deck Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Interactive 3D Stack Cards */}
          <div className="lg:col-span-6 relative h-[420px] sm:h-[480px] flex items-center justify-center perspective-1000">
            {dishes.map((dish, index) => {
              const offset = (index - activeIndex + dishes.length) % dishes.length;
              const isFront = offset === 0;

              return (
                <motion.div
                  key={dish.id}
                  onClick={() => setActiveIndex(index)}
                  initial={false}
                  animate={{
                    scale: 1 - offset * 0.08,
                    y: offset * 25,
                    rotateZ: offset * -4,
                    zIndex: dishes.length - offset,
                    opacity: offset > 3 ? 0 : 1 - offset * 0.25,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                  className={`absolute w-[290px] sm:w-[360px] h-[380px] sm:h-[430px] rounded-2xl overflow-hidden cursor-pointer shadow-2xl border ${
                    isFront
                      ? "border-amber-400 shadow-amber-500/20"
                      : "border-zinc-800 bg-zinc-900/90"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      sizes="360px"
                      className="object-cover brightness-[0.75]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                    {/* Card Top Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-zinc-950/80 backdrop-blur-md border border-amber-500/30 px-3 py-1 rounded-full">
                        {dish.badge}
                      </span>
                    </div>

                    {/* Card Bottom Content */}
                    <div className="absolute bottom-6 left-6 right-6 space-y-2">
                      <span className="text-xs font-serif text-amber-400 block font-semibold">
                        {dish.category}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
                        {dish.name}
                      </h3>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-amber-400 font-bold font-serif text-xl">
                          {dish.price}
                        </span>
                        <span className="text-[11px] text-zinc-300 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">
                          {dish.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Detailed Card Info & Order Trigger */}
          <div className="lg:col-span-6 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDish.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 p-8 rounded-2xl bg-zinc-900/40 border border-amber-500/20 backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-serif tracking-[0.2em] text-amber-400">
                    {currentDish.subtitle}
                  </span>
                  <span className="text-amber-400 text-xs font-mono">{currentDish.rating}</span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
                  {currentDish.name}
                </h3>

                <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed">
                  {currentDish.description}
                </p>

                <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-amber-500 tracking-wider block">
                    Sommelier Pairing Note
                  </span>
                  <p className="text-xs text-zinc-300 font-serif italic">
                    🥂 {currentDish.pairing}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={() =>
                      addToCart({
                        id: currentDish.id,
                        name: currentDish.name,
                        price: currentDish.price,
                        priceNumber: currentDish.priceNumber,
                        image: currentDish.image,
                        category: currentDish.category,
                      })
                    }
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-semibold tracking-wider uppercase text-xs rounded hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    Pre-Order Dish ({currentDish.price})
                  </button>

                  {onSelectDish && (
                    <button
                      onClick={() => onSelectDish(currentDish)}
                      className="w-full sm:w-auto px-6 py-3.5 border border-zinc-700 hover:border-amber-400 text-zinc-300 hover:text-amber-400 font-semibold tracking-wider uppercase text-xs rounded transition-colors cursor-pointer"
                    >
                      View Full Recipe Info
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Stack Deck Navigation Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrev}
                className="px-5 py-2 bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-amber-400 text-xs uppercase font-semibold rounded transition-colors cursor-pointer"
              >
                ← Prev Dish
              </button>
              <div className="flex gap-2">
                {dishes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      activeIndex === i ? "bg-amber-400 w-8" : "bg-zinc-800"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className="px-5 py-2 bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-amber-400 text-xs uppercase font-semibold rounded transition-colors cursor-pointer"
              >
                Next Dish →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
