import { useMemo, useState } from "react";
import type { OsId } from "@/lib/os-systems";
import {
  appsForOs,
  CATEGORY_LABEL,
  type CatalogApp,
  type SoftwareCategory,
} from "@/lib/software-catalog";

const FILTERS: Array<SoftwareCategory | "all"> = [
  "all",
  "utility",
  "pentest",
  "gaming",
  "creative",
];

function CategoryPill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-software text-white"
          : "border border-line bg-white text-muted hover:border-software/40 hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

function AppCard({ app }: { app: CatalogApp }) {
  const [imgFailed, setImgFailed] = useState(false);
  const cat = CATEGORY_LABEL[app.category];

  return (
    <a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-border transition hover:shadow-border-hover hover:ring-2 hover:ring-ink/20"
    >
      <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-cream to-line/40 p-6">
        {!imgFailed ? (
          <img
            src={app.thumb}
            alt=""
            className="h-16 w-16 object-contain drop-shadow-sm transition group-hover:scale-105"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-ink text-lg font-bold text-white">
            {app.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted ring-1 ring-line">
          {cat}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-display text-base font-bold leading-tight text-ink group-hover:underline">
          {app.name}
        </h3>
        <p className="line-clamp-3 text-xs leading-relaxed text-muted">{app.blurb}</p>
        {app.tags && app.tags.length > 0 && (
          <p className="mt-auto pt-2 text-[10px] font-medium uppercase tracking-wide text-software">
            {app.tags.join(" · ")}
          </p>
        )}
      </div>
    </a>
  );
}

export function SoftwareGrid({ os }: { os: OsId }) {
  const [category, setCategory] = useState<SoftwareCategory | "all">("all");
  const apps = useMemo(() => appsForOs(os, category), [os, category]);

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-extrabold text-ink sm:text-2xl">
          Free & open-source for this system
        </h2>
        <p className="text-xs text-muted">{apps.length} tools</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <CategoryPill
            key={f}
            active={category === f}
            label={f === "all" ? "All" : CATEGORY_LABEL[f]}
            onClick={() => setCategory(f)}
          />
        ))}
      </div>

      {apps.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-line bg-cream/50 p-8 text-center text-sm text-muted">
          No tools in this category for this system yet — try All or another filter.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}

      <p className="mt-8 text-center text-xs text-muted">
        Links go to official project pages. Use security tools only on systems you own or
        have permission to test.
      </p>
    </div>
  );
}
