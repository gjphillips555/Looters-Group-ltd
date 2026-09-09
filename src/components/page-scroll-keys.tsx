import { KeyButton } from "@/components/key-button";
import { scrollPage } from "@/lib/shop-nav";

export function PageScrollKeys() {
  return (
    <div className="pg-float" aria-label="Page scroll">
      <KeyButton
        size="sm"
        tone="cream"
        aria-label="Jump to top"
        onClick={() => scrollPage("up")}
      >
        PgUp
      </KeyButton>
      <KeyButton
        size="sm"
        aria-label="Jump to bottom"
        onClick={() => scrollPage("down")}
      >
        PgDn
      </KeyButton>
    </div>
  );
}
