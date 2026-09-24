import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PcBuilder } from "@/components/pc-builder";

export const Route = createFileRoute("/build")({
  component: BuildPage,
  head: () => ({
    meta: [
      { title: "PC Builder · Looters Computas" },
      {
        name: "description",
        content: "Build a gaming desktop from parts we can order in New Zealand. The case spins, and parts only stay if they fit.",
      },
    ],
  }),
});

function BuildPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-display text-3xl text-[var(--kb-orange,#ff9a00)]">Gaming PC builder</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Pick a case first. Grey pictures are placeholders. Choose a part and its photo replaces the grey one, and it mounts in the case. Anything that does not fit is greyed out.
        </p>
        <PcBuilder />
      </section>
    </AppShell>
  );
}
