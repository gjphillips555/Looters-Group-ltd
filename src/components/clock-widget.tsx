import { useEffect, useState } from "react";

const TZ = "Pacific/Auckland";

function formatParts(now: Date) {
  const weekday = new Intl.DateTimeFormat("en-NZ", {
    weekday: "long",
    timeZone: TZ,
  }).format(now);
  const date = new Intl.DateTimeFormat("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TZ,
  }).format(now);
  const time = new Intl.DateTimeFormat("en-NZ", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: TZ,
  }).format(now);
  const offset =
    new Intl.DateTimeFormat("en-NZ", {
      timeZone: TZ,
      timeZoneName: "shortOffset",
    })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value ?? "";
  const zone = offset.includes("13") ? "NZDT" : "NZST";

  return { weekday, date, time, zone };
}

export function ClockWidget() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const parts = now ? formatParts(now) : null;

  return (
    <time
      dateTime={now?.toISOString()}
      className="inline-flex w-fit items-baseline gap-x-3 gap-y-0.5 rounded-xl border border-border bg-secondary/40 px-3 py-2"
    >
      <span className="font-display text-lg font-semibold tabular-nums leading-none text-accent sm:text-xl">
        {parts?.time ?? "--:--:-- --"}
      </span>
      <span className="flex flex-col">
        <span className="text-xs font-medium leading-tight text-foreground">
          {parts?.weekday ?? "—"}
        </span>
        <span className="text-xs leading-tight text-muted-foreground">
          {parts ? `${parts.date} · ${parts.zone}` : "New Zealand"}
        </span>
      </span>
    </time>
  );
}
