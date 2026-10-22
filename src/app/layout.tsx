import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";

// Bricolage Grotesque: başlıklar ve büyük rakamlar; Instrument Sans: metin.
const display = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], variable: "--ff-display", axes: ["opsz", "wdth"] });
const body = Instrument_Sans({ subsets: ["latin", "latin-ext"], variable: "--ff-body" });
// Raf etiketleri, sınıf numaraları ve tarihler için.
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
