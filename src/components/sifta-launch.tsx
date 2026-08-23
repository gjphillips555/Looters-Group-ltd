import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { SIFTA } from "@/data/catalog";
import { inSifta } from "@/lib/sifta-runtime";

export function SiftaLaunch() {
  const [installed, setInstalled] = useState(false);
  useEffect(() => setInstalled(inSifta()), []);
  return (
    <div className="w-full">
      {installed ? (
        <p className="text-sm text-cream/70">Sifta is already running here.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          <a
            href={SIFTA.windows}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-software-hot px-5 text-sm font-semibold text-ink"
          >
            Download for Windows
          </a>
          <a
            href={SIFTA.linux}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cream/10 px-5 text-sm font-semibold text-cream"
          >
            Download for Linux
          </a>
          <a
            href={SIFTA.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cream/10 px-5 text-sm font-semibold text-cream"
          >
            Open in browser
            <ExternalLink className="size-4" />
          </a>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {SIFTA.features.map((f) => (
          <a
            key={f.href}
            href={`${SIFTA.url}${f.href}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-cream/10 px-3 py-1.5 text-xs font-semibold text-cream hover:bg-cream/20"
          >
            {f.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function SiftaFrame() {
  return (
    <iframe
      title="Sifta Browser"
      src={SIFTA.url}
      className="h-[min(72vh,44rem)] w-full rounded-3xl border border-cream/10 bg-ink"
      allow="clipboard-write; fullscreen"
    />
  );
}
