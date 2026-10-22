import Link from "next/link";
import { CatalogSearch } from "@/components/site/CatalogSearch";
import { BookCaption, BookCard, Empty, NewsRow, SectionTitle, Shelf } from "@/components/site/cards";
import { ArrowRight } from "@/components/site/icons";
import { Container } from "@/components/site/PageHeader";
import { kohaSearchUrl } from "@/lib/config";
import { postsIn } from "@/lib/posts";
import { librariesByCountry, LIBRARIES } from "@/data/libraries";

export const dynamic = "force-dynamic";

// Dizin kartlarındaki numaralar Dewey Onlu Sınıflama'daki karşılıklarıdır.
const INDEX_CARDS = [
  { href: "/maarif-yayinlari", dewey: "050", title: "Maarif Yayınları", text: "Vakfın dergileri, öğretim programları ve kitapları PDF olarak." },
  { href: "/acik-erisim", dewey: "025.04", title: "Açık Erişim", text: "Ücretsiz erişilebilen e-kitaplar, dergiler ve veri tabanları." },
  { href: "/satin-alma-onerisi", dewey: "025.2", title: "Satın Alma Önerisi", text: "Kütüphanenizde görmek istediğiniz kaynağı bize bildirin." },
  { href: "/dunyada-maarif", dewey: "027", title: "Kütüphanelerimiz", text: `${LIBRARIES.length} kütüphanenin ülkelere göre listesi.` },
];

export default async function HomePage() {
  const [news, featured, popular, recent] = await Promise.all([
    postsIn("NEWS", 4),
    postsIn("FEATURED", 2),
    postsIn("POPULAR", 12),
    postsIn("RECENT", 12),
  ]);
  const countries = librariesByCountry().length;

  return (
    <>
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity"
          style={{ backgroundImage: "url(/img/bg2.jpg)" }}
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-950/50" />
        <Container className="relative pb-16 pt-16 sm:pb-20 sm:pt-24">
          <p className="label-mono text-teal-400">Türkiye Maarif Vakfı Kütüphane Ağı</p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
            Maarif okullarının kütüphaneleri, <em className="font-normal text-teal-400">tek bir katalogda.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100/85">
            Kitap, dergi ve e-kaynakları arayın; hangi kütüphanede, hangi rafta olduğunu görün.
          </p>

          <div className="mt-10 max-w-3xl">
            <CatalogSearch action={kohaSearchUrl} />
          </div>

          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6">
            {[
              { value: LIBRARIES.length, label: "kütüphane" },
              { value: countries, label: "ülke" },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-3xl font-semibold text-white">{s.value}</dd>
                <span className="label-mono text-navy-100/70">{s.label}</span>
              </div>
            ))}
            <Link href="/dunyada-maarif" className="ml-auto inline-flex items-center gap-1.5 self-center text-sm font-semibold text-teal-400 hover:text-white">
              Kütüphanelerimizi görün <ArrowRight />
            </Link>
          </dl>
        </Container>
      </section>

      <Container className="grid gap-14 py-20 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <section>
          <SectionTitle callNumber="027.8 · Okul kütüphaneleri" title="Duyuru Panosu" href="/haberler-duyurular" linkLabel="Tüm duyurular" />
          {news.length ? (
            <div className="border-b border-line">
              {news.map((post) => <NewsRow key={post.id} post={post} />)}
            </div>
          ) : (
            <Empty>Henüz duyuru eklenmedi.</Empty>
          )}
        </section>

        <section className="rounded bg-paper p-6 sm:p-8">
          <SectionTitle callNumber="Kütüphanecinin seçimi" title="Öne Çıkanlar" />
          {featured.length ? (
            <div className="grid grid-cols-2 gap-6">
              {featured.map((post) => (
                <div key={post.id}>
                  <BookCard post={post} />
                  <BookCaption post={post} />
                </div>
              ))}
            </div>
          ) : (
            <Empty>Öne çıkan kaynak yok.</Empty>
          )}
        </section>
      </Container>

      <section className="bg-paper py-20">
        <Container>
          <SectionTitle callNumber="Dizin" title="Kaynaklar ve Hizmetler" />
          <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {INDEX_CARDS.map((card) => (
              <li key={card.href}>
                {/* Fiş çekmecesi ayracı: üstte sınıf numaralı sekme. */}
                <Link href={card.href} className="group relative block pt-7">
                  <span className="label-mono absolute left-0 top-0 rounded-t bg-navy-900 px-3 py-1.5 text-white transition-colors group-hover:bg-teal-600">
                    {card.dewey}
                  </span>
                  <span className="block h-full rounded-b rounded-tr bg-white p-6 shadow-sm ring-1 ring-line transition-shadow group-hover:shadow-lg group-hover:shadow-navy-900/10">
                    <span className="block font-display text-xl font-semibold text-navy-900">{card.title}</span>
                    <span className="mt-2 block text-[15px] leading-6 text-muted">{card.text}</span>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600">
                      Aç <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {[
        { title: "Çok Okunanlar", callNumber: "Dolaşımda en çok", posts: popular },
        { title: "Son Eklenenler", callNumber: "Yeni gelenler", posts: recent },
      ].map(({ title, callNumber, posts }) =>
        posts.length ? (
          <Container key={title} className="pt-20">
            <SectionTitle callNumber={callNumber} title={title} />
            <Shelf posts={posts} />
          </Container>
        ) : null,
      )}
    </>
  );
}
