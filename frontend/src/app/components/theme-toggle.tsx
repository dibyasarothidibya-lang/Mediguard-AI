"use client";

import { useLayoutEffect } from "react";

type Theme = "light" | "dark";

function getPreferredTheme(): Theme {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function ThemeToggle() {
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = getPreferredTheme();
  }, []);

  function toggleTheme() {
    const currentTheme =
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
  }

  return (
    <button
      data-motion="button"
      type="button"
      aria-label="Toggle color theme"
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition-colors hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
    >
      <svg
        aria-hidden="true"
        className="hidden h-5 w-5 text-slate-600 dark:block dark:text-neutral-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <svg
        aria-hidden="true"
        className="block h-5 w-5 text-slate-600 dark:hidden dark:text-neutral-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
  );
}
