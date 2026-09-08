import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cutout")({
  component: CutoutPage,
  head: () => ({
    meta: [{ title: "Cutout — keep the subject" }],
  }),
});

function CutoutPage() {
  return (
    <iframe
      src="/cutout.html"
      title="Cutout background remover"
      className="fixed inset-0 z-50 h-dvh w-full border-0 bg-[#121018]"
    />
  );
}
