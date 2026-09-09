import { useEffect, useState } from "react";
import { ARTWORK } from "@/lib/artwork";
import { OLED_HELP, useOledMode } from "@/lib/oled-mode";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className = "h-12 w-auto max-w-[220px] object-contain sm:h-14 sm:max-w-[280px]",
  variant = "mark",
}: {
  className?: string;
  variant?: "mark" | "oled";
}) {
  return (
    <img
      src={variant === "oled" ? ARTWORK.logoOled : ARTWORK.logoDark}
      alt="Looters Computas"
      className={className}
    />
  );
}

function aucklandParts() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Pacific/Auckland",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const g = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "00";
  return {
    date: `${g("year")}/${g("month")}/${g("day")}`,
    time: `${g("hour")}:${g("minute")}:${g("second")}`,
  };
}

export function CmdLogo({ compact = false }: { compact?: boolean }) {
  const [booting, setBooting] = useState(() =>
    !(
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ),
  );
  const [oled, setOled] = useState(false);
  const [clock, setClock] = useState(aucklandParts);
  const help = useOledMode((s) => s.help);
  const page = useOledMode((s) => s.page);
  const flash = useOledMode((s) => s.flash);
  const closeFlash = useOledMode((s) => s.closeFlash);

  useEffect(() => {
    if (!booting) return;
    const id = window.setTimeout(() => setBooting(false), 2600);
    return () => window.clearTimeout(id);
  }, [booting]);

  useEffect(() => {
    const id = window.setInterval(() => setClock(aucklandParts()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      className={cn(
        "cmd-screen",
        compact && "cmd-screen-sm",
        !booting && "boot-done",
        oled && "is-oled",
        help && "is-help",
        flash && "is-flash",
      )}
      onClick={() => {
        if (booting) return;
        if (flash) {
          closeFlash();
          setOled(false);
          return;
        }
        if (help) return;
        setOled((v) => !v);
      }}
      role="button"
      aria-label={flash ? "Continue" : "Toggle OLED clock"}
    >
      <span className="cmd-rest">
        <img
          src={ARTWORK.logoPixel}
          alt="Looters Computas"
          className="cmd-pixel-logo"
        />
        {compact ? null : <span className="cmd-start">PRESS START</span>}
        {booting ? (
          <img
            src={ARTWORK.favicon}
            alt=""
            className="pixel-penguin"
            width={40}
            height={40}
          />
        ) : null}
      </span>
      <OledHud date={clock.date} time={clock.time} />
      <OledHelp page={page} />
      <span className="oled-flash">
        <img
          src={ARTWORK.favicon}
          alt=""
          className="pixel-penguin oled-flash-pen"
          width={40}
          height={40}
        />
        <span className="oled-flash-cat">{flash}</span>
      </span>
    </span>
  );
}

function OledHelp({ page }: { page: number }) {
  const item = OLED_HELP[page] ?? OLED_HELP[0];
  return (
    <span className="oled-help">
      <span className="oled-help-k">INFO {page + 1}/{OLED_HELP.length}</span>
      <span className="oled-help-title">{item.title}</span>
      {item.lines.map((line) => (
        <span key={line} className="oled-help-line">
          {line}
        </span>
      ))}
    </span>
  );
}

function OledHud({
  date,
  time,
}: {
  date: string;
  time: string;
}) {
  return (
    <span className="oled-hud">
      <span className="oled-top">
        <span className="oled-date">{date}</span>
        <span className="oled-status-icons">
          <BatteryIcon />
        </span>
      </span>
      <span className="oled-time">{time}</span>
      <span className="oled-pills">
        <span className="oled-pill">
          <WindowsIcon />
          WIN
        </span>
        <span className="oled-pill oled-pill-wifi">
          <WifiIcon />
        </span>
      </span>
    </span>
  );
}

function BatteryIcon() {
  return (
    <svg className="oled-battery" viewBox="0 0 28 14" aria-hidden="true">
      <rect x="1" y="2" width="23" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <rect x="24.5" y="5" width="2.5" height="4" rx="0.6" fill="currentColor" />
      <rect x="3.2" y="4.2" width="18" height="5.6" rx="0.6" fill="currentColor" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg className="oled-wifi" viewBox="0 0 16 12" aria-hidden="true">
      <path d="M2 5.2c3.4-3.2 8.6-3.2 12 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.2 7.3c2.2-2 5.4-2 7.6 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="10" r="1.15" fill="currentColor" />
    </svg>
  );
}

function WindowsIcon() {
  return (
    <svg className="oled-win" viewBox="0 0 14 14" aria-hidden="true">
      <rect x="0.5" y="0.5" width="6" height="6" fill="currentColor" />
      <rect x="7.5" y="0.5" width="6" height="6" fill="currentColor" />
      <rect x="0.5" y="7.5" width="6" height="6" fill="currentColor" />
      <rect x="7.5" y="7.5" width="6" height="6" fill="currentColor" />
    </svg>
  );
}
