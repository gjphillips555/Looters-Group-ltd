import { useCallback, useEffect, useRef, useState } from "react";

const TARGET_W = 2048;
const TARGET_H = 1536;
const CORNERS = ["br", "bl", "tr", "tl"] as const;
type Corner = (typeof CORNERS)[number];
const STYLES = ["clean", "vignette", "warm", "cool", "lens", "frame"] as const;
type Style = (typeof STYLES)[number];

type Overlay = { id: string; name: string; img: HTMLImageElement };
type Placed = { overlayId: string; corners: Corner[] };

function loadFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Not an image"));
      return;
    }
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = URL.createObjectURL(file);
  });
}

function applyStyle(ctx: CanvasRenderingContext2D, w: number, h: number, style: Style) {
  if (style === "clean") return;
  if (style === "vignette") {
    const g = ctx.createRadialGradient(w / 2, h / 2, w * 0.28, w / 2, h / 2, w * 0.72);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.32)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  } else if (style === "warm") {
    ctx.fillStyle = "rgba(255, 140, 50, 0.07)";
    ctx.fillRect(0, 0, w, h);
  } else if (style === "cool") {
    ctx.fillStyle = "rgba(70, 130, 255, 0.06)";
    ctx.fillRect(0, 0, w, h);
  } else if (style === "lens") {
    const g = ctx.createRadialGradient(w * 0.65, h * 0.25, 0, w * 0.65, h * 0.25, w * 0.55);
    g.addColorStop(0, "rgba(255,255,255,0.11)");
    g.addColorStop(0.6, "rgba(255,255,255,0.02)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  } else {
    ctx.strokeStyle = "rgba(29, 78, 216, 0.4)";
    ctx.lineWidth = Math.max(3, 7 * (w / TARGET_W));
    ctx.strokeRect(10, 10, w - 20, h - 20);
  }
}

function paint(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  product: HTMLImageElement | null,
  overlays: Overlay[],
  placed: Placed[],
  style: Style,
) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  if (!product) return;

  const scale = Math.min(w / product.width, h / product.height);
  const pw = Math.round(product.width * scale);
  const ph = Math.round(product.height * scale);
  const px = Math.round((w - pw) / 2);
  const py = Math.round((h - ph) / 2);
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.22)";
  ctx.shadowBlur = Math.max(18, 30 * (w / TARGET_W));
  ctx.shadowOffsetY = Math.max(6, 12 * (w / TARGET_W));
  ctx.drawImage(product, px, py, pw, ph);
  ctx.restore();
  applyStyle(ctx, w, h, style);

  placed.forEach((entry) => {
    const overlay = overlays.find((o) => o.id === entry.overlayId);
    if (!overlay) return;
    const targetW = Math.round(w * 0.22);
    const sc = targetW / overlay.img.width;
    const lw = targetW;
    const lh = Math.round(overlay.img.height * sc);
    const margin = Math.round(w * 0.018);
    const positions: Record<Corner, [number, number]> = {
      br: [w - lw - margin, h - lh - margin],
      bl: [margin, h - lh - margin],
      tr: [w - lw - margin, margin],
      tl: [margin, margin],
    };
    entry.corners.forEach((c) => {
      const [dx, dy] = positions[c];
      ctx.drawImage(overlay.img, dx, dy, lw, lh);
    });
  });
}

export function OverlayStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const productInput = useRef<HTMLInputElement>(null);
  const overlayInput = useRef<HTMLInputElement>(null);
  const [product, setProduct] = useState<HTMLImageElement | null>(null);
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [corners, setCorners] = useState<Set<Corner>>(new Set(["br"]));
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [style, setStyle] = useState<Style>("clean");
  const [status, setStatus] = useState("Drop a photo to start.");
  const [drag, setDrag] = useState(false);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const maxW = 960;
    const maxH = 540;
    const scale = Math.min(maxW / TARGET_W, maxH / TARGET_H);
    canvas.width = Math.round(TARGET_W * scale);
    canvas.height = Math.round(TARGET_H * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    paint(ctx, canvas.width, canvas.height, product, overlays, placed, style);
  }, [overlays, placed, product, style]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  async function onProduct(file: File) {
    const img = await loadFile(file);
    setProduct(img);
    setPlaced([]);
    setStatus(`Loaded ${file.name}`);
  }

  async function onOverlay(file: File) {
    const img = await loadFile(file);
    const id = `ov-${crypto.randomUUID()}`;
    const name = file.name.length > 18 ? `${file.name.slice(0, 15)}…` : file.name;
    setOverlays((list) => [...list, { id, name, img }]);
    setActiveId(id);
    setStatus(`Overlay ready: ${name}`);
  }

  function addOverlay() {
    if (!product || !activeId || corners.size === 0) return;
    setPlaced((list) => [...list, { overlayId: activeId, corners: [...corners] }]);
    setCorners(new Set(["br"]));
    setStatus("Overlay added. Layer another if you want.");
  }

  function download() {
    if (!product) return;
    const full = document.createElement("canvas");
    full.width = TARGET_W;
    full.height = TARGET_H;
    const ctx = full.getContext("2d");
    if (!ctx) return;
    paint(ctx, TARGET_W, TARGET_H, product, overlays, placed, style);
    full.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "overlay-2048x1536.png";
      a.click();
      URL.revokeObjectURL(a.href);
      setStatus("Downloaded 2048 × 1536 PNG.");
    }, "image/png");
  }

  const active = overlays.find((o) => o.id === activeId);

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      <div className="rounded-3xl bg-cream p-4 shadow-border">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          1. Product photo
        </p>
        <button
          type="button"
          onClick={() => productInput.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const file = e.dataTransfer.files[0];
            if (file) void onProduct(file);
          }}
          className={
            drag
              ? "mt-2 flex min-h-24 w-full items-center justify-center rounded-2xl border-2 border-dashed border-software bg-software/10 text-sm text-software"
              : "mt-2 flex min-h-24 w-full items-center justify-center rounded-2xl border-2 border-dashed border-line text-sm text-muted"
          }
        >
          Drop a photo or click
        </button>
        <input
          ref={productInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void onProduct(file);
            e.target.value = "";
          }}
        />

        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          2. Your overlays
        </p>
        <p className="mt-1 text-xs text-muted">PNG logos or badges you already have. Nothing is preloaded.</p>
        <button
          type="button"
          onClick={() => overlayInput.current?.click()}
          className="mt-2 min-h-11 w-full rounded-full bg-ink text-sm font-semibold text-cream"
        >
          Upload overlay
        </button>
        <input
          ref={overlayInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void onOverlay(file);
            e.target.value = "";
          }}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {overlays.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setActiveId(o.id)}
              className={
                o.id === activeId
                  ? "overflow-hidden rounded-lg ring-2 ring-software"
                  : "overflow-hidden rounded-lg ring-1 ring-line"
              }
              title={o.name}
            >
              <img src={o.img.src} alt="" className="h-14 w-14 object-contain bg-white" />
            </button>
          ))}
        </div>

        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          3. Corners
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {CORNERS.map((c) => {
            const on = corners.has(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  const next = new Set(corners);
                  if (next.has(c)) next.delete(c);
                  else next.add(c);
                  setCorners(next);
                }}
                className={
                  on
                    ? "min-h-9 rounded-full bg-ink px-3 text-xs font-semibold uppercase text-cream"
                    : "min-h-9 rounded-full bg-line/70 px-3 text-xs font-semibold uppercase"
                }
              >
                {c}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          disabled={!product || !active}
          onClick={addOverlay}
          className="mt-3 min-h-11 w-full rounded-full bg-ok text-sm font-semibold text-cream disabled:opacity-40"
        >
          Add overlay
        </button>
        <div className="mt-2 space-y-1 text-xs text-muted">
          {placed.length === 0 ? <p>No overlays added yet.</p> : null}
          {placed.map((p, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-line/50 px-2 py-1">
              <span>
                {overlays.find((o) => o.id === p.overlayId)?.name} · {p.corners.join(", ").toUpperCase()}
              </span>
              <button
                type="button"
                className="text-computas-hot"
                onClick={() => setPlaced((list) => list.filter((_, idx) => idx !== i))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          4. Style
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStyle(s)}
              className={
                style === s
                  ? "min-h-9 rounded-full bg-software px-3 text-xs font-semibold capitalize text-cream"
                  : "min-h-9 rounded-full bg-line/70 px-3 text-xs font-semibold capitalize"
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-cream p-4 shadow-border">
        <div className="flex min-h-[280px] items-center justify-center rounded-2xl bg-ink/5 p-3">
          <canvas ref={canvasRef} className="max-h-[540px] max-w-full rounded-lg bg-white" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!product}
            onClick={download}
            className="min-h-11 rounded-full bg-software px-5 text-sm font-semibold text-cream disabled:opacity-40"
          >
            Download 2048×1536 PNG
          </button>
          <button
            type="button"
            onClick={() => {
              setProduct(null);
              setPlaced([]);
              setStatus("Drop a photo to start.");
            }}
            className="min-h-11 rounded-full bg-line px-5 text-sm font-semibold"
          >
            Clear
          </button>
        </div>
        <p className="mt-2 text-xs text-muted">{status}</p>
      </div>
    </div>
  );
}
