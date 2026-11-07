import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-zinc-800 pb-6 space-y-2">
          <span className="text-amber-400 font-serif tracking-[0.25em] text-xs uppercase block">
            House Etiquette &amp; Governance
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">Terms of Haute Dining</h1>
          <p className="text-xs text-zinc-400">
            Applicable to L&apos;Étoile Dorée &amp; Royal Pavilion • Place Vendôme, Paris
          </p>
        </div>

        <section className="space-y-4 text-sm text-zinc-300 font-light leading-relaxed">
          <h2 className="text-xl font-serif font-semibold text-white">1. Reservation &amp; Table Holding Policy</h2>
          <p>
            Table bookings are held for a maximum of twenty (20) minutes past the confirmed seating hour. If you anticipate a delay, please alert the Maître d&apos; via our concierge hotline. VIP Suites require advance notice for special culinary requests.
          </p>

          <h2 className="text-xl font-serif font-semibold text-white">2. Pre-Order &amp; Takeout Fulfillment</h2>
          <p>
            All haute takeout orders are prepared freshly at the scheduled kitchen dispatch window. Re-orders or schedule alterations must be requested at least 45 minutes prior to the designated preparation time.
          </p>

          <h2 className="text-xl font-serif font-semibold text-white">3. Allergen &amp; Dietary Transparency</h2>
          <p>
            In strict compliance with EU Regulation 1169/2011, allergen indicators and preparation practices are disclosed across our catalogs. Guests are warmly encouraged to report any acute dietary sensitivities prior to course seating.
          </p>

          <h2 className="text-xl font-serif font-semibold text-white">4. Dress Code &amp; Ambiance</h2>
          <p>
            L&apos;Étoile Dorée observes elegant evening attire in the Main Dining Hall and VIP Salon. Athletic wear, beachwear, and footwear without backings are respectfully restricted.
          </p>

          <h2 className="text-xl font-serif font-semibold text-white">5. Governing Law</h2>
          <p>
            These terms are governed in accordance with French law and Paris commercial jurisdiction.
          </p>
        </section>

        <div className="pt-6 border-t border-zinc-900">
          <Link href="/" className="text-xs text-amber-400 hover:underline">
            ← Return to Haute Dining Home
          </Link>
        </div>
      </div>
    </div>
  );
}
