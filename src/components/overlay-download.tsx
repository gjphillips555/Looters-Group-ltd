import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ExternalLink, X } from "lucide-react";

const THUMB = "/brand/overlay-thumb.jpg";

export function OverlayDownload() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="mt-6 max-w-xl">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full overflow-hidden rounded-3xl bg-cream text-left shadow-border transition hover:-translate-y-0.5 hover:shadow-border-hover"
      >
        <img
          src={THUMB}
          alt="Looters Overlay — click to enlarge"
          className="media aspect-[16/10] w-full object-cover object-top"
        />
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-software">
            Live on this site
          </p>
          <h3 className="mt-1 font-display text-xl font-bold">Overlay Studio</h3>
          <p className="mt-1 text-sm text-muted">
            Your logos only. AI background removal, persistent library, 2048×1536 PNG export.
          </p>
        </div>
      </button>
      <Link
        to="/software/overlay"
        className="mt-3 inline-flex min-h-12 items-center gap-2 rounded-full bg-software px-5 text-sm font-semibold text-cream"
      >
        <ExternalLink className="size-4" />
        Open Overlay Studio
      </Link>

      {open ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-cream shadow-border-hover"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 inline-flex min-h-10 min-w-10 items-center justify-center rounded-full bg-ink text-cream"
            >
              <X className="size-4" />
            </button>
            <img src={THUMB} alt="Looters Overlay" className="max-h-[70vh] w-full object-contain bg-ink/5" />
            <div className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <p className="font-display text-lg font-bold">Overlay Studio</p>
                <p className="text-sm text-muted">
                  Runs on Vercel — AI cutouts + your saved overlays in this browser.
                </p>
              </div>
              <Link
                to="/software/overlay"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-software px-5 text-sm font-semibold text-cream"
              >
                <ExternalLink className="size-4" />
                Open
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
