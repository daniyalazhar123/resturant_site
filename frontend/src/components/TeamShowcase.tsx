"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface TeamMember {
  name: string;
  role: string;
  category: string;
  bio: string;
  specialty: string;
  image: string;
}

export default function TeamShowcase() {
  const team: TeamMember[] = [
    {
      name: "Chef Aria Montclair",
      role: "Executive Chef & Culinary Director",
      category: "French Gastronomy",
      bio: "A young prodigy trained in Paris & Tokyo, Aria leads our culinary vision with daring innovation, fusing classical French techniques with royal Eastern flavors.",
      specialty: "Modern Fusion & Fine Plating",
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Chef Zayn Al-Mansoor",
      role: "Master Grill & Clay Pot Artisan",
      category: "Charcoal & Wok",
      bio: "Mastering live wood-fire charcoal cooking and traditional Dum Pukht techniques, Zayn brings authentic royal Mughlai and Karahi flavors to life.",
      specialty: "Dum Biryani & Charcoal Kebabs",
      image: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Chef Mahnoor Khan",
      role: "Head of Pakistani Royal Cuisine",
      category: "Pakistani Culinary Art",
      bio: "Hailing from Lahore, Mahnoor specializes in heritage royal recipes, slow-cooked Nihari, Peshawari Lamb Karahi, and saffron-infused Mughlai dishes.",
      specialty: "Shahi Karahi & Nihari Dum",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Chef Zara Shah",
      role: "Executive Pastry & Mithai Specialist",
      category: "Royal Desserts",
      bio: "Blending Pakistani saffron rabri and gold leaf Shahi Tukda with classical French pastry, Zara creates breathtaking sensory sweet art.",
      specialty: "Gold Shahi Tukda & Crème Brûlée",
      image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Chef Mei-Ling Zhang",
      role: "Head of Asian & Dim Sum Mastery",
      category: "Asian Imperial",
      bio: "Treating crystal dim sum and flame-seared woks as fine art, Mei-Ling brings vibrant Thai and Sichuan taste profiles to the pavilion.",
      specialty: "Peking Duck & Truffle Dim Sum",
      image: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Elena Rostova",
      role: "Head Sommelier & Mixologist",
      category: "Prestige Drinks",
      bio: "Curating our 600-bottle vintage wine cellar, Elena designs bespoke wine pairings and gold-infused botanical mocktails for every course.",
      specialty: "Prestige Vintage & Craft Elixirs",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <section className="py-24 bg-zinc-950 text-zinc-100 overflow-hidden border-t border-zinc-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <span className="text-amber-400 font-serif tracking-[0.25em] text-xs uppercase block font-medium">
            Young Culinary Prodigies & Master Staff
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            Meet Our World-Class Culinary Team
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto font-light">
            A passionate, stunning team of Pakistani & international master chefs, sommeliers, and floor directors.
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700 mx-auto mt-4" />
        </div>

        {/* Team Grid (6 Stunning Members) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group flex flex-col items-center text-center p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-amber-500/50 transition-all duration-300 shadow-xl"
            >
              {/* Image Circle with Animated Gold Border */}
              <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-amber-200 via-amber-500 to-amber-800 mb-5 group-hover:scale-105 transition-transform duration-500 shadow-lg shadow-amber-500/20">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-zinc-950">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="176px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Bio & Details */}
              <div className="space-y-2 flex-grow flex flex-col justify-between w-full">
                <div>
                  <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-400 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-amber-400/90 text-xs font-serif font-medium tracking-wider uppercase mt-0.5">
                    {member.role}
                  </p>
                  <p className="text-zinc-400 text-xs font-light leading-relaxed mt-3">
                    {member.bio}
                  </p>
                </div>
                <div className="pt-4">
                  <span className="inline-block text-[10px] uppercase tracking-wider font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                    {member.specialty}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
