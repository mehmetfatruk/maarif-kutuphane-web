import type { Metadata } from "next";
import { Figtree, IBM_Plex_Mono, Literata } from "next/font/google";
import "./globals.css";

// Literata: Google Play Kitaplar için tasarlanmış okuma yazı tipi; başlıklarda kullanılır.
const display = Literata({ subsets: ["latin", "latin-ext"], variable: "--ff-display", style: ["normal", "italic"] });
const body = Figtree({ subsets: ["latin", "latin-ext"], variable: "--ff-body" });
// Yer numaraları, tarihler gibi künye bilgileri için.
const mono = IBM_Plex_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], variable: "--ff-mono" });

export const metadata: Metadata = {
  title: {
    default: "Türkiye Maarif Vakfı Kütüphanesi",
    template: "%s | Türkiye Maarif Vakfı Kütüphanesi",
  },
  description:
    "Türkiye Maarif Vakfı kütüphaneleri: katalog arama, Maarif yayınları, haberler ve duyurular.",
  metadataBase: new URL(process.env.SITE_URL ?? "https://kutuphane.turkiyemaarif.org"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
