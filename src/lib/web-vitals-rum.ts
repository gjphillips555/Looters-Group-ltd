/**
 * Real User Monitoring for Core Web Vitals.
 * Uses the attribution build so field reports include the element / interaction
 * that drove each metric — useful when debugging poor scores.
 */
import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from "web-vitals/attribution";

const ENDPOINT = "/api/vitals";
const STORAGE_KEY = "looters_cwv_ring";
const RING_MAX = 40;

export type VitalsPayload = {
  name: string;
  value: number;
  rating: Metric["rating"];
  delta: number;
  id: string;
  navigationType: string;
  page: string;
  href: string;
  ts: number;
  /** Attribution debug target (selector / URL snippet) when available */
  debugTarget?: string;
  attribution?: Record<string, unknown>;
};

function isDev(): boolean {
  try {
    return Boolean(import.meta.env?.DEV);
  } catch {
    return false;
  }
}

function pagePath(): string {
  if (typeof window === "undefined") return "/";
  return window.location.pathname || "/";
}

function debugTargetFrom(metric: Metric): string | undefined {
  const a = (metric as Metric & { attribution?: Record<string, unknown> }).attribution;
  if (!a) return undefined;
  const candidates = [
    a.element,
    a.largestShiftTarget,
    a.eventTarget,
    a.url,
    a.lcpEntry,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c) return c.slice(0, 200);
    if (c && typeof c === "object" && "element" in (c as object)) {
      const el = (c as { element?: string }).element;
      if (el) return String(el).slice(0, 200);
    }
  }
  return undefined;
}

function toPayload(metric: Metric): VitalsPayload {
  const attr = (metric as Metric & { attribution?: Record<string, unknown> }).attribution;
  return {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
    page: pagePath(),
    href: typeof window !== "undefined" ? window.location.href : "",
    ts: Date.now(),
    debugTarget: debugTargetFrom(metric),
    attribution: attr ? sanitizeAttribution(attr) : undefined,
  };
}

/** Keep payload small for sendBeacon */
function sanitizeAttribution(attr: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(attr)) {
    if (v == null) continue;
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      out[k] = typeof v === "string" ? v.slice(0, 240) : v;
    } else if (typeof v === "object") {
      // shallow: only primitives inside one level
      const nested: Record<string, unknown> = {};
      for (const [nk, nv] of Object.entries(v as Record<string, unknown>)) {
        if (typeof nv === "string") nested[nk] = nv.slice(0, 120);
        else if (typeof nv === "number" || typeof nv === "boolean") nested[nk] = nv;
      }
      if (Object.keys(nested).length) out[k] = nested;
    }
  }
  return out;
}

function pushLocalRing(payload: VitalsPayload) {
  try {
    const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as VitalsPayload[];
    const next = [...prev, payload].slice(-RING_MAX);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* private mode / quota */
  }
}

function send(payload: VitalsPayload) {
  pushLocalRing(payload);

  if (isDev()) {
    const unit = payload.name === "CLS" ? "" : "ms";
    // eslint-disable-next-line no-console
    console.info(
      `[CWV] ${payload.name}=${payload.value.toFixed(payload.name === "CLS" ? 3 : 0)}${unit} (${payload.rating})`,
      payload.debugTarget ? `→ ${payload.debugTarget}` : "",
      payload,
    );
  }

  const body = JSON.stringify(payload);
  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const ok = navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
      if (ok) return;
    }
  } catch {
    /* fall through */
  }

  try {
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
      credentials: "same-origin",
    });
  } catch {
    /* ignore */
  }
}

let started = false;

/** Call once on the client after hydration. */
export function startWebVitalsRum() {
  if (started || typeof window === "undefined") return;
  started = true;

  const report = (metric: Metric) => {
    send(toPayload(metric));
  };

  onLCP(report);
  onINP(report);
  onCLS(report);
  // Diagnostics (not Core Web Vitals, still useful in RUM)
  onFCP(report);
  onTTFB(report);
}

/** Read recent samples from this browser (debug helper). */
export function readLocalVitalsRing(): VitalsPayload[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as VitalsPayload[];
  } catch {
    return [];
  }
}

// Expose for console debugging on production builds
declare global {
  interface Window {
    __lootersVitals?: () => VitalsPayload[];
  }
}

if (typeof window !== "undefined") {
  window.__lootersVitals = readLocalVitalsRing;
}
