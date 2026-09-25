import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { BrandLogo } from "@/components/brand-logo";
import { PcBuilder, ASSEMBLY, WIN_HOME, WIN_PRO } from "@/components/pc-builder";
import { nzd } from "@/lib/products";

export const Route = createFileRoute("/build")({
  component: BuildPage,
  head: () => ({
    meta: [
      { title: "PC Builder · Looters Computas" },
      {
        name: "description",
        content: "Pick the parts, watch the cartoon PC go together, and tally the total in NZD.",
      },
    ],
  }),
});

function BuildPage() {
  const [pasteOpen, setPasteOpen] = useState(false);
  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-4 py-8">
        <header className="builder-brand">
          <BrandLogo className="h-20 w-auto max-w-[340px] object-contain sm:h-24 sm:max-w-[420px]" />
          <h1 className="builder-word">
            <span className="ol ol-white" aria-hidden="true">
              PC Builder
            </span>
            <span className="ol ol-black" aria-hidden="true">
              PC Builder
            </span>
            <span className="ol ol-teal">PC Builder</span>
          </h1>
        </header>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground">
          Pick the parts you want and the total is tallied at the end. If you want Looters Computas to assemble your system, there is a {nzd(ASSEMBLY)} assembly fee. This includes fresh{" "}
          <span className={`tip ${pasteOpen ? "is-open" : ""}`}>
            thermal paste
            <button
              type="button"
              className="tip-i"
              aria-label="What fresh thermal paste does"
              aria-expanded={pasteOpen}
              onClick={() => setPasteOpen((open) => !open)}
            >
              i
            </button>
            <span className="tip-pop" role="tooltip">
              Paste fills the microscopic gaps between the CPU and the cooler, so heat actually leaves the chip. That keeps temperatures down, lets the processor hold its speed, and stops the fans from screaming. It prevents hot spots, thermal throttling, crashes under load, and a cooked CPU from dry or uneven old paste.
            </span>
          </span>
          , a brand new CMOS battery, and construction of the system. It can take up to 5 days. That is so it is not rushed, and so we do not over-commit, sell you a dream, and then keep you waiting. Windows 11 Home is {nzd(WIN_HOME)} as a digital purchase, or Windows 11 Pro is {nzd(WIN_PRO)}, installed on the machine before it ships. We can install a Linux OS as well. Once you have completed the transaction, email any requests to{" "}
          <a href="mailto:LootersRetail@protonmail.com">LootersRetail@protonmail.com</a>.
        </p>
        <PcBuilder />
      </section>
    </AppShell>
  );
}
