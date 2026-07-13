"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "booktrack:favorites";

// Catatan buat kamu (mirip $_SESSION di PHP, tapi ini murni di browser):
// localStorage cuma bisa diakses setelah komponen ter-mount di client,
// makanya kita baca datanya di dalam useEffect, bukan langsung saat
// useState(...) dijalankan. Kalau langsung dibaca saat render pertama,
// Next.js bakal error karena di server tidak ada objek `window`.

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Muat data favorit dari localStorage sekali saat pertama kali render
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      setFavorites(stored ? JSON.parse(stored) : []);
    } catch (err) {
      console.error("Gagal membaca data favorit:", err);
      setFavorites([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Setiap kali `favorites` berubah, simpan ulang ke localStorage
  useEffect(() => {
    if (!isLoaded) return; // hindari menimpa data sebelum selesai load
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (err) {
      console.error("Gagal menyimpan data favorit:", err);
    }
  }, [favorites, isLoaded]);

  const isFavorite = useCallback(
    (bookId) => favorites.some((b) => b.id === bookId),
    [favorites]
  );

  const toggleFavorite = useCallback((book) => {
    setFavorites((prev) => {
      const exists = prev.some((b) => b.id === book.id);
      if (exists) {
        return prev.filter((b) => b.id !== book.id);
      }
      return [...prev, book];
    });
  }, []);

  return { favorites, isFavorite, toggleFavorite, isLoaded };
}
