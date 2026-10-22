import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Plus Jakarta Sans: başlık ve metin için tek, okunaklı yazı ailesi.
const sans = Plus_Jakarta_Sans({ subsets: ["latin", "latin-ext"], variable: "--ff-body" });

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
    <html lang="tr" className={sans.variable}>
      <body>{children}</body>
    </html>
  );
}
