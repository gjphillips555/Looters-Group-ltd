import { createFileRoute } from "@tanstack/react-router";
import { BranchShell } from "@/components/site-chrome";

export const Route = createFileRoute("/computas/policy")({ component: Policy });

function Policy() {
  return (
    <BranchShell>
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Store policy</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
          <section>
            <h2 className="font-display text-lg font-bold text-ink">Who we are</h2>
            <p className="mt-2">
              Looters Computas supplies refurbished and used computers and parts. Browse
              here; buy with PayPal on this site or complete the same listing on Trade Me.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-ink">Warranty</h2>
            <p className="mt-2">
              Unless a listing says “sold as-is”, hardware has a 90-day return-to-base
              warranty for hardware failure under normal use. Not covered: accident,
              liquid, misuse, modification, software or data loss. Buyer covers return
              freight. Rights under NZ consumer law still apply.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold text-ink">Contact</h2>
            <p className="mt-2">
              Wellington, New Zealand. Message via Trade Me on your order where possible.
              Shopfront closed — selling from home.
            </p>
          </section>
        </div>
      </main>
    </BranchShell>
  );
}
