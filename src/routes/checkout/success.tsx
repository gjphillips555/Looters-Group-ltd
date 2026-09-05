import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: (s: Record<string, unknown>) => ({
    token: typeof s.token === "string" ? s.token : "",
    listingId: typeof s.listingId === "string" ? s.listingId : "",
  }),
  component: CheckoutSuccess,
});

function CheckoutSuccess() {
  const { token, listingId } = Route.useSearch();
  const [status, setStatus] = useState<"working" | "ok" | "error">("working");
  const [detail, setDetail] = useState("Confirming payment with PayPal…");
  const [captureId, setCaptureId] = useState<string | null>(null);

  useEffect(() => {
    // PayPal returns token=<orderId> on the return URL
    const orderId = token;
    if (!orderId) {
      setStatus("error");
      setDetail("Missing PayPal order token. If you paid, check your PayPal account receipt.");
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        const data = (await res.json()) as {
          status?: string;
          captureId?: string;
          amount?: string;
          error?: string;
        };
        if (cancelled) return;
        if (!res.ok) throw new Error(data.error || "Capture failed");
        setStatus("ok");
        setCaptureId(data.captureId ?? null);
        setDetail(
          data.amount
            ? `Payment of NZD ${data.amount} received (${data.status ?? "COMPLETED"}).`
            : `Payment ${data.status ?? "COMPLETED"}.`,
        );
      } catch (e) {
        if (cancelled) return;
        setStatus("error");
        setDetail(e instanceof Error ? e.message : "Could not confirm payment");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="flex min-h-dvh flex-col bg-white text-ink">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16 text-center">
        {status === "working" ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">PayPal</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold">Finishing up…</h1>
            <p className="mt-3 text-sm text-muted">{detail}</p>
          </>
        ) : null}
        {status === "ok" ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-computas">
              Thank you
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold">Payment received</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">{detail}</p>
            {listingId ? (
              <p className="mt-2 text-sm text-muted">Trade Me listing #{listingId}</p>
            ) : null}
            {captureId ? (
              <p className="mt-1 text-xs text-muted">Capture ID: {captureId}</p>
            ) : null}
            <p className="mt-6 text-sm leading-relaxed text-muted">
              We'll arrange shipping (or pickup) using the option you chose. The Trade Me listing
              will be removed once we confirm the sale on our side.
            </p>
          </>
        ) : null}
        {status === "error" ? (
          <>
            <h1 className="font-display text-3xl font-extrabold">Something went wrong</h1>
            <p className="mt-3 text-sm text-muted">{detail}</p>
            <p className="mt-4 text-sm text-muted">
              If PayPal charged you, keep the receipt — we can still fulfil the order.
            </p>
          </>
        ) : null}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/computas/shop"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-computas-hot px-6 text-sm font-semibold text-white"
          >
            Back to shop
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-line px-6 text-sm font-semibold text-ink"
          >
            Home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
