import Link from "next/link";
import { Empty } from "@/components/site/cards";
import { Book } from "@/components/site/icons";
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
                <div className="aspect-[2/3] overflow-hidden rounded-r-[3px] bg-navy-100 shadow-[0_12px_20px_-10px_rgb(11_32_54/0.55)] ring-1 ring-navy-950/10 transition-transform duration-300 group-hover:-translate-y-2">
                  {post.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mediaUrl(post.images[0])} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-navy-600"><Book /></div>
                  )}
                </div>
                <p className="mt-4 font-display font-semibold leading-snug text-navy-900 group-hover:text-teal-600">{post.title}</p>
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
