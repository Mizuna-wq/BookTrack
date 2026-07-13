// components/SortFilterBar.js
// Toolbar sorting: urut A-Z, Z-A, terpopuler (edisi terbanyak),
// dan terbaru (tahun terbit tertinggi).
"use client";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "az", label: "A → Z" },
  { value: "za", label: "Z → A" },
  { value: "popular", label: "Terpopuler" },
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Tertua" },
  { value: "rating", label: "Rating ★" },
];

export default function SortFilterBar({ sort, onSortChange, totalFound, currentCount }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Kiri: info jumlah buku */}
      {totalFound > 0 && (
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink/50 dark:text-paper/50">
          Menampilkan{" "}
          <span className="text-ink dark:text-paper font-semibold">
            {currentCount}
          </span>{" "}
          dari{" "}
          <span className="text-ink dark:text-paper font-semibold">
            {totalFound.toLocaleString()}
          </span>{" "}
          buku
        </p>
      )}

      {/* Kanan: dropdown sort */}
      <div className="flex items-center gap-2 ml-auto">
        <label
          htmlFor="sort-select"
          className="font-mono text-[11px] uppercase tracking-wider text-ink/50 dark:text-paper/50 whitespace-nowrap"
        >
          Urutkan:
        </label>
        <div className="relative">
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none rounded-sm border border-cream bg-white py-1.5 pl-3 pr-7
              font-mono text-xs text-ink
              focus:border-forest focus:outline-none
              dark:border-ink-soft dark:bg-ink-soft dark:text-paper
              cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Custom chevron */}
          <svg
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-ink/50 dark:text-paper/50"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/**
 * Fungsi pure untuk men-sort array buku di sisi klien.
 * Dipanggil di page.js setelah data dari API masuk.
 */
export function sortBooks(books, sortMode) {
  const sorted = [...books];
  switch (sortMode) {
    case "az":
      return sorted.sort((a, b) => a.title.localeCompare(b.title, "id"));
    case "za":
      return sorted.sort((a, b) => b.title.localeCompare(a.title, "id"));
    case "popular":
      return sorted.sort(
        (a, b) => (b.editionsCount || 0) - (a.editionsCount || 0)
      );
    case "newest":
      return sorted.sort(
        (a, b) => (b.firstPublishYear || 0) - (a.firstPublishYear || 0)
      );
    case "oldest":
      return sorted.sort(
        (a, b) => (a.firstPublishYear || 9999) - (b.firstPublishYear || 9999)
      );
    case "rating":
      return sorted.sort(
        (a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0)
      );
    default:
      return sorted;
  }
}
