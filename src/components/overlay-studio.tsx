import { useCallback, useEffect, useRef, useState } from "react";

/** Canvas export size for Trade Me / listing images */
const OUT_W = 2048;
const OUT_H = 1536;
/** White frame around the product — 12% each side so the shot never kisses the edge */
const PAD = 0.12;
const STORAGE_KEY = "looters-overlay-studio-v1";
/** JPEG quality — sharp enough for listings, small files for load speed */
const JPEG_QUALITY = 0.88;
const HEADER_LOGO = "/artwork/logo-orange.png";

type Corner = "tl" | "tc" | "tr" | "lc" | "rc" | "bl" | "bc" | "br";

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

type QueueItem = {
  id: string;
  name: string;
  url: string;
};

const SPOTS: ({ id: Corner; label: string } | null)[] = [
  { id: "tl", label: "Top left" },
  { id: "tc", label: "Top centre" },
  { id: "tr", label: "Top right" },
  { id: "lc", label: "Left centre" },
  null,
  { id: "rc", label: "Right centre" },
  { id: "bl", label: "Bottom left" },
  { id: "bc", label: "Bottom centre" },
  { id: "br", label: "Bottom right" },
];

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

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Read failed"));
    reader.readAsDataURL(blob);
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
    case "tc":
      return { x: (canvasW - drawW) / 2, y: margin };
    case "tl":
      return { x: margin, y: margin };
    case "lc":
      return { x: margin, y: (canvasH - drawH) / 2 };
    case "rc":
      return { x: canvasW - drawW - margin, y: (canvasH - drawH) / 2 };
    case "bc":
      return { x: (canvasW - drawW) / 2, y: canvasH - drawH - margin };
  }
}

function paintListing(
  ctx: CanvasRenderingContext2D,
  product: HTMLImageElement | null,
  overlays: { img: HTMLImageElement; corner: Corner; scale: number }[],
) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, OUT_W, OUT_H);
  if (product) {
    const padX = Math.round(OUT_W * PAD);
    const padY = Math.round(OUT_H * PAD);
    const innerW = OUT_W - padX * 2;
    const innerH = OUT_H - padY * 2;
    const ratio = Math.min(innerW / product.naturalWidth, innerH / product.naturalHeight);
    const dw = product.naturalWidth * ratio;
    const dh = product.naturalHeight * ratio;
    const dx = padX + (innerW - dw) / 2;
    const dy = padY + (innerH - dh) / 2;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.18)";
    ctx.shadowBlur = 36;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;
    ctx.drawImage(product, dx, dy, dw, dh);
    ctx.restore();
    ctx.drawImage(product, dx, dy, dw, dh);
  }
  const margin = Math.round(OUT_W * PAD);
  for (const overlay of overlays) {
    const ow = OUT_W * overlay.scale;
    const oh = overlay.img.height * (ow / overlay.img.width);
    const { x, y } = cornerXY(overlay.corner, OUT_W, OUT_H, ow, oh, margin);
    ctx.drawImage(overlay.img, x, y, ow, oh);
  }
}

function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (const b of data) {
    c ^= b;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ ((c & 1) ? 0xedb88320 : 0);
  }
  return (c ^ 0xffffffff) >>> 0;
}

/** Uncompressed zip. Listing JPEGs are already compressed. */
function zipStore(files: { name: string; data: Uint8Array }[]): Blob {
  const chunks: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  const enc = new TextEncoder();
  for (const file of files) {
    const name = enc.encode(file.name);
    const crc = crc32(file.data);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, file.data.length, true);
    local.setUint32(22, file.data.length, true);
    local.setUint16(26, name.length, true);
    const localBytes = new Uint8Array(local.buffer);
    chunks.push(localBytes, name, file.data);
    const cen = new DataView(new ArrayBuffer(46));
    cen.setUint32(0, 0x02014b50, true);
    cen.setUint16(4, 20, true);
    cen.setUint16(6, 20, true);
    cen.setUint32(16, crc, true);
    cen.setUint32(20, file.data.length, true);
    cen.setUint32(24, file.data.length, true);
    cen.setUint16(28, name.length, true);
    cen.setUint32(42, offset, true);
    central.push(new Uint8Array(cen.buffer), name);
    offset += localBytes.length + name.length + file.data.length;
  }
  const centralSize = central.reduce((n, part) => n + part.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, centralSize, true);
  end.setUint32(16, offset, true);
  return new Blob([...chunks.map(asBuffer), ...central.map(asBuffer), end.buffer], { type: "application/zip" });
}

function asBuffer(data: Uint8Array): ArrayBuffer {
  return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
}

function safeName(name: string) {
  const base = name.replace(/\.[^.]+$/, "").replace(/[^\w.-]+/g, "_") || "product";
  return `${base}_looters.jpg`;
}

export function OverlayStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const productInputRef = useRef<HTMLInputElement>(null);
  const overlayInputRef = useRef<HTMLInputElement>(null);

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [library, setLibrary] = useState<OverlayItem[]>([]);
  const [placed, setPlaced] = useState<PlacedOverlay[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [headerLogo, setHeaderLogo] = useState<string | null>(null);
  const [stampLogo, setStampLogo] = useState(true);
  const [spots, setSpots] = useState<Corner[]>(["bc"]);
  const [scale, setScale] = useState(0.34);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Upload product photos. The header logo is stamped on all of them.");

  const active = queue.find((item) => item.id === activeId) ?? queue[0] ?? null;

  useEffect(() => {
    setLibrary(loadOverlays());
  }, []);

  useEffect(() => {
    let cancel = false;
    void (async () => {
      try {
        const res = await fetch(HEADER_LOGO);
        if (!res.ok) throw new Error(String(res.status));
        const src = await blobToDataUrl(await res.blob());
        if (!cancel) setHeaderLogo(src);
      } catch {
        if (!cancel) setStatus("Could not load the header logo.");
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  const redraw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = OUT_W;
    canvas.height = OUT_H;
    try {
      const product = active ? await loadImage(active.url) : null;
      const overlays: { img: HTMLImageElement; corner: Corner; scale: number }[] = [];
      if (stampLogo && headerLogo) {
        const img = await loadImage(headerLogo);
        for (const spot of spots) overlays.push({ img, corner: spot, scale });
      }
      for (const p of placed) {
        const item = library.find((o) => o.id === p.overlayId);
        if (!item) continue;
        overlays.push({ img: await loadImage(item.src), corner: p.corner, scale: p.scale });
      }
      paintListing(ctx, product, overlays);
    } catch {
      setStatus("Could not draw product image.");
    }
  }, [active, stampLogo, headerLogo, spots, scale, placed, library]);

  useEffect(() => {
    void redraw();
  }, [redraw]);

  async function onProductFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      const added: QueueItem[] = [];
      for (const file of Array.from(files)) {
        added.push({
          id: crypto.randomUUID(),
          name: file.name.replace(/\.[^.]+$/, "") || "product",
          url: await fileToDataUrl(file),
        });
      }
      setQueue((prev) => [...prev, ...added]);
      setActiveId(added[0].id);
      setStatus(`Queued ${added.length} photo${added.length === 1 ? "" : "s"}. Stamp downloads a zip.`);
    } catch {
      setStatus("Could not read those files.");
    } finally {
      setBusy(false);
      if (productInputRef.current) productInputRef.current.value = "";
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
      setStatus(`Saved ${files.length} extra overlay(s) to this browser only.`);
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

  function toggleSpot(id: Corner) {
    setSpots((prev) => (prev.includes(id) ? prev.filter((spot) => spot !== id) : [...prev, id]));
  }

  function addPlaced() {
    if (!selectedId) {
      setStatus("Pick an extra overlay first.");
      return;
    }
    if (spots.length === 0) {
      setStatus("Tick at least one stamp position.");
      return;
    }
    setPlaced((prev) => [...prev, ...spots.map((spot) => ({ overlayId: selectedId, corner: spot, scale }))]);
    setStatus("Extra overlay added at each ticked position.");
  }

  function clearPlaced() {
    setPlaced([]);
    setStatus("Cleared extra overlays. Header logo stays.");
  }

  async function renderItem(item: QueueItem): Promise<Blob> {
    const canvas = document.createElement("canvas");
    canvas.width = OUT_W;
    canvas.height = OUT_H;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No canvas");
    const overlays: { img: HTMLImageElement; corner: Corner; scale: number }[] = [];
    if (stampLogo && headerLogo) {
      const img = await loadImage(headerLogo);
      for (const spot of spots) overlays.push({ img, corner: spot, scale });
    }
    for (const p of placed) {
      const extra = library.find((o) => o.id === p.overlayId);
      if (!extra) continue;
      overlays.push({ img: await loadImage(extra.src), corner: p.corner, scale: p.scale });
    }
    paintListing(ctx, await loadImage(item.url), overlays);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
    if (!blob) throw new Error("Export failed");
    return blob;
  }

  function saveBlob(blob: Blob, filename: string) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function stampAll() {
    if (!queue.length) {
      setStatus("Upload product photos first.");
      return;
    }
    if (stampLogo && !headerLogo) {
      setStatus("Header logo is still loading.");
      return;
    }
    if (stampLogo && spots.length === 0) {
      setStatus("Tick at least one stamp position.");
      return;
    }
    setBusy(true);
    try {
      const files: { name: string; data: Uint8Array }[] = [];
      const used = new Set<string>();
      for (let i = 0; i < queue.length; i++) {
        const item = queue[i];
        setStatus(`Stamping ${i + 1} of ${queue.length}…`);
        const blob = await renderItem(item);
        let name = safeName(item.name);
        if (used.has(name)) name = safeName(`${item.name}-${i + 1}`);
        used.add(name);
        files.push({ name, data: new Uint8Array(await blob.arrayBuffer()) });
      }
      if (files.length === 1) {
        saveBlob(new Blob([asBuffer(files[0].data)], { type: "image/jpeg" }), files[0].name);
        setStatus(`Downloaded ${files[0].name}.`);
      } else {
        saveBlob(zipStore(files), "looters-listings.zip");
        setStatus(`Downloaded looters-listings.zip with ${files.length} stamped photos.`);
      }
    } catch {
      setStatus("Stamping failed on one of the photos.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Overlay Studio
        </h1>
        <p className="text-sm text-muted-foreground">
          Upload one photo or a whole pile. Every shot is framed and stamped with the header logo, then saved as a zip. Nothing is written into the shop catalog.
        </p>
        <p className="text-xs text-muted-foreground">{status}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-white p-0 shadow-sm">
            <canvas
              ref={canvasRef}
              width={OUT_W}
              height={OUT_H}
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
              Upload photos
            </button>
            <button
              type="button"
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold disabled:opacity-50"
              disabled={busy || queue.length === 0}
              onClick={() => void stampAll()}
            >
              Stamp {queue.length > 1 ? `${queue.length} photos` : "and download"}
            </button>
            <button
              type="button"
              className="rounded-lg border border-border px-4 py-2 text-sm"
              onClick={() => {
                setQueue([]);
                setActiveId(null);
                setStatus("Cleared the photo queue.");
              }}
            >
              Clear photos
            </button>
          </div>
          {queue.length > 0 && (
            <ul className="flex max-h-28 flex-wrap gap-1 overflow-y-auto">
              {queue.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`rounded-md border px-2 py-1 text-xs ${
                      active?.id === item.id ? "border-accent bg-accent/15 font-semibold" : "border-border"
                    }`}
                    onClick={() => setActiveId(item.id)}
                  >
                    {index + 1}. {item.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <fieldset className="space-y-2 rounded-xl border border-border p-3">
            <legend className="px-1 text-xs font-semibold">Stamp positions</legend>
            <p className="text-xs text-muted-foreground">Tick any. Each photo in the batch gets the logo in every ticked spot.</p>
            <div className="grid grid-cols-3 gap-1.5">
              {SPOTS.map((spot, index) =>
                spot ? (
                  <label
                    key={spot.id}
                    className={`flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs ${
                      spots.includes(spot.id) ? "border-accent bg-accent/15 font-semibold" : "border-border"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={spots.includes(spot.id)}
                      onChange={() => toggleSpot(spot.id)}
                    />
                    {spot.label}
                  </label>
                ) : (
                  <span key={`gap-${index}`} />
                ),
              )}
            </div>
            <label className="block text-xs font-medium">Size {Math.round(scale * 100)}%</label>
            <input
              type="range"
              min={0.12}
              max={0.5}
              step={0.01}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full"
            />
          </fieldset>
          <input
            ref={productInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => void onProductFiles(e.target.files)}
          />
        </div>

        <aside className="space-y-4 rounded-xl border border-border bg-card p-4">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold">Header logo</h2>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={stampLogo} onChange={(e) => setStampLogo(e.target.checked)} />
              Stamp it on every photo
            </label>
            {headerLogo ? (
              <img src={headerLogo} alt="" className="h-10 w-auto object-contain" />
            ) : (
              <p className="text-xs text-muted-foreground">Loading logo…</p>
            )}
          </div>

          <div className="space-y-2 border-t border-border pt-3">
            <h2 className="text-sm font-semibold">Extra overlays</h2>
            <p className="text-xs text-muted-foreground">Optional. Afterpay or a badge, on top of the logo.</p>
            <button
              type="button"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm font-medium"
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
            <ul className="max-h-36 space-y-1 overflow-y-auto">
              {library.length === 0 && (
                <li className="text-xs text-muted-foreground">None saved in this browser.</li>
              )}
              {library.map((item) => (
                <li
                  key={item.id}
                  className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${
                    selectedId === item.id ? "border-accent bg-accent/10" : "border-border"
                  }`}
                >
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    onClick={() => setSelectedId(item.id)}
                  >
                    <img src={item.src} alt="" className="h-8 w-8 shrink-0 object-contain" />
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
            <button
              type="button"
              className="w-full rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground"
              onClick={addPlaced}
            >
              Add extra overlay
            </button>
            <button type="button" className="w-full rounded-lg border border-border px-3 py-2 text-xs" onClick={clearPlaced}>
              Clear extra overlays
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
