import Link from "next/link";
import { Empty } from "@/components/site/cards";
import { Book, Calendar } from "@/components/site/icons";
import { Container, PageHeader } from "@/components/site/PageHeader";
import { mediaUrl } from "@/lib/media-url";
import { postsIn } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Maarif Yayınları" };

export default async function Page() {
  const posts = await postsIn("PUBLICATION");
  return (
    <>
      <PageHeader
        title="Maarif Yayınları"
        lead="Türkiye Maarif Vakfı'nın dergi, program ve kitaplarına buradan ulaşabilirsiniz."
        crumbs={[{ label: "Kaynaklar" }, { label: "Maarif Yayınları" }]}
      />
      <Container className="py-12 sm:py-16">
        {posts.length ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {posts.map((post) => (
              <Link key={post.id} href={`/maarif-yayinlari/${post.slug}`} className="group">
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-navy-50 shadow-md ring-1 ring-line transition-transform duration-300 group-hover:-translate-y-1">
                  {post.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mediaUrl(post.images[0])} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-navy-600"><Book /></div>
                  )}
                </div>
                <p className="mt-3 font-semibold leading-snug text-navy-800 group-hover:text-teal-600">{post.title}</p>
                {post.date && <p className="mt-1 flex items-center gap-1.5 text-sm text-muted"><Calendar /> {post.date}</p>}
              </Link>
            ))}
          </div>
        ) : (
          <Empty>Henüz yayın eklenmedi.</Empty>
        )}
      </Container>
    </>
  );
}
