"use client";

import { useState } from "react";
import HeroCinematic from "@/components/HeroCinematic";
import CardStack3D, { SignatureDish } from "@/components/CardStack3D";
import MenuBook from "@/components/MenuBook";
import VideoParallaxBanner from "@/components/VideoParallaxBanner";
import TeamShowcase from "@/components/TeamShowcase";
import ServicesSection from "@/components/ServicesSection";
import DishDetailModal from "@/components/DishDetailModal";

export default function Home() {
  const [selectedDish, setSelectedDish] = useState<SignatureDish | null>(null);

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen overflow-x-hidden">
      {/* 1. Cinematic Exterior-to-Interior Hero Entrance */}
      <HeroCinematic />

      {/* 2. Interactive 3D Card Fan Stack for Signature Dishes & Chef Specials */}
      <CardStack3D onSelectDish={(dish) => setSelectedDish(dish)} />

      {/* 3. Interactive Culinary Flip-Book Menu */}
      <MenuBook />

      {/* 4. Parallax Video Scroll Showcase */}
      <VideoParallaxBanner />

      {/* 5. Young Stunning Chefs & Hospitality Masters */}
      <TeamShowcase />

      {/* 6. VIP Luxury Services */}
      <ServicesSection />

      {/* Dish Inspection Modal */}
      <DishDetailModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
    </div>
  );
}
