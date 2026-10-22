import type { Section } from "@prisma/client";
import Link from "next/link";
import { deletePost } from "@/app/admin/actions";
import { ConfirmForm, Notice } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { mediaUrl } from "@/lib/media-url";
import { SECTION_LABELS, SECTIONS } from "@/lib/sections";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ bolum?: string; kaydedildi?: string; silindi?: string }> };

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const section = SECTIONS.find((s) => s === params.bolum) as Section | undefined;
  const posts = await db.post.findMany({
    where: section ? { sections: { has: section } } : undefined,
    orderBy: { id: "desc" },
  });

  const tab = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-semibold ${active ? "bg-navy-700 text-white" : "bg-white text-navy-800 ring-1 ring-line hover:ring-teal-500"}`;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-navy-800">İçerikler</h1>
        <Link href={`/admin/icerikler/yeni${section ? `?bolum=${section}` : ""}`} className="rounded-lg bg-teal-500 px-5 py-2.5 font-semibold text-white hover:bg-teal-600">
          + Yeni içerik
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/admin/icerikler" className={tab(!section)}>Tümü</Link>
        {SECTIONS.map((s) => (
          <Link key={s} href={`/admin/icerikler?bolum=${s}`} className={tab(section === s)}>{SECTION_LABELS[s]}</Link>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {params.kaydedildi && <Notice>İçerik kaydedildi.</Notice>}
        {params.silindi && <Notice>İçerik silindi.</Notice>}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white ring-1 ring-line">
        <table className="w-full min-w-[640px] text-left text-[15px]">
          <thead className="border-b border-line bg-navy-50 text-sm text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">İçerik</th>
              <th className="px-4 py-3 font-semibold">Bölümler</th>
              <th className="px-4 py-3 font-semibold">Tarih</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {post.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={mediaUrl(post.images[0])} alt="" className="h-12 w-9 rounded object-cover ring-1 ring-line" />
                    ) : (
                      <span className="h-12 w-9 rounded bg-navy-50 ring-1 ring-line" />
                    )}
                    <Link href={`/admin/icerikler/${post.id}`} className="font-semibold text-navy-800 hover:text-teal-600">{post.title}</Link>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {post.sections.map((s) => (
                      <span key={s} className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-600">{SECTION_LABELS[s]}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted">{post.date ?? post.createdAt.toLocaleDateString("tr-TR")}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-4">
                    <Link href={`/admin/icerikler/${post.id}`} className="text-sm font-semibold text-teal-600">Düzenle</Link>
                    <ConfirmForm action={deletePost} id={post.id} message={`"${post.title}" silinsin mi? Bu işlem geri alınamaz.`}>Sil</ConfirmForm>
                  </div>
                </td>
              </tr>
            ))}
            {!posts.length && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-muted">Bu bölümde içerik yok.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
