"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DarkModeToggle from "./DarkModeToggle";
import { useFavorites } from "@/hooks/useFavorites";

export default function Navbar() {
  const pathname = usePathname();
  const { favorites, isLoaded } = useFavorites();

  return (
    <header className="sticky top-0 z-10 border-b border-cream bg-paper/90 backdrop-blur dark:border-ink-soft dark:bg-ink/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-forest font-display text-sm font-bold text-paper">
            B
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink dark:text-paper">
            BookShelf
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/favorites"
            className={`flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              pathname === "/favorites"
                ? "text-cranberry"
                : "text-ink/70 hover:text-cranberry dark:text-paper/70"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill={pathname === "/favorites" ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
            >
              <path d="M12 21s-7.5-4.7-10-9.3C.3 8 2 4.5 5.6 4c2-.3 3.9.6 4.4 2.2C10.5 4.6 12.4 3.7 14.4 4c3.6.5 5.3 4 3.6 7.7C15.5 16.3 12 21 12 21z" />
            </svg>
            Favorit
            {isLoaded && favorites.length > 0 && (
              <span className="rounded-full bg-cranberry px-1.5 py-0.5 text-[10px] text-paper">
                {favorites.length}
              </span>
            )}
          </Link>
          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
}
