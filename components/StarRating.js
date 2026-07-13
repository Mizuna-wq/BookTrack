// components/StarRating.js
// Komponen bintang rating yang mendukung nilai pecahan (misal 3.7 tampil
// sebagai 3 bintang penuh, 1 bintang 70% terisi, 1 kosong).

export default function StarRating({ rating, count, size = "sm" }) {
  if (!rating) return null;

  const starCount = 5;
  const sizeClass = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const textClass = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <span className="flex items-center gap-0.5" aria-label={`Rating ${rating} dari 5`}>
      {Array.from({ length: starCount }).map((_, i) => {
        const fill = Math.min(Math.max(rating - i, 0), 1); // 0, 0–1, atau 1
        const pct = Math.round(fill * 100);
        const uid = `star-${i}`;

        return (
          <svg
            key={i}
            className={`${sizeClass} flex-shrink-0`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={uid} x1="0" x2="1" y1="0" y2="0">
                <stop offset={`${pct}%`} stopColor="#C9A227" />
                <stop offset={`${pct}%`} stopColor="transparent" />
              </linearGradient>
            </defs>
            {/* Border bintang (selalu tampil) */}
            <path
              d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27l-4.94 2.43.94-5.49-4-3.9 5.53-.8z"
              fill="none"
              stroke="#C9A227"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Fill bintang (proporsional) */}
            <path
              d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27l-4.94 2.43.94-5.49-4-3.9 5.53-.8z"
              fill={`url(#${uid})`}
            />
          </svg>
        );
      })}
      <span className={`ml-0.5 font-mono ${textClass} text-ink/60 dark:text-paper/60`}>
        {rating.toFixed(1)}
        {count ? (
          <span className="opacity-60 ml-0.5">({count.toLocaleString()})</span>
        ) : null}
      </span>
    </span>
  );
}
