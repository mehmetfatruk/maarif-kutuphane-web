import type { Section } from "@prisma/client";
import { PostForm } from "@/components/admin/PostForm";
import { SECTIONS } from "@/lib/sections";

export default async function Page({ searchParams }: { searchParams: Promise<{ bolum?: string }> }) {
  const { bolum } = await searchParams;
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-navy-800">Yeni içerik</h1>
      <PostForm defaultSection={SECTIONS.find((s) => s === bolum) as Section | undefined} />
    </>
  );
}
