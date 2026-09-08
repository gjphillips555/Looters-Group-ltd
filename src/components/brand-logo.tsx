import { ARTWORK } from "@/lib/artwork";

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

export function CmdLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "cmd-screen cmd-screen-sm" : "cmd-screen"}>
      <span className="cmd-line">{`C:\\LOOTERS>type logo.sys`}</span>
      <span className="cmd-brand">LOOTERS</span>
      <span className="cmd-brand cmd-computas">COMPUTAS</span>
      <span className="cmd-line">
        {`C:\\LOOTERS>`}
        <span className="cmd-cursor" />
      </span>
    </span>
  );
}
