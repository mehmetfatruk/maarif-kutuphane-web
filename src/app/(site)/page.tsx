import Link from "next/link";
import { CatalogSearch } from "@/components/site/CatalogSearch";
import { BookCard, CoverRow, Empty, NewsCard, NewsRow, SectionTitle } from "@/components/site/cards";
import { Container } from "@/components/site/PageHeader";
import { Spines } from "@/components/site/Spines";
import { kohaSearchUrl } from "@/lib/config";
import { postsIn } from "@/lib/posts";
import { librariesByCountry, LIBRARIES } from "@/data/libraries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [news, featured, popular, recent] = await Promise.all([
    postsIn("NEWS", 4),
    postsIn("FEATURED", 2),
    postsIn("POPULAR", 12),
    postsIn("RECENT", 12),
  ]);
  const countries = librariesByCountry().sort((a, b) => b.libraries.length - a.libraries.length);
  const [lead, ...rest] = news;

  return (
    <>
      <section>
        <Container className="pt-14 sm:pt-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="label-mono text-teal-600">Türkiye Maarif Vakfı Kütüphaneleri</p>
              <h1 className="display-tight mt-5 text-[15vw] text-navy-900 sm:text-8xl lg:text-[8.5rem]">
                Bugün rafta ne <span className="text-teal-500">arıyorsun?</span>
              </h1>
            </div>
            <dl className="flex gap-10 lg:flex-col lg:gap-5 lg:border-l-[10px] lg:border-spine-ochre lg:pb-3 lg:pl-6">
              <div>
                <dd className="display-tight text-6xl text-navy-900">{LIBRARIES.length}</dd>
                <dt className="label-mono mt-1 text-muted">kütüphane</dt>
              </div>
              <div>
                <dd className="display-tight text-6xl text-navy-900">{countries.length}</dd>
                <dt className="label-mono mt-1 text-muted">ülke, tek katalog</dt>
              </div>
            </dl>
          </div>

          <div className="mt-12 max-w-4xl">
            <CatalogSearch action={kohaSearchUrl} />
          </div>

          <div className="mt-16">
            <Spines />
          </div>
        </Container>
      </section>

      <Container className="pt-24">
        <SectionTitle callNumber="070 · Haberler" title="Duyurular" href="/haberler-duyurular" linkLabel="Tümü" />
        {lead ? (
          <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr]">
            <NewsCard post={lead} />
            {rest.length > 0 && (
              <div className="border-b border-line">
                {rest.map((post) => <NewsRow key={post.id} post={post} />)}
              </div>
            )}
          </div>
        ) : (
          <Empty>Henüz duyuru eklenmedi.</Empty>
        )}
      </Container>

      {featured.length > 0 && (
        <section className="mt-24 bg-paper py-20">
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
            <CoverRow posts={posts} />
          </Container>
        ) : null,
      )}

      <section className="mt-28 bg-spine-forest py-20 text-white">
        <Container>
          <SectionTitle
            light
            callNumber="027 · Kütüphanelerimiz"
            title={`${countries.length} ülkede ${LIBRARIES.length} kütüphane`}
            href="/dunyada-maarif"
            linkLabel="Listeyi gör"
          />
          <p className="font-display text-2xl font-semibold leading-relaxed tracking-tight sm:text-3xl sm:leading-relaxed">
            {countries.map(({ country, libraries }, i) => (
              <span key={country}>
                <Link href="/dunyada-maarif" className="text-white transition-colors hover:text-spine-ochre">
                  {country}
                  <sup className="label-mono ml-0.5 text-spine-ochre">{libraries.length}</sup>
                </Link>
                {i < countries.length - 1 && <span className="mx-2 text-white/30">/</span>}{" "}
              </span>
            ))}
          </p>
        </Container>
      </section>
    </>
  );
}
