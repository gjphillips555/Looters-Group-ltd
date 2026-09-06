import { useState } from "react";
import { OS_SYSTEMS, type OsId, type OsSystem } from "@/lib/os-systems";

type Props = {
  value: OsId;
  onChange: (id: OsId) => void;
};

export function SystemCarousel({ value, onChange }: Props) {
  const index = Math.max(
    0,
    OS_SYSTEMS.findIndex((s) => s.id === value),
  );
  const count = OS_SYSTEMS.length;
  const system: OsSystem = OS_SYSTEMS[index]!;

  const prev = () => {
    const next = (index - 1 + count) % count;
    onChange(OS_SYSTEMS[next]!.id);
  };
  const next = () => {
    const n = (index + 1) % count;
    onChange(OS_SYSTEMS[n]!.id);
  };

  return (
    <section className="mx-auto max-w-3xl">
      <p className="text-center text-base font-semibold text-ink sm:text-lg">
        Choose your system below:
      </p>

      <div className="mt-6 flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous system"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line bg-white text-xl font-bold text-ink shadow-sm hover:bg-line/40"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={() => onChange(system.id)}
          className="flex min-h-[11rem] flex-1 flex-col items-center justify-center gap-3 rounded-2xl bg-white p-6 shadow-border ring-1 ring-line transition hover:ring-2 hover:ring-ink"
          aria-label={`Selected ${system.label}`}
          aria-pressed="true"
        >
          <img
            src={system.logo}
            alt=""
            className="h-20 w-20 rounded-2xl object-contain shadow-sm sm:h-24 sm:w-24"
          />
          <span className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
            {system.label}
          </span>
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next system"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line bg-white text-xl font-bold text-ink shadow-sm hover:bg-line/40"
        >
          ›
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {OS_SYSTEMS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id)}
            aria-label={s.label}
            aria-current={i === index ? "true" : undefined}
            title={s.label}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition ${
              i === index
                ? "border-ink bg-ink text-white"
                : "border-line bg-white text-muted hover:border-ink/40 hover:text-ink"
            }`}
          >
            <img src={s.logo} alt="" className="h-4 w-4 rounded-sm object-contain" />
            {s.short}
          </button>
        ))}
      </div>
    </section>
  );
}

/** Uncontrolled helper if a parent only needs local state. */
export function SystemCarouselStandalone({
  initial = "win11",
  onChange,
}: {
  initial?: OsId;
  onChange?: (id: OsId) => void;
}) {
  const [value, setValue] = useState<OsId>(initial);
  return (
    <SystemCarousel
      value={value}
      onChange={(id) => {
        setValue(id);
        onChange?.(id);
      }}
    />
  );
}
