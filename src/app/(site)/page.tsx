import Link from "next/link";
import { CatalogSearch } from "@/components/site/CatalogSearch";
import { BookCard, Empty, NewsCard, SectionTitle } from "@/components/site/cards";
import { ArrowRight, Book, FileText, MapPin, Search } from "@/components/site/icons";
import { Container } from "@/components/site/PageHeader";
import { kohaSearchUrl } from "@/lib/config";
import { postsIn } from "@/lib/posts";
import { LIBRARIES } from "@/data/libraries";

export const dynamic = "force-dynamic";

const QUICK_LINKS = [
  { href: "/maarif-yayinlari", title: "Maarif Yayınları", text: "Vakfın dergi ve programlarına PDF olarak ulaşın.", Icon: FileText },
  { href: "/acik-erisim", title: "Açık Erişim", text: "Ücretsiz erişilebilen e-kaynaklar ve veri tabanları.", Icon: Book },
  { href: "/satin-alma-onerisi", title: "Satın Alma Önerisi", text: "Kütüphanemizde görmek istediğiniz kaynağı önerin.", Icon: Search },
  { href: "/dunyada-maarif", title: "Kütüphanelerimiz", text: `Dünya genelinde ${LIBRARIES.length} kütüphanemizi keşfedin.`, Icon: MapPin },
];

export default async function HomePage() {
  const [news, featured, popular, recent] = await Promise.all([
    postsIn("NEWS", 3),
    postsIn("FEATURED", 4),
    postsIn("POPULAR", 12),
    postsIn("RECENT", 12),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-navy-900">
        <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: "url(/img/bg2.jpg)" }} aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-navy-900/60 to-navy-900" aria-hidden />
        <Container className="relative py-20 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-400">Türkiye Maarif Vakfı Kütüphaneleri</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Bilgiye açılan kapı, dünyanın dört bir yanında
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-100">
            {LIBRARIES.length} kütüphanenin ortak kataloğunda kitap, dergi ve e-kaynak arayın.
          </p>
          <div className="mt-10 max-w-4xl">
            <CatalogSearch action={kohaSearchUrl} />
          </div>
        </Container>
      </section>

      <Container className="-mt-px py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          <section>
            <SectionTitle title="Haberler ve Duyurular" href="/haberler-duyurular" linkLabel="Tüm haberler" />
            {news.length ? (
              <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {news.map((post) => <NewsCard key={post.id} post={post} />)}
              </div>
            ) : (
              <Empty>Henüz duyuru eklenmedi.</Empty>
            )}
          </section>

          <section>
            <SectionTitle title="Öne Çıkanlar" />
            {featured.length ? (
              <div className="grid grid-cols-2 gap-6">
                {featured.map((post) => <BookCard key={post.id} post={post} />)}
              </div>
            ) : (
              <Empty>Öne çıkan kaynak yok.</Empty>
            )}
          </section>
        </div>
      </Container>

      <section className="bg-navy-50 py-16 sm:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_LINKS.map(({ href, title, text, Icon }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-2xl bg-white p-6 ring-1 ring-line transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/10"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-navy-800">{title}</h3>
                <p className="mt-1.5 text-[15px] leading-6 text-muted">{text}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600">
                  İncele <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {[
        { title: "Çok Okunanlar", posts: popular },
        { title: "Son Eklenenler", posts: recent },
      ].map(({ title, posts }) =>
        posts.length ? (
          <Container key={title} className="pt-16 sm:pt-20">
            <SectionTitle title={title} />
            <div className="-mx-4 flex snap-x scroll-px-4 gap-6 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6">
              {posts.map((post) => (
                <BookCard key={post.id} post={post} className="w-40 shrink-0 snap-start sm:w-44" />
              ))}
            </div>
          </Container>
        ) : null,
      )}
    </>
  );
}
