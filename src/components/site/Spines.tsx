import Link from "next/link";

// Rafın kitapları sitenin bölümleridir. Etiketlerdeki numaralar Dewey Onlu Sınıflama karşılıklarıdır.
const SPINES = [
  { label: "Maarif Yayınları", href: "/maarif-yayinlari", dewey: "050", bg: "bg-navy-900", text: "text-white", w: 84, h: 330 },
  { label: "Açık Erişim", href: "/acik-erisim", dewey: "025.04", bg: "bg-teal-500", text: "text-navy-950", w: 64, h: 290 },
  { label: "Haberler ve Duyurular", href: "/haberler-duyurular", dewey: "070", bg: "bg-spine-ochre", text: "text-navy-950", w: 92, h: 345 },
  { label: "Kütüphanelerimiz", href: "/dunyada-maarif", dewey: "027", bg: "bg-spine-forest", text: "text-white", w: 72, h: 305 },
  { label: "Satın Alma Önerisi", href: "/satin-alma-onerisi", dewey: "025.2", bg: "bg-spine-plum", text: "text-white", w: 70, h: 320 },
  { label: "Kütüphane Kataloğu", href: "/kutuphane-katalogu", dewey: "025.3", bg: "bg-paper", text: "text-navy-900", w: 78, h: 280 },
  { label: "Kütüphane Kuralları", href: "/kutuphane-kurallari", dewey: "025.1", bg: "bg-spine-night", text: "text-white", w: 60, h: 300 },
  { label: "Hizmet Detayları", href: "/hizmetlerimiz", dewey: "025.5", bg: "bg-teal-600", text: "text-white", w: 66, h: 270 },
  { label: "Hakkımızda", href: "/hakkimizda", dewey: "027.8", bg: "bg-navy-700", text: "text-white", w: 58, h: 250 },
  { label: "İletişim", href: "/iletisim", dewey: "001", bg: "bg-spine-ochre", text: "text-navy-950", w: 54, h: 230 },
];

/** Anasayfanın rafı: her sırt bir bölüme götürür; üzerine gelince kitap raftan çekilir. */
export function Spines() {
  return (
    <nav aria-label="Bölümler" className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
      <ul className="flex min-w-max items-end gap-1.5 border-b-[10px] border-navy-900 pt-6">
        {SPINES.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              style={{ width: s.w, height: s.h }}
              className={`group relative flex flex-col items-center justify-between rounded-t-[3px] px-2 pb-3 pt-5 shadow-[inset_-6px_0_10px_-6px_rgb(0_0_0/0.35),inset_6px_0_8px_-6px_rgb(255_255_255/0.25)] ring-1 ring-navy-950/10 transition-transform duration-300 ease-out hover:-translate-y-4 focus-visible:-translate-y-4 ${s.bg} ${s.text}`}
            >
              <span aria-hidden className="absolute inset-x-0 top-3 h-px bg-current opacity-30" />
              <span className="spine-text font-display text-lg font-bold leading-none tracking-tight">{s.label}</span>
              {/* Kütüphane sırt etiketi */}
              <span className="label-mono mt-3 w-full rounded-[2px] bg-white px-1 py-1.5 text-center text-[10px] tracking-[0.06em] text-navy-900">
                {s.dewey}
              </span>
            </Link>
          </li>
        ))}
        {/* Rafın sonunda yaslanmış kitap */}
        <li aria-hidden className="ml-3 hidden sm:block">
          <span className="block h-[210px] w-[46px] origin-bottom-left -rotate-[14deg] translate-x-10 rounded-t-[3px] bg-navy-100 ring-1 ring-navy-950/10" />
        </li>
      </ul>
    </nav>
  );
}
