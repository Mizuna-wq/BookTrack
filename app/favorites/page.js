"use client";

import Link from "next/link";
import BookGrid from "@/components/BookGrid";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoritesPage() {
  const { favorites, isLoaded } = useFavorites();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="eyebrow">Koleksi pribadi</p>
        <h1 className="font-display text-3xl font-semibold text-ink dark:text-paper">
          Buku favoritmu
        </h1>
        <p className="mt-1 max-w-xl text-sm text-ink/60 dark:text-paper/60">
          Tersimpan langsung di browser ini (localStorage), jadi tidak akan
          hilang meski halaman di-refresh — tapi tidak ikut pindah kalau kamu
          ganti perangkat.
        </p>
      </div>

      <BookGrid
        books={favorites}
        isLoading={!isLoaded}
        error={null}
        emptyMessage="Belum ada buku favorit. Cari buku di beranda lalu tekan ikon pita untuk menyimpannya di sini."
      />

      {isLoaded && favorites.length === 0 && (
        <Link
          href="/"
          className="w-fit rounded-sm bg-forest px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper hover:bg-forest-light"
        >
          Jelajahi katalog →
        </Link>
      )}
    </div>
  );
}
