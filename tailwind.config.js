/** @type {import('tailwindcss').Config} */
module.exports = {
  // 'class' berarti dark mode dikontrol manual lewat class "dark" di <html>,
  // bukan otomatis ikut setting OS. Ini kita perlukan karena toggle disimpan
  // di localStorage (lihat hooks/useDarkMode.js)
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Palet "kartu katalog perpustakaan" ---
        paper: "#F6F2E7", // kertas terang, background mode light
        ink: "#1E2420", // hitam kehijauan gelap, teks utama & background dark mode
        "ink-soft": "#2A322C", // panel/card di dark mode
        forest: "#2F5233", // hijau sampul buku, warna primer
        "forest-light": "#3F6B45",
        gold: "#C9A227", // emas tepi halaman, aksen/highlight
        cranberry: "#8C2F39", // merah punggung buku, aksen sekunder (favorit)
        cream: "#EFE7D2", // border & garis pemisah lembut
      },
      fontFamily: {
        // Display: karakter kuat untuk judul, ala sampul buku
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        // Body: mudah dibaca untuk teks panjang (deskripsi buku)
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        // Mono: untuk label/metadata kecil ala kartu katalog
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(30,36,32,0.06), 0 4px 12px rgba(30,36,32,0.08)",
      },
    },
  },
  plugins: [],
};
