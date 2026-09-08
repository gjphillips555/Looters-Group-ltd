import { useEffect, useState } from "react";
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
  const [scene, setScene] = useState<"shark" | "logo">(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "logo"
      : "shark",
  );

  useEffect(() => {
    if (scene === "logo") return;
    const id = window.setTimeout(() => setScene("logo"), 2600);
    return () => window.clearTimeout(id);
  }, [scene]);

  return (
    <span className={compact ? "cmd-screen cmd-screen-sm" : "cmd-screen"}>
      <span className="cmd-scan" aria-hidden="true" />
      {scene === "shark" ? (
        <span className="cmd-boot" aria-hidden="true">
          <span className="cmd-boot-label">BOOT</span>
          <PixelShark />
        </span>
      ) : (
        <span className="cmd-logo-in">
          <span className="cmd-line">{`C:\\LOOTERS>type logo.sys`}</span>
          <img
            src={ARTWORK.logoPixel}
            alt="Looters Computas"
            className="cmd-pixel-logo"
          />
          <span className="cmd-line">
            {`C:\\LOOTERS>`}
            <span className="cmd-cursor" />
          </span>
        </span>
      )}
    </span>
  );
}

function PixelShark() {
  return (
    <svg
      className="pixel-shark"
      viewBox="0 0 40 18"
      width="168"
      height="76"
      shapeRendering="crispEdges"
    >
      <g fill="#9ad8ff">
        <rect x="8" y="7" width="18" height="6" />
        <rect x="6" y="8" width="2" height="4" />
        <rect x="26" y="8" width="6" height="4" />
        <rect x="32" y="9" width="4" height="2" />
        <rect x="14" y="4" width="4" height="3" />
        <rect x="16" y="2" width="3" height="2" />
        <rect x="12" y="13" width="5" height="3" />
        <rect x="10" y="15" width="3" height="2" />
      </g>
      <g fill="#7030c0">
        <rect x="20" y="5" width="3" height="2" />
        <rect x="22" y="13" width="4" height="2" />
      </g>
      <rect x="28" y="9" width="2" height="2" fill="#111018" />
      <rect x="34" y="9" width="2" height="2" fill="#fff" />
    </svg>
  );
}
