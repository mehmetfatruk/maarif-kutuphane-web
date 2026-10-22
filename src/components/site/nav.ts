export type NavItem = { label: string; href?: string; children?: { label: string; href: string }[] };

export const NAV: NavItem[] = [
  {
    label: "Kütüphane",
    children: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "Kütüphane Kuralları", href: "/kutuphane-kurallari" },
      { label: "Haberler ve Duyurular", href: "/haberler-duyurular" },
    ],
  },
  {
    label: "Kaynaklar",
    children: [
      { label: "Maarif Yayınları", href: "/maarif-yayinlari" },
      { label: "Kütüphane Kataloğu", href: "/kutuphane-katalogu" },
      { label: "Açık Erişim", href: "/acik-erisim" },
    ],
  },
  {
    label: "Hizmetlerimiz",
    children: [
      { label: "Hizmet Detayları", href: "/hizmetlerimiz" },
      { label: "Satın Alma Önerisi", href: "/satin-alma-onerisi" },
    ],
  },
  { label: "Kütüphanelerimiz", href: "/dunyada-maarif" },
  { label: "İletişim", href: "/iletisim" },
];

export const SOCIAL = [
  { label: "Facebook", href: "https://www.facebook.com/tmaarifvakfi" },
  { label: "X (Twitter)", href: "https://twitter.com/tmaarifvakfi" },
  { label: "Instagram", href: "https://www.instagram.com/tmaarifvakfi/" },
  { label: "YouTube", href: "https://www.youtube.com/tmaarifvakfi" },
];
