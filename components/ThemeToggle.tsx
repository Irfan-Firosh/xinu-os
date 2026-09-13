"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Flips between the two explicit themes. The un-stamped default follows the
 * operating system, so the first click is resolved against what is on screen
 * rather than against a stored value.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stamped = document.documentElement.getAttribute("data-theme");
    if (stamped === "dark" || stamped === "light") {
      setTheme(stamped);
      return;
    }
    setTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    );
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* Private windows and blocked site data: the choice just will not persist. */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch colour theme"
      className="rounded px-2 py-1.5 font-mono text-[0.7rem] uppercase tracking-widest text-muted transition-colors hover:text-ink"
    >
      {theme === "dark" ? "light" : "dark"}
    </button>
  );
}
