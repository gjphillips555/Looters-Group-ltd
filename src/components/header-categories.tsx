import { KeyButton, KeyLink } from "@/components/key-button";
import { useOledMode } from "@/lib/oled-mode";
import { useShopCategory } from "@/lib/shop-nav";

export function HeaderCategories() {
  const { active } = useShopCategory();
  const help = useOledMode((s) => s.help);
  const toggleHelp = useOledMode((s) => s.toggleHelp);
  const closeHelp = useOledMode((s) => s.closeHelp);

  return (
    <nav className="flex items-center gap-1" aria-label="Keyboard keys">
      <KeyLink
        to="/shop/$category"
        params={{ category: "desktops" }}
        size="sm"
        active={active === "desktops"}
        className="hidden md:inline-grid"
      >
        Dsktp
      </KeyLink>
      <KeyLink
        to="/shop/$category"
        params={{ category: "laptops" }}
        size="sm"
        active={active === "laptops"}
        className="hidden md:inline-grid"
      >
        Lptp
      </KeyLink>
      <KeyLink
        to="/shop/$category"
        params={{ category: "components" }}
        size="sm"
        active={active === "components"}
        className="hidden md:inline-grid"
      >
        Cmpnt
      </KeyLink>
      <KeyLink
        to="/"
        size="sm"
        tone="cream"
        className="hidden sm:inline-grid"
        onClick={() => closeHelp()}
      >
        Home
      </KeyLink>
      <KeyButton
        size="sm"
        tone="cream"
        active={help}
        onClick={() => toggleHelp()}
      >
        Info
      </KeyButton>
    </nav>
  );
}
