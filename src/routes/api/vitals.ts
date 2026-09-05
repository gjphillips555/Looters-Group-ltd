import { createFileRoute } from "@tanstack/react-router";

type VitalsBody = {
  name?: string;
  value?: number;
  rating?: string;
  page?: string;
  id?: string;
  debugTarget?: string;
  navigationType?: string;
  ts?: number;
};

const ALLOWED = new Set(["LCP", "INP", "CLS", "FCP", "TTFB"]);

async function handlePost(request: Request): Promise<Response> {
  // Empty body is fine (some beacons are flaky)
  let body: VitalsBody = {};
  try {
    const text = await request.text();
    if (text) body = JSON.parse(text) as VitalsBody;
  } catch {
    return new Response(null, { status: 204 });
  }

  const name = String(body.name ?? "").toUpperCase();
  if (!ALLOWED.has(name)) {
    return new Response(null, { status: 204 });
  }

  const value = typeof body.value === "number" ? body.value : Number(body.value);
  if (!Number.isFinite(value)) {
    return new Response(null, { status: 204 });
  }

  // Structured log for Vercel / hosting log drains — no PII beyond path
  const line = {
    type: "web-vital",
    name,
    value: Math.round(name === "CLS" ? value * 1000 : value) / (name === "CLS" ? 1000 : 1),
    rating: body.rating ?? "unknown",
    page: String(body.page ?? "/").slice(0, 200),
    navigationType: body.navigationType ?? "",
    debugTarget: body.debugTarget ? String(body.debugTarget).slice(0, 200) : undefined,
    id: body.id,
    ts: body.ts ?? Date.now(),
  };

  console.info("[web-vitals]", JSON.stringify(line));

  return new Response(null, {
    status: 204,
    headers: {
      "cache-control": "no-store",
      "access-control-allow-origin": "same-origin",
    },
  });
}

export const Route = createFileRoute("/api/vitals")({
  server: {
    handlers: {
      POST: ({ request }) => handlePost(request),
      // Some agents probe with GET — stay quiet
      GET: () =>
        Response.json(
          {
            ok: true,
            metrics: ["LCP", "INP", "CLS", "FCP", "TTFB"],
            note: "POST JSON beacons from the web-vitals client",
          },
          { headers: { "cache-control": "no-store" } },
        ),
      OPTIONS: () =>
        new Response(null, {
          status: 204,
          headers: {
            "access-control-allow-methods": "POST, GET, OPTIONS",
            "access-control-allow-headers": "content-type",
            "access-control-max-age": "86400",
          },
        }),
    },
  },
});
