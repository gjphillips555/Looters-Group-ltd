import { Link, createFileRoute } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { OverlayStudio } from "@/components/overlay-studio";
import { BrandLogo } from "@/components/brand-logo";
import { useTheme } from "@/lib/theme";

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

/** Plain theme control — no shop keyboard (F5/F6) styling. */
function PlainThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

/** Minimal chrome — no cart, no search, no keyboard keys, no catalog. */
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
            <PlainThemeToggle />
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
