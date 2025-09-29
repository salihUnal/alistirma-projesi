import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialIsDark = saved ? saved === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", initialIsDark);
    setIsDark(initialIsDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-md border
                 border-slate-300 dark:border-slate-700
                 bg-white dark:bg-slate-700
                 px-4 py-2 text-sm
                 text-slate-700 dark:text-slate-100
                 hover:bg-gray-400 dark:hover:bg-slate-900 transition  "
      aria-label="Tema değiştir"
    >
      {isDark ? "Açık Tema" : "Karanlık Tema"}
    </button>
  );
}
