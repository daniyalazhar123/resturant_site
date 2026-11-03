import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import CursorSpotlight from "@/components/CursorSpotlight";
import FloatingNavPill from "@/components/FloatingNavPill";
import AIChatbotWidget from "@/components/AIChatbotWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "L'Étoile Dorée & Royal Pavilion | Haute Gastronomie Restaurant",
  description: "Experience an exquisite culinary journey celebrating haute French fine dining and royal Eastern gastronomy at Place Vendôme, Paris.",
  keywords: ["fine dining", "paris restaurant", "gastronomy", "french cuisine", "table reservation", "michelin star"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans relative selection:bg-amber-500 selection:text-zinc-950">
        <CursorSpotlight />
        <SmoothScroll>
          <Navbar />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
          <FloatingNavPill />
          <AIChatbotWidget />
        </SmoothScroll>
      </body>
    </html>
  );
}
