import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Html } from "@/components/site/Html";
import { Calendar, ExternalLink, FileText } from "@/components/site/icons";
import { Container, PageHeader } from "@/components/site/PageHeader";
import { excerpt } from "@/lib/html";
import { mediaUrl } from "@/lib/media-url";
import { postBySlug, postsIn } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await postBySlug((await params).slug, "PUBLICATION");
  return post ? { title: post.title, description: post.subtitle || excerpt(post.body, 160) } : {};
}

export default async function Page({ params }: Props) {
  const post = await postBySlug((await params).slug, "PUBLICATION");
  if (!post) notFound();
  const all = await postsIn("PUBLICATION");

  return (
    <>
      <PageHeader
        title={post.title}
        lead={post.subtitle ?? undefined}
        crumbs={[{ label: "Maarif Yayınları", href: "/maarif-yayinlari" }, { label: post.title }]}
      />
      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[280px_1fr_260px]">
        <div>
          {post.images[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(post.images[0])} alt={post.title} className="w-full max-w-xs rounded-xl shadow-xl ring-1 ring-line" />
          )}
        </div>
        <article>
          {post.date && <p className="mb-4 flex items-center gap-1.5 text-sm text-muted"><Calendar /> {post.date}</p>}
          <Html html={post.body} />
          <div className="mt-8 flex flex-wrap gap-3">
            {post.document && (
              <a href={mediaUrl(post.document)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-5 py-3 font-semibold text-white hover:bg-teal-600">
                <FileText /> PDF olarak oku
              </a>
            )}
            {post.link && (
              <a href={post.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-line px-5 py-3 font-semibold text-navy-800 hover:border-teal-500">
                Bağlantıya git <ExternalLink />
              </a>
            )}
          </div>
        </article>
        <aside>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Tüm yayınlar</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {all.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/maarif-yayinlari/${p.slug}`}
                  aria-current={p.id === post.id ? "page" : undefined}
                  className={`block py-3 text-[15px] leading-snug hover:text-teal-600 ${p.id === post.id ? "font-semibold text-teal-600" : "text-navy-800"}`}
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </Container>
    </>
  );
}
