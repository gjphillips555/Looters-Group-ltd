import { createFileRoute } from "@tanstack/react-router";
import { BranchShell } from "@/components/site-chrome";

export const Route = createFileRoute("/computas/policy")({ component: Policy });

function Policy() {
  return (
    <BranchShell branch="computas">
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-computas">
          Computas
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold">Store policy</h1>
        <div className="prose-sm mt-8 space-y-6 text-sm leading-relaxed text-ink/90">
          <section>
            <h2 className="font-display text-lg font-bold">1. Who we are</h2>
            <p className="mt-2 text-muted">
              Looters Computas Store supplies refurbished and used computing equipment
              and related parts. Product information on this website is for browsing.
              Purchases are completed on Trade Me through Buy Now for the relevant
              listing, so stock cannot be sold twice.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold">2. Product descriptions</h2>
            <p className="mt-2 text-muted">
              We take care to describe items accurately, including known faults where
              relevant. Specifications may vary slightly on refurbished units. If a
              detail is critical, confirm on the Trade Me listing or contact us before
              buying.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold">3. Pricing and payment</h2>
            <p className="mt-2 text-muted">
              Prices are as shown on the live Trade Me listing at the time of purchase.
              Payment and shipping arrangements are those offered on Trade Me for that
              listing. Afterpay is accepted in store.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold">4. Warranty — return to base</h2>
            <p className="mt-2 text-muted">
              Unless a listing clearly states otherwise (for example “sold as-is”),
              hardware sold by us is covered by a 90-day return-to-base warranty against
              hardware failure arising under normal use. It does not cover accidental
              damage, liquid, misuse, unauthorised modification, software, data loss or
              consumables. Claims require return for inspection; the buyer covers return
              shipping. We may repair, replace or refund at our discretion. This is in
              addition to non-excludable rights under New Zealand law, including the
              Consumer Guarantees Act 1993 where it applies.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold">5. Returns outside warranty</h2>
            <p className="mt-2 text-muted">
              Change-of-mind returns are not offered as a standard policy. If an item is
              not as described in a material way, contact us promptly with your Trade Me
              order details.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold">6. Contact</h2>
            <p className="mt-2 text-muted">
              6 Ruru Avenue, Kilbirnie, Wellington 6022. Use Trade Me messaging on your
              purchase where possible. Last updated August 2026 · Looters Computas Store.
            </p>
          </section>
        </div>
      </main>
    </BranchShell>
  );
}
