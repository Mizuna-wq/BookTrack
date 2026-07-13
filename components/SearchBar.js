"use client";

import { useState } from "react";

// Komponen ini "controlled": nilai input disimpan di state lokal (query),
// tapi pencarian aktual baru dikirim ke parent lewat onSearch saat submit.
// Ini mirip <form method="GET"> di PHP yang baru proses saat disubmit,
// bukan auto-search di setiap ketikan (biar tidak spam API).
export default function SearchBar({ onSearch, initialValue = "" }) {
  const [query, setQuery] = useState(initialValue);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(query.trim());
  }

  function handleClear() {
    setQuery("");
    onSearch("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl gap-2">
      <div className="relative flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4
            -translate-y-1/2 text-ink/40 dark:text-paper/40"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari judul buku..."
          aria-label="Cari judul buku"
          className="w-full rounded-sm border border-cream bg-white py-2 pl-9 pr-8
            font-body text-sm text-ink placeholder:text-ink/40
            focus:border-forest focus:outline-none
            dark:border-ink-soft dark:bg-ink-soft dark:text-paper dark:placeholder:text-paper/40"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Hapus pencarian"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-ink/40
              hover:text-ink dark:text-paper/40 dark:hover:text-paper"
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="submit"
        className="rounded-sm bg-forest px-4 py-2 font-mono text-xs uppercase
          tracking-wide text-paper transition-colors hover:bg-forest-light"
      >
        Cari
      </button>
    </form>
  );
}
