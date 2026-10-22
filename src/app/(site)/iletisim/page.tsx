import { Mail, MapPin, Phone } from "@/components/site/icons";
import { SOCIAL } from "@/components/site/nav";
import { Container, PageHeader } from "@/components/site/PageHeader";

export const metadata = { title: "İletişim" };

const ITEMS = [
  {
    Icon: MapPin,
    title: "İstanbul Genel Merkez",
    lines: ["Altunizade Mahallesi Ord. Prof. Dr. Fahrettin Kerim Gökay Caddesi", "Erdem Sokak No: 5, Üsküdar / İstanbul"],
  },
  { Icon: Phone, title: "Telefon", lines: ["+90 216 323 35 35"], href: "tel:+902163233535" },
  { Icon: Phone, title: "Faks", lines: ["+90 216 323 13 13"] },
  { Icon: Mail, title: "Genel iletişim", lines: ["iletisim@turkiyemaarif.org"], href: "mailto:iletisim@turkiyemaarif.org" },
  { Icon: Mail, title: "Kütüphane talepleri", lines: ["kutuphane@turkiyemaarif.org"], href: "mailto:kutuphane@turkiyemaarif.org" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="İletişim" crumbs={[{ label: "İletişim" }]} />
      <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[380px_1fr]">
        <div>
          <ul className="space-y-6">
            {ITEMS.map(({ Icon, title, lines, href }) => (
              <li key={title} className="flex gap-4">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                  <Icon />
                </span>
                <div>
                  <p className="font-semibold text-navy-800">{title}</p>
                  {lines.map((line) =>
                    href ? (
                      <a key={line} href={href} className="block text-muted hover:text-teal-600">{line}</a>
                    ) : (
                      <p key={line} className="text-muted">{line}</p>
                    ),
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <p className="font-semibold text-navy-800">Sosyal medya</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {SOCIAL.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-block rounded-full border border-line px-4 py-1.5 text-sm font-medium text-navy-800 hover:border-teal-500 hover:text-teal-600">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <iframe
          title="Türkiye Maarif Vakfı Genel Merkez haritası"
          src="https://www.google.com/maps?q=41.02046,29.04436&z=16&output=embed"
          className="min-h-[420px] w-full rounded-2xl border border-line"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Container>
    </>
  );
}
