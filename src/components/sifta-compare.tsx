import { Check, Minus } from "lucide-react";
import { SIFTA } from "@/data/catalog";

const BROWSERS = ["Sifta", "Chrome", "Edge", "Firefox", "Safari"] as const;

type Cell = "yes" | "no" | "part";

const ROWS: { label: string; note?: string; cells: Record<(typeof BROWSERS)[number], Cell> }[] = [
  {
    label: "Chromium engine",
    note: "Same web as Chrome, not a page inside Edge.",
    cells: { Sifta: "yes", Chrome: "yes", Edge: "yes", Firefox: "no", Safari: "no" },
  },
  {
    label: "Windows, Mac, Linux, Android",
    cells: { Sifta: "yes", Chrome: "yes", Edge: "part", Firefox: "yes", Safari: "no" },
  },
  {
    label: "NZ tunnel & encrypted vault",
    note: "HTTPS fetch via Wellington. History in a local vault. Not a WireGuard app.",
    cells: { Sifta: "yes", Chrome: "no", Edge: "no", Firefox: "no", Safari: "no" },
  },
  {
    label: "Tracker block + HTTPS only",
    cells: { Sifta: "yes", Chrome: "part", Edge: "part", Firefox: "yes", Safari: "yes" },
  },
  {
    label: "SiftaLoot on this site",
    note: "Works signed-in here even if you never install the app.",
    cells: { Sifta: "yes", Chrome: "no", Edge: "no", Firefox: "no", Safari: "no" },
  },
  {
    label: "Slots, games, TV, QR, IKWIK",
    note: "Built in as browser features. Still just websites — any browser can open them too.",
    cells: { Sifta: "yes", Chrome: "no", Edge: "no", Firefox: "no", Safari: "no" },
  },
  {
    label: "Ad Stopper included",
    cells: { Sifta: "yes", Chrome: "part", Edge: "part", Firefox: "part", Safari: "part" },
  },
  {
    label: "Made for Looters Group",
    cells: { Sifta: "yes", Chrome: "no", Edge: "no", Firefox: "no", Safari: "no" },
  },
];

function Mark({ value }: { value: Cell }) {
  if (value === "yes") {
    return (
      <span className="inline-flex size-8 items-center justify-center rounded-full bg-ok/15 text-ok">
        <Check className="size-4" strokeWidth={2.5} />
        <span className="sr-only">Yes</span>
      </span>
    );
  }
  if (value === "part") {
    return (
      <span className="inline-flex size-8 items-center justify-center rounded-full bg-line text-muted">
        <Minus className="size-4" />
        <span className="sr-only">Partial — store add-on</span>
      </span>
    );
  }
  return (
    <span className="inline-flex size-8 items-center justify-center text-line">
      <Minus className="size-4" />
      <span className="sr-only">No</span>
    </span>
  );
}

export function SiftaCompare() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-software">
        Versus the usual suspects
      </p>
      <h2 className="mt-2 max-w-2xl font-display text-3xl font-extrabold">
        Same web. Different chrome.
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Sifta is a Chromium app — it opens the same sites Chrome does. The
        difference is what’s already in the window: a Wellington tunnel, SiftaLoot,
        and tools you don’t have to hunt the store for. Firefox and Safari win on
        engine independence; Sifta wins on being ours.
      </p>

      <div className="mt-8 space-y-3 md:hidden">
        {ROWS.map((row) => (
          <div key={row.label} className="rounded-2xl bg-cream p-4 shadow-border">
            <p className="font-medium">{row.label}</p>
            {row.note ? <p className="mt-1 text-xs text-muted">{row.note}</p> : null}
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {BROWSERS.map((name) => (
                <div key={name} className="flex items-center justify-between gap-2">
                  <dt className={name === "Sifta" ? "font-semibold text-accent" : "text-muted"}>
                    {name}
                  </dt>
                  <dd>
                    <Mark value={row.cells[name]} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <div className="mt-8 hidden overflow-x-auto rounded-3xl bg-cream shadow-border md:block">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="px-4 py-3 font-semibold text-muted"> </th>
              {BROWSERS.map((name) => (
                <th
                  key={name}
                  className={
                    name === "Sifta"
                      ? "px-2 py-3 text-center font-display text-sm font-extrabold text-accent"
                      : "px-2 py-3 text-center text-xs font-semibold text-muted"
                  }
                >
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-b border-line last:border-0">
                <th className="max-w-[14rem] px-4 py-3 text-left font-medium">
                  {row.label}
                  {row.note ? (
                    <span className="mt-0.5 block text-xs font-normal text-muted">{row.note}</span>
                  ) : null}
                </th>
                {BROWSERS.map((name) => (
                  <td key={name} className="px-2 py-3 text-center">
                    <Mark value={row.cells[name]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted">
        Dash in the middle = add-on or extra setup, not built in. Chrome, Edge,
        Firefox and Safari are trademarks of their owners.
      </p>
      <a
        href={SIFTA.download}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex min-h-12 items-center rounded-full bg-ink px-5 text-sm font-semibold text-cream"
      >
        Get Sifta
      </a>
    </section>
  );
}
