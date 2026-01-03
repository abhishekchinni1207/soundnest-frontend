import { memo } from "react";
import { useTheme } from "../context/theme/useTheme";

const ThemeToggle = memo(function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle theme"
      className="
        px-3 py-2 rounded-lg
        border border-accent
        text-accent
        hover:bg-accent hover:text-black
        focus:outline-none focus:ring-2 focus:ring-accent
        transition
      "
    >
      {theme === "dark" ? "☀ Light" : "🌙 Dark"}
    </button>
  );
});

export default ThemeToggle;
