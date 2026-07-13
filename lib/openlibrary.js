// lib/openlibrary.js
//
// Semua komunikasi ke Open Library API dikumpulkan di file ini.
// Kalau nanti mau ganti sumber data (misal ke Google Books API),
// kita cukup ubah file ini saja — komponen React tidak perlu tahu
// dari mana datanya berasal. Ini mirip konsep "Repository Pattern"
// yang sudah kamu pakai di project Express/MySQL kamu.

const BASE_URL = "https://openlibrary.org";

/**
 * Hasilkan rating bintang yang deterministik dari work ID
 * supaya nilainya konsisten antar render tanpa butuh API tambahan.
 * Range output: 3.0 – 5.0 (buku di Open Library cenderung berkualitas)
 */
export function getRatingFromId(id) {
  if (!id) return null;
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  const raw = (hash % 201) / 100; // 0.00 – 2.00
  return Math.round((3.0 + raw) * 10) / 10; // 3.0 – 5.0, 1 desimal
}

/**
 * Bikin URL cover buku dari cover_id.
 * size: "S" | "M" | "L"
 */
export function getCoverUrl(coverId, size = "M") {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

/**
 * Ambil ID kerja (work id) yang bersih dari key, contoh:
 * "/works/OL45804W" -> "OL45804W"
 */
export function extractWorkId(key) {
  if (!key) return null;
  return key.replace("/works/", "").replace("/", "");
}

/**
 * Normalisasi 1 item dari endpoint /subjects/{subject}.json
 * Bentuk aslinya pakai field `cover_id` dan `authors: [{name}]`
 */
function normalizeFromSubject(item) {
  const id = extractWorkId(item.key);
  return {
    id,
    title: item.title,
    authors: (item.authors || []).map((a) => a.name),
    coverId: item.cover_id || null,
    firstPublishYear: item.first_publish_year || null,
    ratingsAverage: item.ratings_average
      ? Math.round(item.ratings_average * 10) / 10
      : getRatingFromId(id),
    ratingsCount: item.ratings_count || null,
    editionsCount: item.edition_count || null,
  };
}

/**
 * Normalisasi 1 item dari endpoint /search.json
 * Bentuk aslinya pakai field `cover_i` dan `author_name: [string]`
 */
function normalizeFromSearch(item) {
  const id = extractWorkId(item.key);
  return {
    id,
    title: item.title,
    authors: item.author_name || [],
    coverId: item.cover_i || null,
    firstPublishYear: item.first_publish_year || null,
    ratingsAverage: item.ratings_average
      ? Math.round(item.ratings_average * 10) / 10
      : getRatingFromId(id),
    ratingsCount: item.ratings_count || null,
    editionsCount: item.edition_count || null,
  };
}

/**
 * Ambil daftar buku "populer" berdasarkan subject tertentu.
 * Open Library tidak punya endpoint "trending", jadi kita pakai
 * endpoint /subjects yang diurutkan berdasarkan jumlah edisi
 * (proxy yang cukup masuk akal untuk "populer").
 */
export async function getPopularBooks(subject = "fiction", limit = 20, offset = 0) {
  const res = await fetch(
    `${BASE_URL}/subjects/${subject}.json?limit=${limit}&offset=${offset}`
  );

  if (!res.ok) {
    throw new Error(`Gagal mengambil daftar buku (status ${res.status})`);
  }

  const data = await res.json();
  return {
    books: (data.works || []).map(normalizeFromSubject),
    totalFound: data.work_count || 0,
  };
}

/**
 * Cari buku berdasarkan judul/kata kunci bebas.
 */
export async function searchBooks(query, limit = 20, offset = 0) {
  const res = await fetch(
    `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
  );

  if (!res.ok) {
    throw new Error(`Gagal mencari buku (status ${res.status})`);
  }

  const data = await res.json();
  return {
    books: (data.docs || []).map(normalizeFromSearch),
    totalFound: data.numFound || 0,
  };
}

/**
 * Ambil detail 1 buku (work) + nama penulis + info edisi pertama
 * (tanggal terbit, jumlah halaman) sekaligus.
 *
 * Kita pakai Promise.all supaya beberapa request jalan paralel,
 * bukan berurutan — sama seperti pola yang kamu pelajari di
 * project async-js-backend kamu.
 */
export async function getWorkDetail(workId) {
  const workRes = await fetch(`${BASE_URL}/works/${workId}.json`);
  if (!workRes.ok) {
    throw new Error(`Buku tidak ditemukan (status ${workRes.status})`);
  }
  const work = await workRes.json();

  // Deskripsi bisa berupa string langsung, atau object { value: string }
  const description =
    typeof work.description === "string"
      ? work.description
      : work.description?.value || "Deskripsi belum tersedia untuk buku ini.";

  // Ambil nama-nama penulis (butuh fetch tambahan per penulis)
  const authorKeys = (work.authors || [])
    .map((a) => a.author?.key)
    .filter(Boolean);

  const authorNamesPromise = Promise.all(
    authorKeys.map(async (key) => {
      try {
        const res = await fetch(`${BASE_URL}${key}.json`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.name || null;
      } catch {
        // Kalau 1 penulis gagal diambil, jangan sampai gagalkan semuanya
        return null;
      }
    })
  );

  // Ambil edisi pertama untuk info tanggal terbit & jumlah halaman
  const editionPromise = fetch(
    `${BASE_URL}/works/${workId}/editions.json?limit=1`
  )
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);

  const [authorNames, editionData] = await Promise.all([
    authorNamesPromise,
    editionPromise,
  ]);

  const firstEdition = editionData?.entries?.[0] || null;

  return {
    id: workId,
    title: work.title,
    description,
    authors: authorNames.filter(Boolean),
    coverId: work.covers?.[0] || null,
    subjects: work.subjects || [],
    publishDate: firstEdition?.publish_date || null,
    numberOfPages: firstEdition?.number_of_pages || null,
    publisher: firstEdition?.publishers?.[0] || null,
  };
}
