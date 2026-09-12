import { KeyButton } from "@/components/key-button";
import { useDenCombo } from "@/lib/den-combo";
import { scrollPage } from "@/lib/shop-nav";

export function PageScrollKeys() {
  const armed = useDenCombo((s) => s.armed);
  const bump = useDenCombo((s) => s.bump);

  return (
    <div className="pg-float" aria-label="Page scroll">
      <KeyButton
        size="sm"
        tone="orange"
        aria-label="Jump to top"
        onClick={() => scrollPage("up")}
      >
        PgUp
      </KeyButton>
      <KeyButton
        size="sm"
        tone="orange"
        aria-label="Jump to bottom"
        active={armed}
        className={armed ? "pg-armed" : undefined}
        onClick={() => {
          const locked = bump();
          if (!locked) scrollPage("down");
        }}
      >
        PgDn
      </KeyButton>
    </div>
  );
}
