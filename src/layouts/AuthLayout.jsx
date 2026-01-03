import { Outlet } from "react-router-dom";
import { useTheme } from "../context/theme/useTheme";

export default function AuthLayout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkBg">
      {/* Navbar */}
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold text-primary">🎧 SoundNest</h1>

        <button
          onClick={toggleTheme}
          className="
            px-4 py-2 rounded-lg
            bg-gray-800 text-white border border-gray-600
            hover:bg-gray-700 transition
          "
        >
          {theme === "dark" ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Page Content */}
      <div className="flex items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
