/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Kita izinkan domain cover buku dari Open Library supaya bisa
    // dioptimasi otomatis oleh komponen <Image /> milik Next.js
    remotePatterns: [
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
      },
    ],
  },
};

module.exports = nextConfig;
