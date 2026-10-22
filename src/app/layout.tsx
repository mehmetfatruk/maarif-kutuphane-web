import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

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
    <html lang="tr" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
