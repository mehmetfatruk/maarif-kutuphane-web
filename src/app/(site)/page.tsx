import Link from "next/link";
import { CatalogSearch } from "@/components/site/CatalogSearch";
import { BookCard, CoverRow, SectionTitle } from "@/components/site/cards";
import { ArrowRight } from "@/components/site/icons";
import { excerpt } from "@/lib/html";
import { Container } from "@/components/site/PageHeader";
import { Spines } from "@/components/site/Spines";
import { KOHA_OPAC_URL, kohaSearchUrl } from "@/lib/config";
import { postsIn } from "@/lib/posts";
import { librariesByCountry, LIBRARIES } from "@/data/libraries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [news, featured, popular, recent] = await Promise.all([
    postsIn("NEWS", 3),
    postsIn("FEATURED", 2),
    postsIn("POPULAR", 12),
    postsIn("RECENT", 12),
  ]);
  const countries = librariesByCountry();

  return (
    <>
      {/* İlk ekran: başlık, arama ve raf birlikte görünür (üst menü 7.25rem). */}
      <section className="border-b border-line bg-gradient-to-b from-white to-paper">
        <Container className="grid gap-10 pt-10 lg:min-h-[calc(100svh-7.25rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-end lg:gap-12 lg:pb-8 lg:pt-0">
          <div className="min-w-0 self-center lg:py-10">
            <p className="label-mono text-teal-600">Türkiye Maarif Vakfı Kütüphaneleri</p>
            <h1 className="display-tight mt-4 text-5xl text-navy-900 sm:text-6xl xl:text-7xl">
              Bugün rafta ne <span className="text-teal-500">arıyorsun?</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
              {countries.length} ülkedeki {LIBRARIES.length} Maarif kütüphanesinin kitap, dergi ve e-kaynakları tek katalogda.
            </p>
            <div className="mt-8">
              <CatalogSearch action={kohaSearchUrl} homeUrl={`${KOHA_OPAC_URL}/`} />
            </div>
          </div>
          <div className="min-w-0 [--spine-h:0.72] sm:[--spine-h:0.82] [@media(min-width:1280px)_and_(min-height:900px)]:[--spine-h:1.18]">
            <Spines />
          </div>
        </Container>
      </section>

      {featured.length > 0 && (
        <section className="bg-paper py-20">
          <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div>
              <p className="label-mono text-teal-600">Kütüphanecinin seçimi</p>
              <h2 className="display-tight mt-3 text-5xl text-navy-900 sm:text-7xl">
                Bu ay <span className="text-spine-plum">öne çıkanlar</span>
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
                Kütüphanecilerimizin okurlara önerdiği kaynaklar. Kapağa tıklayarak katalog kaydını açabilirsiniz.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-12">
              {featured.map((post, i) => (
                <BookCard key={post.id} post={post} className={i === 1 ? "sm:mt-16" : ""} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {[
        { title: "Çok okunanlar", callNumber: "Dolaşımda en çok", posts: popular },
        { title: "Yeni gelenler", callNumber: "Son eklenenler", posts: recent },
      ].map(({ title, callNumber, posts }) =>
        posts.length ? (
          <Container key={title} className="pt-24">
            <SectionTitle callNumber={callNumber} title={title} />
            <CoverRow posts={posts} label={title} />
          </Container>
        ) : null,
      )}

      {/* Duyurular: sayfanın sonunda kısa bir şerit. */}
      {news.length > 0 && (
        <Container className="pt-24">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b-[6px] border-navy-900 pb-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-navy-900">Duyurular</h2>
            <Link href="/haberler-duyurular" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-navy-900">
              Tüm duyurular <ArrowRight />
            </Link>
          </div>
          <ul className="grid gap-x-10 sm:grid-cols-3">
            {news.slice(0, 3).map((post) => (
              <li key={post.id} className="border-b border-line sm:border-b-0">
                <Link href={`/haberler-duyurular/${post.slug}`} className="group block py-6">
                  <h3 className="font-bold leading-snug text-navy-900 group-hover:text-teal-600">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{post.subtitle || excerpt(post.body, 140)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      )}
    </>
  );
}
