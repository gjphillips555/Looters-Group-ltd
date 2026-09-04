import { useCallback, useEffect, useRef, useState } from "react";

const TARGET_W = 2048;
const TARGET_H = 1536;
const CORNERS = ["br", "bl", "tr", "tl"] as const;
type Corner = (typeof CORNERS)[number];
const STYLES = ["clean", "vignette", "warm", "cool", "lens", "frame"] as const;
type Style = (typeof STYLES)[number];

const DB_NAME = "looters_overlay_lib_v1";
const STORE = "overlays";

type Overlay = { id: string; name: string; img: HTMLImageElement; dataUrl?: string };
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

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbPut(record: { id: string; name: string; data: string }) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function dbDelete(id: string) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function dbGetAll(): Promise<{ id: string; name: string; data: string }[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

function loadFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("bad image"));
    img.src = dataUrl;
  });
}

/** Light alpha cleanup: kill near-zero noise, soft-threshold partial edges */
async function refineCutoutAlpha(src: HTMLImageElement): Promise<HTMLImageElement> {
  const w = src.naturalWidth || src.width;
  const h = src.naturalHeight || src.height;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return src;
  ctx.drawImage(src, 0, 0);
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const a = d[i + 3];
    if (a < 12) {
      d[i + 3] = 0;
    } else if (a < 40) {
      // Soften fringe so hard halos are less obvious
      d[i + 3] = Math.round(a * 0.55);
    } else if (a > 240) {
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  const url = c.toDataURL("image/png");
  return loadFromDataUrl(url);
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

function drawContactShadow(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  pw: number,
  ph: number,
  strength: number,
) {
  if (strength <= 0) return;
  const cx = px + pw / 2;
  const cy = py + ph * 0.92;
  const rx = pw * 0.38;
  const ry = Math.max(8, ph * 0.06);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(1, ry / rx);
  const g = ctx.createRadialGradient(0, 0, rx * 0.15, 0, 0, rx);
  const a = 0.22 * strength;
  g.addColorStop(0, `rgba(0,0,0,${a})`);
  g.addColorStop(0.55, `rgba(0,0,0,${a * 0.35})`);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, rx, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paint(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  product: HTMLImageElement | null,
  overlays: Overlay[],
  placed: Placed[],
  style: Style,
  shadowStrength: number,
  cutout: boolean,
) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  if (!product) return;

  const scale = Math.min(w / product.width, h / product.height);
  const pw = Math.round(product.width * scale);
  const ph = Math.round(product.height * scale);
  const px = Math.round((w - pw) / 2);
  const py = Math.round((h - ph) / 2);

  // Soft ground contact shadow (remove.bg style) under cut-out subjects
  if (cutout && shadowStrength > 0) {
    drawContactShadow(ctx, px, py, pw, ph, shadowStrength);
  }

  ctx.save();
  const s = cutout ? shadowStrength : Math.min(shadowStrength, 0.7);
  if (s > 0) {
    // Layered soft drop shadow around the product silhouette
    ctx.shadowColor = `rgba(0,0,0,${0.18 + 0.2 * s})`;
    ctx.shadowBlur = Math.max(14, (28 + 40 * s) * (w / TARGET_W));
    ctx.shadowOffsetY = Math.max(4, (8 + 14 * s) * (w / TARGET_W));
    ctx.shadowOffsetX = 0;
  }
  ctx.drawImage(product, px, py, pw, ph);
  // Second pass slightly tighter for depth
  if (cutout && s > 0.35) {
    ctx.shadowColor = `rgba(0,0,0,${0.1 * s})`;
    ctx.shadowBlur = Math.max(8, 16 * s * (w / TARGET_W));
    ctx.shadowOffsetY = Math.max(2, 6 * s * (w / TARGET_W));
    ctx.drawImage(product, px, py, pw, ph);
  }
  ctx.restore();

  applyStyle(ctx, w, h, style);

  placed.forEach((entry) => {
    const overlay = overlays.find((o) => o.id === entry.overlayId);
    if (!overlay) return;
    let targetW = Math.round(w * 0.28);
    if (overlay.img.width > overlay.img.height * 1.8) targetW = Math.round(w * 0.4);
    else if (overlay.img.width < overlay.img.height * 0.9) targetW = Math.round(w * 0.2);
    const lw = targetW;
    const lh = Math.round(overlay.img.height * (targetW / overlay.img.width));
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
  const [bgBusy, setBgBusy] = useState(false);
  const [bgProgress, setBgProgress] = useState("");
  const [bgRemoved, setBgRemoved] = useState(false);
  const [shadowStrength, setShadowStrength] = useState(0.85);
  const removeBgRef = useRef<null | ((src: Blob | string, cfg?: object) => Promise<Blob>)>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await dbGetAll();
        if (cancelled || !rows.length) return;
        const loaded: Overlay[] = [];
        for (const row of rows) {
          try {
            const img = await loadFromDataUrl(row.data);
            loaded.push({ id: row.id, name: row.name, img, dataUrl: row.data });
          } catch {
            /* skip */
          }
        }
        if (cancelled || !loaded.length) return;
        setOverlays(loaded);
        setActiveId(loaded[0].id);
        setStatus(`Loaded ${loaded.length} saved overlay(s)`);
      } catch (e) {
        console.warn("overlay library load", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
    paint(ctx, canvas.width, canvas.height, product, overlays, placed, style, shadowStrength, bgRemoved);
  }, [overlays, placed, product, style, shadowStrength, bgRemoved]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  async function onProduct(file: File) {
    const img = await loadFile(file);
    setProduct(img);
    setPlaced([]);
    setBgRemoved(false);
    setStatus(`Loaded ${file.name}`);
  }

  async function onOverlayFiles(files: FileList | File[]) {
    const list = [...files].filter((f) => f.type.startsWith("image/"));
    if (!list.length) {
      setStatus("No image files found");
      return;
    }
    const added: Overlay[] = [];
    for (const file of list) {
      const dataUrl = await fileToDataUrl(file);
      const img = await loadFromDataUrl(dataUrl);
      const id = `ov-${crypto.randomUUID()}`;
      const name = file.name.length > 18 ? `${file.name.slice(0, 15)}…` : file.name;
      added.push({ id, name, img, dataUrl });
      try {
        await dbPut({ id, name, data: dataUrl });
      } catch (e) {
        console.warn("save overlay", e);
      }
    }
    setOverlays((prev) => [...prev, ...added]);
    setActiveId(added[added.length - 1].id);
    setStatus(`Added ${added.length} overlay(s) to your library`);
  }

  async function removeFromLibrary(id: string) {
    setOverlays((list) => list.filter((o) => o.id !== id));
    setPlaced((list) => list.filter((p) => p.overlayId !== id));
    if (activeId === id) setActiveId(null);
    try {
      await dbDelete(id);
    } catch {
      /* ignore */
    }
    setStatus("Overlay removed from library");
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
    paint(ctx, TARGET_W, TARGET_H, product, overlays, placed, style, shadowStrength, bgRemoved);
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

  async function ensureRemoveBg() {
    if (removeBgRef.current) return removeBgRef.current;
    setBgProgress("Loading AI model (highest quality, first time ~80 MB)…");
    const mod = await import("@imgly/background-removal");
    const fn =
      (mod as { removeBackground?: typeof removeBgRef.current }).removeBackground ||
      (mod as { default?: typeof removeBgRef.current }).default;
    if (!fn) throw new Error("Background removal module missing export");
    removeBgRef.current = fn;
    setBgProgress("Model ready");
    return fn;
  }

  async function removeBackground() {
    if (!product || bgBusy) return;
    setBgBusy(true);
    setBgProgress("Removing background…");
    try {
      const removeBg = await ensureRemoveBg();
      const canvas = document.createElement("canvas");
      canvas.width = product.naturalWidth || product.width;
      canvas.height = product.naturalHeight || product.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no canvas");
      ctx.drawImage(product, 0, 0);
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
      if (!blob) throw new Error("Could not encode image");
      setBgProgress("Running AI segmentation (isnet)…");

      // Prefer GPU + highest-quality model when available
      const result = await removeBg(blob, {
        model: "isnet",
        device: "gpu",
        progress: (key: string, current: number, total: number) => {
          if (total) setBgProgress(`${key}: ${Math.round((current / total) * 100)}%`);
        },
        output: { format: "image/png", type: "foreground" },
      } as object);

      setBgProgress("Cleaning edges…");
      let img = await loadFromDataUrl(URL.createObjectURL(result));
      img = await refineCutoutAlpha(img);
      setProduct(img);
      setBgRemoved(true);
      setBgProgress("Background removed ✓ + soft shadow");
      setStatus("Cutout ready — shadow applied under the product");
    } catch (err) {
      console.error(err);
      // Fallback: try fp16 / cpu if full isnet+gpu failed
      try {
        setBgProgress("Retrying with balanced model…");
        const removeBg = await ensureRemoveBg();
        const canvas = document.createElement("canvas");
        canvas.width = product.naturalWidth || product.width;
        canvas.height = product.naturalHeight || product.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw err;
        ctx.drawImage(product, 0, 0);
        const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
        if (!blob) throw err;
        const result = await removeBg(blob, {
          model: "isnet_fp16",
          device: "cpu",
          progress: (key: string, current: number, total: number) => {
            if (total) setBgProgress(`${key}: ${Math.round((current / total) * 100)}%`);
          },
          output: { format: "image/png" },
        } as object);
        let img = await loadFromDataUrl(URL.createObjectURL(result));
        img = await refineCutoutAlpha(img);
        setProduct(img);
        setBgRemoved(true);
        setBgProgress("Background removed ✓ (balanced model)");
        setStatus("Cutout ready — shadow applied under the product");
      } catch (err2) {
        console.error(err2);
        setBgProgress(`Error: ${err2 instanceof Error ? err2.message : "failed"}`);
      }
    } finally {
      setBgBusy(false);
    }
  }

  async function pickFolder() {
    const w = window as Window & {
      showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
    };
    if (w.showDirectoryPicker) {
      try {
        const dir = await w.showDirectoryPicker();
        const files: File[] = [];
        for await (const entry of dir.values()) {
          if (entry.kind === "file") {
            const file = await (entry as FileSystemFileHandle).getFile();
            if (file.type.startsWith("image/") || /\.(png|jpe?g|gif|webp)$/i.test(file.name)) {
              files.push(file);
            }
          }
        }
        await onOverlayFiles(files);
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        console.warn(e);
      }
    }
    overlayInput.current?.click();
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
        <button
          type="button"
          disabled={!product || bgBusy}
          onClick={() => void removeBackground()}
          className="mt-2 min-h-11 w-full rounded-full bg-sky-600 text-sm font-semibold text-cream disabled:opacity-40"
        >
          {bgBusy ? "Removing…" : "Remove Background (AI)"}
        </button>
        {bgProgress ? <p className="mt-1 text-xs text-muted">{bgProgress}</p> : null}

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          Product shadow
        </p>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(shadowStrength * 100)}
          onChange={(e) => setShadowStrength(Number(e.target.value) / 100)}
          className="mt-2 w-full accent-software"
        />
        <p className="mt-1 text-xs text-muted">
          {bgRemoved
            ? "Soft drop + floor shadow (like remove.bg). Drag to taste."
            : "Shadow strength — strongest after background is removed."}
        </p>

        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          2. Your overlays
        </p>
        <p className="mt-1 text-xs text-muted">
          Your logos only — saved in this browser. Nothing preloaded.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => overlayInput.current?.click()}
            className="min-h-11 flex-1 rounded-full bg-ink text-sm font-semibold text-cream"
          >
            Add files
          </button>
          <button
            type="button"
            onClick={() => void pickFolder()}
            className="min-h-11 flex-1 rounded-full bg-line text-sm font-semibold"
          >
            Add folder
          </button>
        </div>
        <input
          ref={overlayInput}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) void onOverlayFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {overlays.map((o) => (
            <div key={o.id} className="relative">
              <button
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
              <button
                type="button"
                aria-label="Remove from library"
                onClick={() => void removeFromLibrary(o.id)}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-computas-hot text-[11px] font-bold text-cream"
              >
                ×
              </button>
            </div>
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
              setBgRemoved(false);
              setBgProgress("");
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
