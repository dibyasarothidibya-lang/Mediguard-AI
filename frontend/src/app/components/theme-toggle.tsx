"use client";

import { useEffect } from "react";

export default function ThemeToggle() {
  useEffect(() => {
    try {
      localStorage.removeItem("theme");
      document.documentElement.dataset.theme = "light";
      document.documentElement.classList.remove("dark");
    } catch {
      // Ignore
    }
  }, []);

  return null;
}
