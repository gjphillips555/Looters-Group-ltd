import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { WebVitalsReporter } from "@/components/web-vitals-reporter";
import appCss from "../styles.css?url";

const APP_NAME = "Looters";

const FONT_CSS =
  "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Syne:wght@600;700;800&display=swap";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#141318" },
      {
        name: "description",
        content:
          "Looters Group — Computas, Apparel and Software. Refurbished PCs in Kilbirnie, Wellington.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      // DNS + TLS warm-up before font CSS / files (LCP / text paint)
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
      { rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
      // Non-blocking font stylesheet (was a render-blocking @import in CSS)
      { rel: "stylesheet", href: FONT_CSS },
      { rel: "stylesheet", href: appCss },
      // LCP candidate: hero wordmark (home)
      {
        rel: "preload",
        as: "image",
        href: "/brand/logos/looters-computas-title.png",
        // @ts-expect-error fetchpriority is valid on link
        fetchPriority: "high",
      },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  notFoundComponent: () => (
    <main className="grid min-h-dvh place-items-center bg-paper px-6 text-ink">
      <div className="text-center">
        <p className="font-display text-4xl font-extrabold">404</p>
        <p className="mt-2 text-sm text-muted">That Looters page is not here.</p>
        <a href="/" className="mt-6 inline-block text-sm font-semibold underline">
          Home
        </a>
      </div>
    </main>
  ),
  component: () => (
    <html lang="en-NZ" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh">
        <PreviewHostBridge />
        <WebVitalsReporter />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
