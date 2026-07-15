import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "BookShelf — Temukan & simpan buku favoritmu",
  description:
    "BookShelf adalah aplikasi sederhana untuk menjelajahi buku populer, mencari judul, dan menyimpan favorit langsung di browser kamu.",
};

// Script kecil ini sengaja diletakkan sebelum React hydrate, supaya
// class "dark" langsung terpasang di <html> saat halaman pertama kali
// digambar. Tanpa ini, akan ada "kedipan" (flash) dari mode terang ke
// gelap sesaat setelah halaman dimuat.
const noFlashThemeScript = `
  (function () {
    try {
      var stored = window.localStorage.getItem('booktrack:theme');
      var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var isDark = stored ? stored === 'dark' : systemDark;
      if (isDark) document.documentElement.classList.add('dark');
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashThemeScript }} />
      </head>
      <body>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 py-8 text-center font-mono text-xs text-ink/40 dark:text-paper/40 sm:px-6">
          Data buku disediakan oleh Open Library API
        </footer>
      </body>
    </html>
  );
}
