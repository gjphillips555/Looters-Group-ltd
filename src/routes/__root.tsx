import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";

const APP_NAME = "Looters Computas";

const FONT_CSS =
  "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Syne:wght@600;700;800&display=swap";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#ffffff" },
      {
        name: "description",
        content:
          "Looters Computas — refurbished PCs and parts online from Wellington.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: FONT_CSS },
      { rel: "stylesheet", href: appCss },
      {
        rel: "preload",
        as: "image",
        href: "/brand/logos/title.png",
        // @ts-expect-error fetchpriority is valid on link
        fetchPriority: "high",
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="grid min-h-dvh place-items-center bg-white px-6 text-ink">
      <div className="text-center">
        <p className="font-display text-4xl font-extrabold">404</p>
        <p className="mt-2 text-sm text-muted">Page not found.</p>
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
      <body className="min-h-dvh bg-white">
        <Outlet />
        <Scripts />
      </body>
    </html>
  ),
});
