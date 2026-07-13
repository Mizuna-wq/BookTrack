"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getWorkDetail, getCoverUrl } from "@/lib/openlibrary";
import { useFavorites } from "@/hooks/useFavorites";
import FavoriteButton from "@/components/FavoriteButton";

export default function BookDetailPage() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadDetail() {
      setIsLoading(true);
      setError(null);
      try {
        const detail = await getWorkDetail(id);
        if (!isCancelled) setBook(detail);
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || "Gagal memuat detail buku.");
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadDetail();
    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="mb-6 h-4 w-24 rounded bg-cream dark:bg-ink-soft" />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-[240px_1fr]">
          <div className="aspect-[2/3] w-full max-w-[240px] rounded-sm bg-cream dark:bg-ink-soft" />
          <div className="flex flex-col gap-3">
            <div className="h-8 w-3/4 rounded bg-cream dark:bg-ink-soft" />
            <div className="h-4 w-1/2 rounded bg-cream dark:bg-ink-soft" />
            <div className="mt-4 h-24 w-full rounded bg-cream dark:bg-ink-soft" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-sm border border-cranberry/30 bg-cranberry/5 p-6 text-center">
        <p className="font-display text-lg text-cranberry">Ups, ada masalah</p>
        <p className="mt-1 text-sm text-ink/70 dark:text-paper/70">{error}</p>
        <Link
          href="/"
          className="mt-4 inline-block font-mono text-xs uppercase tracking-wide text-forest hover:underline"
        >
          ← Kembali ke beranda
        </Link>
      </div>
    );
  }

  const cover = getCoverUrl(book.coverId, "L");
  const favoriteBook = {
    id: book.id,
    title: book.title,
    authors: book.authors,
    coverId: book.coverId,
    firstPublishYear: null, // tidak tersedia dari endpoint detail work
  };
  const favorite = isFavorite(book.id);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/"
        className="w-fit font-mono text-xs uppercase tracking-wide text-ink/60 hover:text-forest dark:text-paper/60"
      >
        ← Kembali ke katalog
      </Link>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-[240px_1fr]">
        <div className="relative aspect-[2/3] w-full max-w-[240px] overflow-hidden rounded-sm border border-cream bg-cream shadow-card dark:border-ink-soft dark:bg-ink-soft">
          {cover ? (
            <Image
              src={cover}
              alt={`Sampul buku ${book.title}`}
              fill
              sizes="240px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-4 text-center">
              <span className="font-display text-ink/50 dark:text-paper/50">
                {book.title}
              </span>
            </div>
          )}
          <FavoriteButton isFavorite={favorite} onToggle={() => toggleFavorite(favoriteBook)} size="lg" />
        </div>

        <div className="flex flex-col gap-3">
          <p className="eyebrow">
            {book.publishDate || "Tanggal terbit tidak diketahui"}
          </p>
          <h1 className="font-display text-3xl font-semibold text-ink dark:text-paper">
            {book.title}
          </h1>
          <p className="text-base text-ink/70 dark:text-paper/70">
            {book.authors.length > 0
              ? `oleh ${book.authors.join(", ")}`
              : "Penulis tidak diketahui"}
          </p>

          <div className="mt-2 flex flex-wrap gap-4 font-mono text-xs uppercase tracking-wide text-ink/50 dark:text-paper/50">
            {book.publisher && <span>Penerbit: {book.publisher}</span>}
            {book.numberOfPages && <span>{book.numberOfPages} halaman</span>}
          </div>

          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink/80 dark:text-paper/80">
            {book.description}
          </p>

          {book.subjects.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {book.subjects.slice(0, 8).map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-cream px-2.5 py-1 text-xs text-ink/60 dark:border-ink-soft dark:text-paper/60"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
