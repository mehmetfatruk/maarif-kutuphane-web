import { Empty, NewsCard } from "@/components/site/cards";
import { Container, PageHeader } from "@/components/site/PageHeader";
import { postsIn } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Haberler ve Duyurular" };

export default async function Page() {
  const posts = await postsIn("NEWS");
  return (
    <>
      <PageHeader title="Haberler ve Duyurular" crumbs={[{ label: "Kütüphane" }, { label: "Haberler ve Duyurular" }]} />
      <Container className="py-12 sm:py-16">
        {posts.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => <NewsCard key={post.id} post={post} />)}
          </div>
        ) : (
          <Empty>Henüz duyuru eklenmedi.</Empty>
        )}
      </Container>
    </>
  );
}
