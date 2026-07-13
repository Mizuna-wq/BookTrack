// components/Pagination.js
// Komponen navigasi halaman dengan tombol prev/next dan nomor halaman.
// Menampilkan halaman tengah + elipsis agar tidak overflow saat total halaman banyak.
"use client";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Bangun daftar page number yang akan ditampilkan
  function buildPages() {
    const pages = [];
    const delta = 1; // halaman di kiri/kanan halaman aktif

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (rangeStart > 2) pages.push("...");

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  }

  const pages = buildPages();

  const btnBase =
    "flex h-8 min-w-[2rem] items-center justify-center rounded-sm px-2 font-mono text-xs " +
    "transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed";
  const btnActive =
    "bg-forest text-paper";
  const btnInactive =
    "border border-cream text-ink/70 hover:border-forest hover:text-forest " +
    "dark:border-ink-soft dark:text-paper/70 dark:hover:border-forest dark:hover:text-forest";

  return (
    <nav
      aria-label="Navigasi halaman"
      className="flex items-center justify-center gap-1.5 pt-4"
    >
      {/* Prev */}
      <button
        id="pagination-prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Halaman sebelumnya"
        className={`${btnBase} ${btnInactive} gap-1`}
      >
        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 4L6 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Prev
      </button>

      {/* Nomor halaman */}
      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex h-8 w-8 items-center justify-center font-mono text-xs text-ink/40 dark:text-paper/40"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            id={`pagination-page-${page}`}
            onClick={() => onPageChange(page)}
            aria-label={`Halaman ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={`${btnBase} ${page === currentPage ? btnActive : btnInactive}`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        id="pagination-next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Halaman berikutnya"
        className={`${btnBase} ${btnInactive} gap-1`}
      >
        Next
        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </nav>
  );
}
