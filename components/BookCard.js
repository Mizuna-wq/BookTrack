"use client";

import Image from "next/image";
import Link from "next/link";
import { getCoverUrl } from "@/lib/openlibrary";
import { useFavorites } from "@/hooks/useFavorites";
import FavoriteButton from "./FavoriteButton";
import StarRating from "./StarRating";

export default function BookCard({ book }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const cover = getCoverUrl(book.coverId, "M");
  const favorite = isFavorite(book.id);

  function handleToggle(e) {
    e.preventDefault(); // jangan ikut trigger navigasi <Link>
    e.stopPropagation();
    toggleFavorite(book);
  }

  return (
    <Link href={`/books/${book.id}`} className="catalog-card group h-full">
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-cream dark:bg-ink">
        {cover ? (
          <Image
            src={cover}
            alt={`Sampul buku ${book.title}`}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 180px"
            className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-3 text-center">
            <span className="font-display text-sm text-ink/50 dark:text-paper/50">
              {book.title}
            </span>
          </div>
        )}
        <FavoriteButton isFavorite={favorite} onToggle={handleToggle} />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="eyebrow">
          {book.firstPublishYear || "Tahun tidak diketahui"}
        </p>
        <h3 className="font-display text-base font-semibold leading-snug text-ink line-clamp-2 dark:text-paper">
          {book.title}
        </h3>
        <p className="mt-auto text-sm text-ink/60 line-clamp-1 dark:text-paper/60">
          {book.authors.length > 0
            ? book.authors.join(", ")
            : "Penulis tidak diketahui"}
        </p>
        {book.ratingsAverage && (
          <StarRating rating={book.ratingsAverage} count={book.ratingsCount} />
        )}
      </div>
    </Link>
  );
}
