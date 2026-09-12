import { Link, createFileRoute } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { LegalLinks } from "@/components/legal-links";
import { OverlayStudio } from "@/components/overlay-studio";
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

/** Minimal chrome — full wordmark, no shop BrandLogo / keyboard chrome. */
function OverlayPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-3"
            aria-label="Back to shop"
          >
            {/* Full LOOTERS COMPUTAS wordmark — not cropped */}
            <img
              src="/artwork/logo-mark.png"
              alt="Looters Computas"
              width={866}
              height={288}
              decoding="async"
              className="h-10 w-auto max-h-10 object-contain object-left sm:h-11 sm:max-h-11"
            />
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
      <footer className="border-t border-border py-6">
        <LegalLinks />
      </footer>
    </div>
  );
}
