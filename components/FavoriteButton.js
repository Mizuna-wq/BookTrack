"use client";

// Tombol favorit bergaya "pita penanda buku" (bookmark ribbon) yang
// nongol di pojok kanan atas kartu buku / halaman detail.
export default function FavoriteButton({ isFavorite, onToggle, size = "md" }) {
  const dimension = size === "lg" ? "h-11 w-9" : "h-9 w-7";

  return (
    <button
      onClick={onToggle}
      aria-label={isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}
      aria-pressed={isFavorite}
      className={`group absolute right-3 top-0 ${dimension} drop-shadow-sm`}
    >
      <svg
        viewBox="0 0 24 32"
        className={`h-full w-full transition-colors ${
          isFavorite
            ? "fill-cranberry text-cranberry"
            : "fill-white/90 text-ink/30 group-hover:text-cranberry dark:fill-ink-soft"
        }`}
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M2 0h20v31l-10-7-10 7V0z" />
      </svg>
    </button>
  );
}
