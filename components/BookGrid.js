import BookCard from "./BookCard";

function SkeletonCard() {
  return (
    <div className="catalog-card animate-pulse">
      <div className="aspect-[2/3] w-full bg-cream dark:bg-ink" />
      <div className="flex flex-col gap-2 p-3">
        <div className="h-3 w-1/3 rounded bg-cream dark:bg-ink" />
        <div className="h-4 w-full rounded bg-cream dark:bg-ink" />
        <div className="h-3 w-2/3 rounded bg-cream dark:bg-ink" />
      </div>
    </div>
  );
}

export default function BookGrid({ books, isLoading, error, emptyMessage }) {
  if (error) {
    return (
      <div className="rounded-sm border border-cranberry/30 bg-cranberry/5 p-6 text-center">
        <p className="font-display text-lg text-cranberry">Ups, ada masalah</p>
        <p className="mt-1 text-sm text-ink/70 dark:text-paper/70">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-cream p-10 text-center dark:border-ink-soft">
        <p className="font-display text-lg text-ink dark:text-paper">
          {emptyMessage || "Belum ada buku untuk ditampilkan."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
