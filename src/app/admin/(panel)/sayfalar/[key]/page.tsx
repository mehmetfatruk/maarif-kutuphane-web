import Link from "next/link";
import { notFound } from "next/navigation";
import { PageForm } from "@/components/admin/PageForm";
import { pageBody } from "@/lib/posts";
import { isPageKey, PAGES } from "@/lib/sections";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!isPageKey(key)) notFound();
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-navy-800">{PAGES[key]}</h1>
        <Link href={`/${key}`} target="_blank" className="text-sm font-semibold text-teal-600">Sayfayı görüntüle ↗</Link>
      </div>
      <PageForm key={key} pageKey={key} body={await pageBody(key)} />
    </>
  );
}
