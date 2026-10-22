import Link from "next/link";
import { Cover, Empty } from "@/components/site/cards";
import { Container, PageHeader } from "@/components/site/PageHeader";
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
                <Cover src={post.images[0]} title={post.title} />
                <p className="mt-4 font-display text-lg font-bold leading-snug tracking-tight text-navy-900 group-hover:text-teal-600">{post.title}</p>
                {post.date && <p className="label-mono mt-1.5 text-teal-600">{post.date}</p>}
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
