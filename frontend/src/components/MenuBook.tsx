"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCartState } from "@/lib/cartStore";

interface DishItem {
  id: string;
  name: string;
  nativeName?: string;
  description: string;
  price: string;
  image: string;
  tag: string;
}

interface CuisinePage {
  cuisine: string;
  subtitle: string;
  flagEmoji: string;
  dishes: DishItem[];
}

export default function MenuBook() {
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
const { addToCart } = useCartState();

  const bookPages: CuisinePage[] = [
    {
      cuisine: "Pakistani Royal Cuisine",
      subtitle: "Traditional Clay Pot & Live Charcoal Delicacies",
      flagEmoji: "🇵🇰",
      dishes: [
        {
          id: "pk-1",
          name: "Royal Mutton Dum Biryani",
          nativeName: "شاہی مٹن بریانی",
          description: "Aged Basmati rice layered with tender goat meat, saffron, kewra water, and caramelized onions, sealed with dough and dum-cooked.",
          price: "€36",
          image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
          tag: "Chef's Special",
        },
        {
          id: "pk-2",
          name: "Peshawari Lamb Karahi",
          nativeName: "پشاوری مٹن کڑاہی",
          description: "Freshly cut lamb cooked in a heavy iron wok with organic vine tomatoes, green chilies, ginger julienne, and black pepper.",
          price: "€42",
          image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
          tag: "Signature",
        },
        {
          id: "pk-3",
          name: "Mughlai Charcoal Seekh Kebabs",
          nativeName: "سیخ کباب",
          description: "Hand-minced prime beef infused with green cardamom, fresh herbs, and ghee, grilled over open glowing coals.",
          price: "€28",
          image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
          tag: "Charcoal Grill",
        },
        {
          id: "pk-4",
          name: "Shahi Nalli Nihari",
          nativeName: "شاہی نلی نہاری",
          description: "Slow-simmered shank stew infused with 32 artisanal spices, rich marrow bone gravy, served with piping hot Roghani Naan.",
          price: "€38",
          image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=600&q=80",
          tag: "Heritage",
        },
      ],
    },
    {
      cuisine: "Indian Imperial Feasts",
      subtitle: "Rich Mughlai & Azafrán Spiced Curries",
      flagEmoji: "🇮🇳",
      dishes: [
        {
          id: "in-1",
          name: "Mughlai Butter Chicken",
          nativeName: "مکھنی مرغ",
          description: "Tandoor-roasted chicken tikka simmered in a velvety San Marzano tomato butter sauce, laced with dried fenugreek leaves.",
          price: "€32",
          image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80",
          tag: "Classic Favorite",
        },
        {
          id: "in-2",
          name: "Dal Makhani Azafrán",
          nativeName: "دال مکھنی",
          description: "Black lentils and kidney beans slow-cooked overnight for 24 hours on clay tandoor, finished with French churned butter.",
          price: "€24",
          image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
          tag: "Vegetarian Gold",
        },
        {
          id: "in-3",
          name: "Paneer Tikka Kesari",
          nativeName: "پنیر ٹکہ",
          description: "Artisanal cottage cheese marinated in hung curd, yellow saffron, mustard oil, and bell peppers, seared in tandoor oven.",
          price: "€26",
          image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80",
          tag: "Tandoori Special",
        },
      ],
    },
    {
      cuisine: "Chinese & Asian Mastery",
      subtitle: "Imperial Peking Duck & Crystal Dim Sum",
      flagEmoji: "🇨🇳",
      dishes: [
        {
          id: "cn-1",
          name: "Imperial Peking Roast Duck",
          nativeName: "北京烤鸭",
          description: "Crispy skin roasted duck carved table-side, served with hand-rolled steamed pancakes, cucumber, scallions, and hoisin reduction.",
          price: "€58",
          image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
          tag: "Imperial Feast",
        },
        {
          id: "cn-2",
          name: "Truffle Crystal Dim Sum",
          nativeName: "松露水晶饺",
          description: "Steamed translucent dumplings filled with wild forest mushrooms, tiger prawns, and shaved black winter truffle.",
          price: "€34",
          image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80",
          tag: "Dim Sum Delicacy",
        },
        {
          id: "cn-3",
          name: "Sichuan Sizzling Tenderloin",
          nativeName: "铁板四川牛柳",
          description: "Prime Angus beef tenderloin wok-tossed with red lantern chilies, Sichuan peppercorns, garlic shoots, and sesame oil.",
          price: "€44",
          image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
          tag: "Spicy Sensation",
        },
      ],
    },
    {
      cuisine: "Thai Exotic Delights",
      subtitle: "Aromatic Herbs, Lemongrass & Coconut Infusions",
      flagEmoji: "🇹🇭",
      dishes: [
        {
          id: "th-1",
          name: "Royal Tom Yum Goong",
          nativeName: "ต้มยำกุ้ง",
          description: "Hot & sour galangal broth with giant river prawns, wild kaffir lime leaves, lemongrass, and straw mushrooms.",
          price: "€29",
          image: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=600&q=80",
          tag: "Aromatic Soup",
        },
        {
          id: "th-2",
          name: "Emerald Thai Green Curry",
          nativeName: "แกงเขียวหวาน",
          description: "Organic chicken breast cooked in fresh green chili paste, coconut milk, Thai eggplant, and sweet basil leaves.",
          price: "€36",
          image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=600&q=80",
          tag: "Curry Perfection",
        },
      ],
    },
    {
      cuisine: "Ocean & Seafood Treasures",
      subtitle: "Wild-Caught Catch Poached & Grilled to Perfection",
      flagEmoji: "🦞",
      dishes: [
        {
          id: "sf-1",
          name: "Butter-Poached Lobster Thermidor",
          nativeName: "Homard Thermidor",
          description: "Fresh Maine lobster meat flambéed with Cognac, baked in its shell with Gruyère cheese, cream, and Dijon mustard.",
          price: "€68",
          image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
          tag: "Luxurious Catch",
        },
        {
          id: "sf-2",
          name: "Pan-Seared Chilean Seabass",
          nativeName: "Loup de Mer",
          description: "Wild Chilean Seabass with herb crust, swimming in lemon-saffron reduction, served with microgreens.",
          price: "€49",
          image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
          tag: "Wild Catch",
        },
      ],
    },
    {
      cuisine: "Grand Desserts & Elixirs",
      subtitle: "Royal Sweet Delights & Saffron Teas",
      flagEmoji: "🍨",
      dishes: [
        {
          id: "ds-1",
          name: "Gold Leaf Shahi Tukda",
          nativeName: "شاہی ٹکڑا",
          description: "Saffron brioche soaked in cardamom rabri, topped with pistachios, silver leaf, and 24-karat edible gold flake.",
          price: "€20",
          image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80",
          tag: "Royal Sweet",
        },
        {
          id: "ds-2",
          name: "Tahitian Vanilla Crème Brûlée",
          nativeName: "Crème Brûlée",
          description: "Rich vanilla bean custard with a shattered caramelized sugar crust, served with fresh raspberries.",
          price: "€16",
          image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
          tag: "French Classic",
        },
      ],
    },
  ];

  const currentPage = bookPages[activePageIndex];

  const nextPage = () => {
    setActivePageIndex((prev) => (prev + 1) % bookPages.length);
  };

  const prevPage = () => {
    setActivePageIndex((prev) => (prev - 1 + bookPages.length) % bookPages.length);
  };

  return (
    <section className="py-20 bg-zinc-950 text-zinc-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-12">
          <span className="text-amber-400 font-serif tracking-[0.25em] text-xs uppercase block font-medium">
            Interactive Culinary Catalog
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            The Royal Menu Book
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto font-light">
            Flip through our hand-bound digital book to explore authentic Pakistani, Indian, Chinese, Thai & Seafood masterpieces.
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700 mx-auto mt-4" />
        </div>

        {/* Cuisine Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {bookPages.map((pg, idx) => (
            <button
              key={pg.cuisine}
              onClick={() => setActivePageIndex(idx)}
              className={`px-4 py-2 text-xs sm:text-sm font-serif tracking-wider rounded-full border transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                activePageIndex === idx
                  ? "bg-gradient-to-r from-amber-400 to-amber-600 text-zinc-950 border-amber-400 font-semibold shadow-lg shadow-amber-500/20"
                  : "border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-zinc-700"
              }`}
            >
              <span>{pg.flagEmoji}</span>
              <span>{pg.cuisine}</span>
            </button>
          ))}
        </div>

        {/* The Leather-Bound Book Container */}
        <div className="relative max-w-5xl mx-auto rounded-xl p-1 sm:p-3 bg-gradient-to-br from-amber-200 via-amber-600 to-amber-900 shadow-2xl shadow-amber-500/10">
          {/* Inner Book Cover / Spine */}
          <div className="relative bg-zinc-900 border border-amber-500/30 rounded-lg p-6 sm:p-10 min-h-[550px] flex flex-col justify-between overflow-hidden">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.05),transparent)] pointer-events-none" />

            {/* Page Header */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage.cuisine}
                initial={{ opacity: 0, rotateY: -15, x: 20 }}
                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                exit={{ opacity: 0, rotateY: 15, x: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Book Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-500/20 pb-4 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currentPage.flagEmoji}</span>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">
                        {currentPage.cuisine}
                      </h3>
                      <p className="text-zinc-400 text-xs font-light italic">
                        {currentPage.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-amber-500/80 tracking-wider">
                    PAGE {activePageIndex + 1} OF {bookPages.length}
                  </div>
                </div>

                {/* Dishes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {currentPage.dishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="group flex gap-4 p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-amber-500/40 transition-all duration-300"
                    >
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-md overflow-hidden border border-zinc-800">
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          fill
                          sizes="112px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-grow flex flex-col justify-between space-y-1">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-base sm:text-lg font-serif font-semibold text-white group-hover:text-amber-400 transition-colors">
                                {dish.name}
                              </h4>
                              {dish.nativeName && (
                                <span className="text-xs text-amber-500/80 font-serif block">
                                  {dish.nativeName}
                                </span>
                              )}
                            </div>
                            <span className="text-amber-400 font-bold text-base font-serif">
                              {dish.price}
                            </span>
<button
  onClick={() =>
    addToCart({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      priceNumber: parseFloat(dish.price.replace(/[^0-9.]/g, "")),
      image: dish.image,
      category: currentPage.cuisine,
      quantity: 1,
    })
  }
  className="ml-2 px-2 py-1 bg-amber-500 text-zinc-950 text-xs font-semibold rounded hover:bg-amber-400 transition"
>
  Add to Cart
</button>
  }
  className="ml-2 px-2 py-1 bg-amber-500 text-zinc-950 text-xs font-semibold rounded hover:bg-amber-400 transition"
>
  Add to Cart
</button>
                          </div>
                          <p className="text-zinc-400 text-xs font-light leading-relaxed mt-1 line-clamp-2">
                            {dish.description}
                          </p>
                        </div>
                        <div>
                          <span className="inline-block text-[9px] uppercase font-semibold text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                            {dish.tag}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Page Navigation Controls */}
            <div className="flex items-center justify-between border-t border-amber-500/20 pt-6 mt-8">
              <button
                onClick={prevPage}
                className="px-5 py-2.5 bg-zinc-950 border border-amber-500/40 text-amber-400 text-xs font-semibold tracking-wider uppercase rounded hover:bg-amber-500 hover:text-zinc-950 transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                ← Previous Page
              </button>
              <div className="hidden sm:flex gap-1.5">
                {bookPages.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      activePageIndex === i ? "bg-amber-400 w-6" : "bg-zinc-700"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextPage}
                className="px-5 py-2.5 bg-amber-500 text-zinc-950 text-xs font-semibold tracking-wider uppercase rounded hover:bg-amber-400 transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                Next Page →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
