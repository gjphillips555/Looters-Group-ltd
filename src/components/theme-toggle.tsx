import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, setTheme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-label="Light mode"
        title="F5 Light"
        data-active={!isDark ? "true" : "false"}
        className="kb-key kb-key-sm hidden md:inline-grid"
      >
        <span className="kb-cap">
          <span className="kb-dual">
            <b>F5</b>
            <i>
              <Sun className="size-3.5" />
            </i>
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-label="Dark mode"
        title="F6 Dark"
        data-active={isDark ? "true" : "false"}
        className="kb-key kb-key-sm hidden md:inline-grid"
      >
        <span className="kb-cap">
          <span className="kb-dual">
            <b>F6</b>
            <i>
              <Moon className="size-3.5" />
            </i>
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={toggle}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Light mode" : "Dark mode"}
        className="kb-key kb-key-sm md:hidden"
      >
        <span className="kb-cap">
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </span>
      </button>
    </>
  );
}
