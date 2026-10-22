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
  const post = await postBySlug((await params).slug, "NEWS");
  return post ? { title: post.title, description: post.subtitle || excerpt(post.body, 160) } : {};
}

export default async function Page({ params }: Props) {
  const post = await postBySlug((await params).slug, "NEWS");
  if (!post) notFound();
  const others = (await postsIn("NEWS", 6)).filter((p) => p.id !== post.id).slice(0, 5);

  return (
    <>
      <PageHeader
        title={post.title}
        lead={post.subtitle ?? undefined}
        crumbs={[{ label: "Haberler ve Duyurular", href: "/haberler-duyurular" }, { label: post.title }]}
      />
      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_300px]">
        <article>
          {post.date && <p className="mb-6 flex items-center gap-1.5 text-sm text-muted"><Calendar /> {post.date}</p>}
          {post.images[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(post.images[0])} alt="" className="mb-8 w-full rounded" />
          )}
          <Html html={post.body} />
          {post.images.length > 1 && (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {post.images.slice(1).map((img) => (
                <a key={img} href={mediaUrl(img)} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mediaUrl(img)} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" loading="lazy" />
                </a>
              ))}
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {post.document && (
              <a href={mediaUrl(post.document)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-navy-700 px-5 py-3 font-semibold text-white hover:bg-navy-800">
                <FileText /> Belgeyi aç
              </a>
            )}
            {post.link && (
              <a href={post.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-line px-5 py-3 font-semibold text-navy-800 hover:border-teal-500">
                Bağlantıya git <ExternalLink />
              </a>
            )}
          </div>
        </article>
        {others.length > 0 && (
          <aside>
            <h2 className="label-mono text-muted">Diğer duyurular</h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {others.map((p) => (
                <li key={p.id}>
                  <Link href={`/haberler-duyurular/${p.slug}`} className="block py-4 font-medium leading-snug text-navy-800 hover:text-teal-600">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </Container>
    </>
  );
}
