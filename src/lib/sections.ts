import type { Section } from "@prisma/client";

export const SECTION_LABELS: Record<Section, string> = {
  FEATURED: "Öne Çıkanlar",
  POPULAR: "Çok Okunanlar",
  RECENT: "Son Eklenenler",
  NEWS: "Haberler ve Duyurular",
  PUBLICATION: "Maarif Yayınları",
};

export const SECTIONS = Object.keys(SECTION_LABELS) as Section[];

/** Yönetim panelinden düzenlenen sabit sayfalar; anahtar aynı zamanda sitedeki adrestir. */
export const PAGES = {
  hakkimizda: "Hakkımızda",
  "kutuphane-kurallari": "Kütüphane Kuralları",
  "kutuphane-katalogu": "Kütüphane Kataloğu",
  "acik-erisim": "Açık Erişim",
  hizmetlerimiz: "Hizmet Detayları",
} as const;

export type PageKey = keyof typeof PAGES;

export function isPageKey(key: string): key is PageKey {
  return key in PAGES;
}
