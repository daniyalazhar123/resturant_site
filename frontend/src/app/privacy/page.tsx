import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-zinc-800 pb-6 space-y-2">
          <span className="text-amber-400 font-serif tracking-[0.25em] text-xs uppercase block">
            Compliance & Data Governance
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">Privacy Policy</h1>
          <p className="text-xs text-zinc-400">
            Effective Date: November 2026 • Place Vendôme, Paris, France (GDPR / CNIL Compliant)
          </p>
        </div>

        <section className="space-y-4 text-sm text-zinc-300 font-light leading-relaxed">
          <h2 className="text-xl font-serif font-semibold text-white">1. Principles & Data Controller</h2>
          <p>
            L&apos;Étoile Dorée &amp; Royal Pavilion (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates as the Data Controller under Regulation (EU) 2016/679 (GDPR). We adhere to privacy-by-design, collecting only data strictly essential to culinary reservations, VIP concierge services, and pre-order fulfillment.
          </p>

          <h2 className="text-xl font-serif font-semibold text-white">2. Personal Data We Collect</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Identity &amp; Contact:</strong> Full name, verified email address, phone number for table and dispatch confirmation.</li>
            <li><strong>Dining Preferences &amp; Allergens:</strong> Optional dietary requirements and celebration notes provided during reservation.</li>
            <li><strong>Transaction &amp; Order History:</strong> Menu item selections, order quantities, and fulfillment status.</li>
          </ul>

          <h2 className="text-xl font-serif font-semibold text-white">3. Zero Card Data Retention (PCI-DSS SAQ-A)</h2>
          <p>
            We strictly enforce PCI-DSS SAQ-A compliance. We do not store, process, or transmit credit card numbers, CVVs, or cardholder PANs on our servers. All monetary transactions are processed via isolated, end-to-end encrypted Stripe Hosted Checkout.
          </p>

          <h2 className="text-xl font-serif font-semibold text-white">4. GDPR Data Subject Rights</h2>
          <p>
            Under GDPR Articles 15–22, you hold the right to access, rectify, export, and permanently erase your personal data. You may download your records via the VIP Member Portal or invoke real-time profile erasure using our automated account deletion endpoints.
          </p>

          <h2 className="text-xl font-serif font-semibold text-white">5. Concierge &amp; Contact</h2>
          <p>
            For data protection inquiries, reach our Data Protection Concierge at <span className="text-amber-400 font-mono">dpo@etoiledoree.fr</span> or visit our reception desk at 12 Place Vendôme, 75001 Paris, France.
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
