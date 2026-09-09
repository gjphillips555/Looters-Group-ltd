import { Link, createFileRoute } from "@tanstack/react-router";
import { OverlayStudio } from "@/components/overlay-studio";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/overlay")({
  component: OverlayPage,
  head: () => ({
    meta: [
      { title: "Overlay Studio · Looters Computas" },
      {
        name: "description",
        content:
          "Prepare listing images with overlays. Separate from the shop — local browser only.",
      },
    ],
  }),
});

/** Minimal chrome — no cart, no search, no catalog. Keeps Overlay fully separate from the store. */
function OverlayPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Back to shop">
            <BrandLogo className="h-9 w-auto max-w-[160px] object-contain" />
          </Link>
          <span className="hidden text-xs font-medium uppercase tracking-wider text-muted-foreground sm:inline">
            Overlay Studio
          </span>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/"
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary"
            >
              ← Shop
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <OverlayStudio />
      </main>
    </div>
  );
}
