import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/keys")({
  component: () => (
    <iframe
      src="/keys-mock.html"
      title="Category key mock"
      className="fixed inset-0 z-50 h-dvh w-full border-0 bg-[#16121c]"
    />
  ),
  head: () => ({ meta: [{ title: "Category keys mock" }] }),
});
