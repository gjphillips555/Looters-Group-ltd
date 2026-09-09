import { useCallback, useEffect, useRef, useState } from "react";

/** Canvas export size for Trade Me / listing images */
const OUT_W = 2048;
const OUT_H = 1536;
const PAD = 0.08; // ~8% margin around product after fit
const STORAGE_KEY = "looters-overlay-studio-v1";
/** JPEG quality — sharp enough for listings, small files for load speed */
const JPEG_QUALITY = 0.88;

type Corner = "br" | "bl" | "tr" | "tl";

type OverlayItem = {
  id: string;
  name: string;
  /** data URL */
  src: string;
};

type PlacedOverlay = {
  overlayId: string;
  corner: Corner;
  scale: number; // fraction of canvas width
};

function loadOverlays(): OverlayItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OverlayItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOverlays(items: OverlayItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Read failed"));
    reader.readAsDataURL(file);
  });
}

function cornerXY(
  corner: Corner,
  canvasW: number,
  canvasH: number,
  drawW: number,
  drawH: number,
  margin: number,
) {
  switch (corner) {
    case "br":
      return { x: canvasW - drawW - margin, y: canvasH - drawH - margin };
    case "bl":
      return { x: margin, y: canvasH - drawH - margin };
    case "tr":
      return { x: canvasW - drawW - margin, y: margin };
    case "tl":
      return { x: margin, y: margin };
  }
}

export function OverlayStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const productInputRef = useRef<HTMLInputElement>(null);
  const overlayInputRef = useRef<HTMLInputElement>(null);

  const [productUrl, setProductUrl] = useState<string | null>(null);
  const [productName, setProductName] = useState("product");
  const [library, setLibrary] = useState<OverlayItem[]>([]);
  const [placed, setPlaced] = useState<PlacedOverlay[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [corner, setCorner] = useState<Corner>("br");
  const [scale, setScale] = useState(0.22);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Upload a product photo to begin.");

  useEffect(() => {
    setLibrary(loadOverlays());
  }, []);

  const redraw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = OUT_W;
    canvas.height = OUT_H;

    // White listing background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, OUT_W, OUT_H);

    if (productUrl) {
      try {
        const img = await loadImage(productUrl);
        const maxW = OUT_W * (1 - PAD * 2);
        const maxH = OUT_H * (1 - PAD * 2);
        const ratio = Math.min(maxW / img.width, maxH / img.height);
        const dw = img.width * ratio;
        const dh = img.height * ratio;
        const dx = (OUT_W - dw) / 2;
        const dy = (OUT_H - dh) / 2;

        // Soft product shadow (around the product only)
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.18)";
        ctx.shadowBlur = 36;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 10;
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
        // Crisp pass on top
        ctx.drawImage(img, dx, dy, dw, dh);
      } catch {
        setStatus("Could not draw product image.");
      }
    }

    // Overlays — no heavy shadow, slight transparency ok via PNG alpha
    for (const p of placed) {
      const item = library.find((o) => o.id === p.overlayId);
      if (!item) continue;
      try {
        const oimg = await loadImage(item.src);
        const targetW = OUT_W * p.scale;
        const ratio = targetW / oimg.width;
        const ow = targetW;
        const oh = oimg.height * ratio;
        const margin = Math.round(OUT_W * 0.02);
        const { x, y } = cornerXY(p.corner, OUT_W, OUT_H, ow, oh, margin);
        ctx.drawImage(oimg, x, y, ow, oh);
      } catch {
        /* skip broken overlay */
      }
    }
  }, [productUrl, placed, library]);

  useEffect(() => {
    void redraw();
  }, [redraw]);

  async function onProductFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await fileToDataUrl(file);
      setProductUrl(url);
      setProductName(file.name.replace(/\.[^.]+$/, "") || "product");
      setStatus(`Loaded ${file.name} · canvas ${OUT_W}×${OUT_H}`);
    } catch {
      setStatus("Could not read that file.");
    } finally {
      setBusy(false);
    }
  }

  async function onOverlayFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      const next = [...library];
      for (const file of Array.from(files)) {
        const src = await fileToDataUrl(file);
        const item: OverlayItem = {
          id: crypto.randomUUID(),
          name: file.name.replace(/\.[^.]+$/, "") || "overlay",
          src,
        };
        next.push(item);
        setSelectedId(item.id);
      }
      setLibrary(next);
      saveOverlays(next);
      setStatus(`Saved ${files.length} overlay(s) to this browser only.`);
    } catch {
      setStatus("Could not import overlay.");
    } finally {
      setBusy(false);
    }
  }

  function deleteOverlay(id: string) {
    const next = library.filter((o) => o.id !== id);
    setLibrary(next);
    saveOverlays(next);
    setPlaced((p) => p.filter((x) => x.overlayId !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function addPlaced() {
    if (!selectedId) {
      setStatus("Pick an overlay first.");
      return;
    }
    setPlaced((prev) => [
      ...prev,
      { overlayId: selectedId, corner, scale },
    ]);
    setStatus("Overlay added. Change corner/size and press Add again for more.");
  }

  function clearPlaced() {
    setPlaced([]);
    setStatus("Cleared placed overlays (library kept).");
  }

  function downloadJpeg() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${productName}_looters_${OUT_W}x${OUT_H}.jpg`;
        a.click();
        URL.revokeObjectURL(a.href);
        const kb = Math.round(blob.size / 1024);
        setStatus(
          `Downloaded JPEG ${OUT_W}×${OUT_H} @ ${Math.round(JPEG_QUALITY * 100)}% (~${kb} KB). Ready for shop + Trade Me.`,
        );
      },
      "image/jpeg",
      JPEG_QUALITY,
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Overlay Studio
        </h1>
        <p className="text-sm text-muted-foreground">
          Separate from the shop. Your product shots and overlays stay in this
          browser only — nothing is mixed into the store catalog.
        </p>
        <p className="text-xs text-muted-foreground">{status}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            <canvas
              ref={canvasRef}
              className="mx-auto block h-auto w-full max-w-full"
              style={{ aspectRatio: `${OUT_W} / ${OUT_H}` }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
              disabled={busy}
              onClick={() => productInputRef.current?.click()}
            >
              Upload product
            </button>
            <button
              type="button"
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold disabled:opacity-50"
              disabled={!productUrl}
              onClick={downloadJpeg}
            >
              Download {OUT_W}×{OUT_H} JPG
            </button>
            <button
              type="button"
              className="rounded-lg border border-border px-4 py-2 text-sm"
              onClick={clearPlaced}
            >
              Clear placed
            </button>
          </div>
          <input
            ref={productInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => void onProductFiles(e.target.files)}
          />
        </div>

        <aside className="space-y-4 rounded-xl border border-border bg-card p-4">
          <div>
            <h2 className="text-sm font-semibold">Overlay library</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Stored only under key <code className="text-[10px]">{STORAGE_KEY}</code>
            </p>
            <button
              type="button"
              className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm font-medium"
              onClick={() => overlayInputRef.current?.click()}
            >
              + Upload overlay PNG
            </button>
            <input
              ref={overlayInputRef}
              type="file"
              accept="image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => void onOverlayFiles(e.target.files)}
            />
          </div>

          <ul className="max-h-48 space-y-1 overflow-y-auto">
            {library.length === 0 && (
              <li className="text-xs text-muted-foreground">
                No overlays yet. Upload transparent PNGs (logo, Afterpay, badge…).
              </li>
            )}
            {library.map((item) => (
              <li
                key={item.id}
                className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${
                  selectedId === item.id
                    ? "border-accent bg-accent/10"
                    : "border-border"
                }`}
              >
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  onClick={() => setSelectedId(item.id)}
                >
                  <img
                    src={item.src}
                    alt=""
                    className="h-8 w-8 shrink-0 object-contain"
                  />
                  <span className="truncate text-xs font-medium">{item.name}</span>
                </button>
                <button
                  type="button"
                  className="shrink-0 rounded px-1.5 text-xs text-muted-foreground hover:text-red-600"
                  aria-label={`Delete ${item.name}`}
                  onClick={() => deleteOverlay(item.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

          <div className="space-y-2 border-t border-border pt-3">
            <label className="block text-xs font-medium">Corner</label>
            <div className="grid grid-cols-2 gap-1">
              {(["tl", "tr", "bl", "br"] as Corner[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`rounded-md border px-2 py-1.5 text-xs uppercase ${
                    corner === c
                      ? "border-accent bg-accent/15 font-semibold"
                      : "border-border"
                  }`}
                  onClick={() => setCorner(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <label className="mt-2 block text-xs font-medium">
              Size {Math.round(scale * 100)}%
            </label>
            <input
              type="range"
              min={0.1}
              max={0.45}
              step={0.01}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full"
            />
            <button
              type="button"
              className="w-full rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground"
              onClick={addPlaced}
            >
              Add overlay to canvas
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
