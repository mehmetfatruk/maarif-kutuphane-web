import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const post = Number.isInteger(id) ? await db.post.findUnique({ where: { id } }) : null;
  if (!post) notFound();
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-navy-800">İçeriği düzenle</h1>
      <PostForm post={post} />
    </>
  );
}
