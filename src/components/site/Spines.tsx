import { kohaSearchUrl } from "@/lib/config";

// Rafın kitapları Dewey Onlu Sınıflama'nın ana sınıflarıdır; her biri katalogda o sınıfın yer numaralarını arar.
const CLASSES = [
  { code: "000", label: "Genel Konular", note: "Genel eserler, bilgisayar bilimleri, bilişim", bg: "bg-navy-900", text: "text-white", w: 80, h: 330 },
  { code: "100", label: "Felsefe ve Psikoloji", bg: "bg-teal-500", text: "text-navy-950", w: 66, h: 300 },
  { code: "200", label: "Din", bg: "bg-spine-ochre", text: "text-navy-950", w: 60, h: 250 },
  { code: "300", label: "Toplum Bilimleri", bg: "bg-spine-forest", text: "text-white", w: 76, h: 315 },
  { code: "400", label: "Dil ve Dilbilim", bg: "bg-spine-plum", text: "text-white", w: 64, h: 285 },
  { code: "500", label: "Doğa Bilimleri ve Matematik", bg: "bg-paper", text: "text-navy-900", w: 74, h: 345 },
  { code: "600", label: "Teknoloji", bg: "bg-spine-night", text: "text-white", w: 62, h: 270 },
  { code: "700", label: "Sanatlar", bg: "bg-teal-600", text: "text-white", w: 70, h: 295 },
  { code: "800", label: "Edebiyat", bg: "bg-spine-ochre", text: "text-navy-950", w: 84, h: 320 },
  { code: "900", label: "Coğrafya ve Tarih", bg: "bg-navy-700", text: "text-white", w: 72, h: 305 },
];

const searchUrl = (code: string) =>
  `${kohaSearchUrl}?idx=callnum&q=${encodeURIComponent(`${code[0]}**`)}&limit=&weight_search=1`;

/**
 * Anasayfanın rafı. Sırtlar rafın genişliğini kalınlıkları oranında paylaşır (kaydırma olmaz);
 * yükseklik `--spine-h` CSS değişkeniyle ölçeklenir.
 */
export function Spines() {
  return (
    <nav aria-label="Konulara göre katalog">
      <ul className="flex items-end gap-1 border-b-[10px] border-navy-900 pt-5 sm:gap-1.5">
        {CLASSES.map((c) => (
          <li key={c.code} className="min-w-0 basis-0" style={{ flexGrow: c.w }}>
            <a
              href={searchUrl(c.code)}
              title={`${c.code}–${c.code[0]}99 · ${c.label}${c.note ? ` (${c.note})` : ""}`}
              style={{ height: `calc(var(--spine-h, 1) * ${c.h}px)` }}
              className={`group relative flex w-full flex-col items-center justify-between rounded-t-[3px] px-1 pb-2.5 pt-4 shadow-[inset_-6px_0_10px_-6px_rgb(0_0_0/0.35),inset_6px_0_8px_-6px_rgb(255_255_255/0.25)] ring-1 ring-navy-950/10 transition-transform duration-300 ease-out hover:-translate-y-4 focus-visible:-translate-y-4 sm:px-2 ${c.bg} ${c.text}`}
            >
              <span aria-hidden className="absolute inset-x-0 top-3 h-px bg-current opacity-30" />
              <span className="spine-text min-h-0 overflow-hidden text-[12px] font-bold leading-none tracking-tight sm:text-[15px]">
                {c.label}
              </span>
              {/* Kütüphane sırt etiketi */}
              <span className="mt-2 w-full rounded-[2px] bg-white py-1 text-center text-[9px] font-bold tabular-nums text-navy-900 sm:text-[10px]">
                {c.code}
              </span>
            </a>
          </li>
        ))}
        {/* Rafın sonunda yaslanmış kitap */}
        <li aria-hidden className="ml-2 hidden w-14 shrink-0 lg:block">
          <span
            style={{ width: 38, height: "calc(var(--spine-h, 1) * 210px)" }}
            className="block origin-bottom-left translate-x-4 -rotate-[14deg] rounded-t-[3px] bg-navy-100 ring-1 ring-navy-950/10"
          />
        </li>
      </ul>
    </nav>
  );
}
