"use client";

import { useEffect, useState, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import BookGrid from "@/components/BookGrid";
import SortFilterBar, { sortBooks } from "@/components/SortFilterBar";
import Pagination from "@/components/Pagination";
import { getPopularBooks, searchBooks } from "@/lib/openlibrary";

// "Rak" buku yang bisa dipilih untuk mode jelajah (bukan hasil pencarian).
// Nilainya harus cocok dengan nama subject di Open Library.
const SHELVES = [
  { label: "Fiksi", subject: "fiction" },
  { label: "Fantasi", subject: "fantasy" },
  { label: "Misteri", subject: "mystery" },
  { label: "Romansa", subject: "romance" },
  { label: "Sains", subject: "science" },
  { label: "Thriller", subject: "thriller" },
  { label: "Horor", subject: "horror" },
  { label: "Biografi", subject: "biography" },
  { label: "Sejarah", subject: "history" },
  { label: "Filsafat", subject: "philosophy" },
  { label: "Psikologi", subject: "psychology" },
  { label: "Self-Help", subject: "self-help" },
  { label: "Anak-anak", subject: "children" },
  { label: "Komik", subject: "comics" },
  { label: "Memasak", subject: "cooking" },
  { label: "Perjalanan", subject: "travel" },
  { label: "Seni", subject: "art" },
  { label: "Puisi", subject: "poetry" },
  { label: "Bisnis", subject: "business" },
  { label: "Klasik", subject: "classics" },
];

const PAGE_SIZE = 20; // jumlah buku per halaman

export default function HomePage() {
  const [shelf, setShelf] = useState(SHELVES[0].subject);
  const [query, setQuery] = useState("");
  const [rawBooks, setRawBooks] = useState([]);   // data mentah dari API
  const [totalFound, setTotalFound] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sorting & pagination — state ini murni sisi klien
  const [sort, setSort] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const isSearchMode = query.trim().length > 0;

  // Hitung offset berdasarkan halaman saat ini
  const offset = (currentPage - 1) * PAGE_SIZE;

  useEffect(() => {
    let isCancelled = false;

    async function loadBooks() {
      setIsLoading(true);
      setError(null);
      try {
        const result = isSearchMode
          ? await searchBooks(query, PAGE_SIZE, offset)
          : await getPopularBooks(shelf, PAGE_SIZE, offset);

        if (!isCancelled) {
          setRawBooks(result.books);
          setTotalFound(result.totalFound);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || "Terjadi kesalahan saat mengambil data.");
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadBooks();

    return () => {
      isCancelled = true;
    };
  }, [shelf, query, isSearchMode, offset]);

  // Reset ke halaman 1 saat query / shelf / sort berubah
  function handleSearch(q) {
    setQuery(q);
    setCurrentPage(1);
  }

  function handleShelfChange(subject) {
    setShelf(subject);
    setCurrentPage(1);
    setSort("default");
  }

  function handleSortChange(newSort) {
    setSort(newSort);
    setCurrentPage(1);
  }

  function handlePageChange(page) {
    setCurrentPage(page);
    // Scroll halus ke atas konten setelah ganti halaman
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Sorting dilakukan di sisi klien pada data halaman yang sudah di-fetch
  const displayedBooks = useMemo(() => sortBooks(rawBooks, sort), [rawBooks, sort]);

  const totalPages = Math.ceil(totalFound / PAGE_SIZE);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div>
          <p className="eyebrow">Katalog</p>
          <h1 className="font-display text-3xl font-semibold text-ink dark:text-paper sm:text-4xl">
            Jelajahi buku, simpan yang kamu suka
          </h1>
          <p className="mt-1 max-w-xl text-sm text-ink/60 dark:text-paper/60">
            Data diambil langsung dari Open Library. Klik kartu buku untuk
            lihat detail, atau tekan ikon pita untuk menandai favorit.
          </p>
        </div>

        <SearchBar onSearch={handleSearch} initialValue={query} />

        {!isSearchMode && (
          <div className="flex flex-wrap gap-2">
            {SHELVES.map((s) => (
              <button
                key={s.subject}
                onClick={() => handleShelfChange(s.subject)}
                className={`rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wide transition-colors ${
                  shelf === s.subject
                    ? "border-forest bg-forest text-paper"
                    : "border-cream text-ink/60 hover:border-forest hover:text-forest dark:border-ink-soft dark:text-paper/60"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        {/* Info hasil + toolbar sort */}
        {!isLoading && !error && (
          <SortFilterBar
            sort={sort}
            onSortChange={handleSortChange}
            totalFound={totalFound}
            currentCount={displayedBooks.length}
          />
        )}

        {/* Label hasil pencarian */}
        {isSearchMode && !isLoading && !error && (
          <p className="text-sm text-ink/60 dark:text-paper/60">
            Menampilkan hasil untuk{" "}
            <span className="font-semibold text-ink dark:text-paper">
              &ldquo;{query}&rdquo;
            </span>
          </p>
        )}

        <BookGrid
          books={displayedBooks}
          isLoading={isLoading}
          error={error}
          emptyMessage={
            isSearchMode
              ? "Tidak ada buku yang cocok dengan pencarianmu."
              : "Belum ada buku di rak ini."
          }
        />

        {/* Pagination */}
        {!isLoading && !error && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </div>
  );
}
