import { createFileRoute, Link } from "@tanstack/react-router";
import { StaffGate } from "@/components/staff-gate";

export const Route = createFileRoute("/staff/overlay")({ component: Overlay });

function Overlay() {
  return (
    <StaffGate>
      <div className="flex min-h-dvh flex-col bg-ink">
        <div className="flex items-center justify-between border-b border-cream/10 bg-ink px-4 py-2 text-sm text-cream">
          <Link to="/staff" className="font-semibold hover:underline">
            ← Hub
          </Link>
          <span className="text-cream/60">Overlay tool</span>
        </div>
        <iframe
          title="Looters overlay tool"
          src="/tools/overlay.html"
          className="min-h-0 w-full flex-1 border-0 bg-ink"
        />
      </div>
    </StaffGate>
  );
}
