"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "booktrack:theme"; // value: "dark" | "light"

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  // Saat pertama kali mount, cek preferensi tersimpan, lalu fallback
  // ke preferensi sistem operasi pengguna (prefers-color-scheme)
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const shouldBeDark = stored ? stored === "dark" : systemPrefersDark;
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
      return next;
    });
  };

  return { isDark, toggle };
}
