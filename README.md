# BookTrack

Aplikasi katalog buku sederhana untuk pre-project Frontend Web Developer.
Dibuat dengan **Next.js (App Router) + React + Tailwind CSS**, data buku
diambil dari **Open Library API** (gratis, tanpa API key).

## Fitur

- **Beranda** — daftar buku populer per kategori/rak (Fiksi, Fantasi,
  Misteri, Romansa, Sains), diambil dari `Open Library /subjects`
- **Pencarian** — cari judul buku apa saja lewat `Open Library /search`
- **Halaman detail** — deskripsi, penulis, penerbit, jumlah halaman, subjek
- **Favorit** — simpan/hapus buku favorit, tersimpan di `localStorage`,
  ada halaman `/favorites` khusus untuk melihatnya
- **Responsive** — grid 2 kolom di HP sampai 5 kolom di layar besar
- **Dark mode** — toggle manual, tersimpan di `localStorage`, tanpa flash
  warna saat reload

## Menjalankan project

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Struktur folder

```
app/
  layout.js          -> layout utama (navbar, font, script anti-flash dark mode)
  page.js             -> halaman beranda (daftar buku + pencarian)
  books/[id]/page.js  -> halaman detail 1 buku (dynamic route)
  favorites/page.js   -> halaman daftar favorit
  globals.css         -> setup Tailwind + style dasar

components/
  Navbar.js           -> header, link favorit, tombol dark mode
  SearchBar.js         -> input pencarian (controlled component)
  BookCard.js           -> kartu 1 buku di grid
  BookGrid.js            -> grid + state loading/error/kosong
  FavoriteButton.js       -> tombol pita favorit
  DarkModeToggle.js       -> tombol matahari/bulan

hooks/
  useFavorites.js     -> baca/tulis daftar favorit ke localStorage
  useDarkMode.js      -> baca/tulis preferensi tema ke localStorage

lib/
  openlibrary.js      -> semua fetch ke Open Library API + normalisasi data
```

## Beberapa keputusan desain (buat kamu yang dari background PHP)

- **`lib/openlibrary.js` sebagai "repository"** — sama seperti Repository
  Pattern yang kamu pakai di project Express/MySQL kamu: semua detail
  fetch API dikumpulkan di satu file, komponen React tinggal panggil
  `getPopularBooks()`, `searchBooks()`, dll tanpa perlu tahu bentuk asli
  response API-nya. Kalau Open Library ganti struktur data (atau kamu
  ganti ke Google Books API), cukup ubah file ini.

- **`"use client"` di banyak file** — di Next.js App Router, komponen
  itu **server component** secara default (mirip render PHP murni di
  server, tanpa JS di browser). Begitu sebuah komponen butuh
  `useState`, `useEffect`, `localStorage`, atau event handler seperti
  `onClick`, dia wajib ditandai `"use client"` di baris paling atas
  supaya kode itu benar-benar jalan di browser. Anggap saja ini
  penanda "bagian ini butuh JavaScript hidup di sisi pengguna",
  kebalikan dari halaman PHP yang semuanya jalan di server lalu
  dikirim sebagai HTML jadi.

- **`useEffect` untuk fetch data** — karena beranda dan halaman detail
  butuh interaktivitas (search, dark mode, favorit), keduanya dibuat
  jadi client component yang fetch data setelah komponen tampil di
  layar, mirip kamu manggil `fetch()` dari `<script>` di halaman Blade,
  bukan `$data = DB::query(...)` yang sudah jadi HTML sebelum dikirim.

- **`localStorage` vs session/database** — favorit dan tema **tidak**
  dikirim ke server sama sekali, murni disimpan di browser pengguna.
  Ini beda dari `$_SESSION` (tersimpan di server) atau tabel database
  favorit di aplikasi PHP kamu sebelumnya — plus/minusnya: super
  ringan dan tanpa backend, tapi datanya hilang kalau pengguna ganti
  browser/perangkat atau membersihkan cache.

- **Kenapa ada 2 hook (`useFavorites`, `useDarkMode`)?** — supaya
  logika localStorage tidak diulang-ulang di banyak komponen. Ini
  konsepnya mirip helper/trait di PHP: satu tempat untuk satu
  tanggung jawab, dipakai ulang di mana saja dibutuhkan.

## Ide pengembangan lanjutan

- Tambah pagination / infinite scroll di hasil pencarian
- Tambah filter berdasarkan tahun terbit
- Ganti localStorage dengan backend + database kalau butuh favorit
  yang sinkron antar perangkat (di sinilah pengalaman Express/MySQL
  kamu akan langsung kepakai)
