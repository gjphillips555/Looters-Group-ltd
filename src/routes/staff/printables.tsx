import { createFileRoute, Link } from "@tanstack/react-router";
import { StaffGate } from "@/components/staff-gate";

export const Route = createFileRoute("/staff/printables")({
  component: Printables,
});

function Printables() {
  return (
    <StaffGate>
      <div className="flex min-h-dvh flex-col bg-paper">
        <div className="flex items-center justify-between border-b border-line bg-cream px-4 py-2 text-sm">
          <Link to="/staff" className="font-semibold hover:underline">
            ← Hub
          </Link>
          <span className="text-muted">Printables</span>
        </div>
        <iframe
          title="Looters order documents"
          src="/tools/order-docs.html"
          className="min-h-0 w-full flex-1 border-0 bg-white"
        />
      </div>
    </StaffGate>
  );
}
