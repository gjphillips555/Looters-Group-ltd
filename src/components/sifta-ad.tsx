import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

export function SiftaAd({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [vol, setVol] = useState(0.7);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = muted;
    el.volume = vol;
    void el.play().catch(() => undefined);
  }, [muted, vol]);

  return (
    <div
      className={cn(
        "relative w-[168px] shrink-0 overflow-hidden rounded-2xl bg-ink shadow-border sm:w-[188px]",
        className,
      )}
    >
      <video
        ref={ref}
        src="/brand/sifta-browser.mp4"
        className="aspect-[9/16] h-auto w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        controls={false}
        disablePictureInPicture
        onPause={(e) => {
          void e.currentTarget.play().catch(() => undefined);
        }}
        aria-label="Sifta Browser advertisement"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-ink/80 to-transparent px-2 pb-2 pt-8">
        <button
          type="button"
          aria-label={muted ? "Unmute advert" : "Mute advert"}
          onClick={() => setMuted((m) => !m)}
          className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full bg-cream/95 text-ink"
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={muted ? 0 : vol}
          aria-label="Volume"
          onChange={(e) => {
            const next = Number(e.target.value);
            setVol(next);
            setMuted(next === 0);
          }}
          className="h-1.5 w-full accent-software-hot"
        />
      </div>
    </div>
  );
}
