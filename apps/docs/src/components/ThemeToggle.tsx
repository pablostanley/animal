"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="h-9 w-24 rounded-md border border-black/10 bg-black/5 text-sm text-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:focus-visible:ring-white/30"
        aria-label="Toggle theme"
        disabled
      >
        Theme
      </button>
    );
  }

  const resolved = theme === "system" ? systemTheme : theme;
  const next = resolved === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="h-9 rounded-md border border-black/10 bg-black/5 px-3 text-sm text-black/70 hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 dark:focus-visible:ring-white/30"
      onClick={() => setTheme(next)}
      aria-label="Toggle theme"
    >
      {resolved === "dark" ? "Dark" : "Light"}
    </button>
  );
}
