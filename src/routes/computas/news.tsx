import { createFileRoute } from "@tanstack/react-router";
import { BranchShell } from "@/components/site-chrome";
import { NEWS } from "@/data/catalog";

export const Route = createFileRoute("/computas/news")({ component: News });

function News() {
  return (
    <BranchShell branch="computas">
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-computas">
          Computas
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold">PC & hardware news</h1>
        <p className="mt-3 text-sm text-muted">
          Headlines gathered from Tom's Hardware and TechPowerUp — the same
          sources used on the original Looters Computas storefront.
        </p>
        <ul className="mt-8 divide-y divide-line">
          {NEWS.map((n) => (
            <li key={n.title} className="py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                {n.source} · {n.date}
              </p>
              <h2 className="mt-1 font-display text-xl font-bold leading-snug">{n.title}</h2>
            </li>
          ))}
        </ul>
      </main>
    </BranchShell>
  );
}
