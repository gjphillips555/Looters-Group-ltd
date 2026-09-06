import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { STORE_LOGOS, GROUP_LOGO_SRC } from "@/lib/store-logos";

export { GROUP_LOGO_SRC };

export function StoreCarousel() {
  const [index, setIndex] = useState(0);
  const store = STORE_LOGOS[index]!;
  const count = STORE_LOGOS.length;

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-center text-base font-semibold text-ink sm:text-lg">
        Select your Looters Group Store Below:
      </p>

      <div className="mt-6 flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous store"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line bg-white text-xl font-bold text-ink shadow-sm hover:bg-line/40"
        >
          ‹
        </button>

        <Link
          to={store.href}
          className="flex min-h-[12rem] flex-1 items-center justify-center rounded-2xl bg-white p-6 shadow-border ring-1 ring-line transition hover:ring-2 hover:ring-ink"
          aria-label={`Open ${store.label}`}
        >
          <img
            src={store.src}
            alt={store.label}
            className="w-full max-w-md object-contain"
          />
        </Link>

        <button
          type="button"
          onClick={next}
          aria-label="Next store"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line bg-white text-xl font-bold text-ink shadow-sm hover:bg-line/40"
        >
          ›
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {STORE_LOGOS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={s.label}
            aria-current={i === index ? "true" : undefined}
            className={`h-2.5 w-2.5 rounded-full ${
              i === index ? "bg-ink" : "bg-line"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
