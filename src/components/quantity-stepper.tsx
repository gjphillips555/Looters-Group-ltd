import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  size = "md",
  max = 99,
}: {
  value: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
  max?: number;
}) {
  const btn = size === "sm" ? "size-9" : "size-11";
  const atMax = value >= max;

  return (
    <div className="inline-flex items-center rounded-md border border-border bg-secondary/40">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(value - 1)}
        className={cn(
          btn,
          "grid place-items-center rounded-l-md text-foreground transition-colors hover:bg-secondary",
        )}
      >
        <Minus className="size-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label="Quantity"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-10 bg-transparent text-center text-sm font-medium tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        disabled={atMax}
        className={cn(
          btn,
          "grid place-items-center rounded-r-md text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
