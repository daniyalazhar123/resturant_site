"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartState } from "@/lib/cartStore";

const ALL_DISHES_DATABASE: Record<string, {
  id: string;
  name: string;
  nativeName?: string;
  description: string;
  price: string;
  priceNumber: number;
  category: string;
  image: string;
  rating: string;
  pairing: string;
  ingredients: string[];
}> = {
  "sig-1": {
    id: "sig-1",
    name: "Maine Lobster Thermidor",
    nativeName: "Homard Thermidor",
    description: "Succulent Maine lobster flambéed with Cognac, baked in shell with Gruyère, heavy cream, and Dijon mustard.",
    price: "€68",
    priceNumber: 68,
    category: "Seafood",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80",
    rating: "★ 4.9 (128 reviews)",
    pairing: "Dom Pérignon Brut Vintage 2015",
    ingredients: ["Maine Lobster", "Cognac Flambé", "Gruyère AOP", "French Dijon", "Tarragon Butter"],
  },
  "sig-2": {
    id: "sig-2",
    name: "Truffle Butter Filet Mignon",
    nativeName: "Filet au Beurre de Truffe",
    description: "28-day dry-aged tenderloin seared over open coals, infused with black winter truffle butter.",
    price: "€58",
    priceNumber: 58,
    category: "Grill",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    rating: "★ 5.0 (210 reviews)",
    pairing: "Château Margaux Premier Grand Cru",
    ingredients: ["Prime Angus Beef", "Perigord Black Truffle", "Wood-Smoked Garlic", "Maldon Sea Salt"],
  },
  "pk-1": {
    id: "pk-1",
    name: "Royal Mutton Dum Biryani",
    nativeName: "شاہی مٹن بریانی",
    description: "Aged Basmati rice slow-cooked in clay pot with goat meat, saffron, kewra water, and caramelized onions.",
    price: "€36",
    priceNumber: 36,
    category: "Pakistani Royal",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80",
    rating: "★ 4.9 (185 reviews)",
    pairing: "Saffron Rose Cardamom Elixir",
    ingredients: ["Aged Basmati Rice", "Prime Goat Shank", "Kashmiri Saffron", "Shahi Kewra", "Pure Desi Ghee"],
  },
};

export default function DishDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dish = ALL_DISHES_DATABASE[id] || ALL_DISHES_DATABASE["sig-1"];
  const { addToCart } = useCartState();

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen pt-12 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/menu" className="text-xs text-amber-400 hover:underline uppercase font-serif tracking-wider mb-8 block">
          ← Back to Culinary Menu
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image */}
          <div className="lg:col-span-6 relative h-[450px] rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl">
            <Image src={dish.image} alt={dish.name} fill className="object-cover" />
          </div>

          {/* Details */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs uppercase font-serif tracking-[0.25em] text-amber-400 font-semibold block">
                {dish.category}
              </span>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mt-1">
                {dish.name}
              </h1>
              {dish.nativeName && (
                <span className="text-base text-amber-500/80 font-serif block mt-1">
                  {dish.nativeName}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between border-y border-zinc-800 py-4">
              <span className="text-amber-400 font-bold font-serif text-3xl">{dish.price}</span>
              <span className="text-xs text-zinc-300 font-mono bg-zinc-900 px-3 py-1 rounded border border-zinc-800">
                {dish.rating}
              </span>
            </div>

            <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed">
              {dish.description}
            </p>

            {/* Ingredients */}
            <div className="space-y-2">
              <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
                Key Artisanal Ingredients
              </h4>
              <div className="flex flex-wrap gap-2">
                {dish.ingredients.map((ing) => (
                  <span key={ing} className="text-xs text-amber-300 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Pairing Note */}
            <div className="p-4 rounded-lg bg-zinc-900/80 border border-amber-500/20 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-amber-400 tracking-wider block">
                Sommelier Pairing Note
              </span>
              <p className="text-xs text-zinc-300 font-serif italic">🥂 {dish.pairing}</p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() =>
                  addToCart({
                    id: dish.id,
                    name: dish.name,
                    price: dish.price,
                    priceNumber: dish.priceNumber,
                    image: dish.image,
                    category: dish.category,
                  })
                }
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-semibold uppercase tracking-wider text-xs rounded hover:brightness-110 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Add to Pre-Order ({dish.price})
              </button>
              <Link
                href="/reservation"
                className="w-full sm:w-auto px-8 py-4 border border-zinc-700 text-zinc-300 hover:text-amber-400 text-center font-semibold uppercase tracking-wider text-xs rounded"
              >
                Reserve Table to Taste
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
