import Link from "next/link";
import { db } from "@/lib/db";
import { SECTION_LABELS, SECTIONS } from "@/lib/sections";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const counts = await Promise.all(SECTIONS.map((s) => db.post.count({ where: { sections: { has: s } } })));
  return (
    <>
      <h1 className="text-2xl font-bold text-navy-800">Özet</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {SECTIONS.map((s, i) => (
          <Link key={s} href={`/admin/icerikler?bolum=${s}`} className="rounded-2xl bg-white p-5 ring-1 ring-line hover:ring-teal-500">
            <p className="text-sm text-muted">{SECTION_LABELS[s]}</p>
            <p className="mt-1 text-3xl font-bold text-navy-800">{counts[i]}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/icerikler/yeni?bolum=NEWS" className="rounded-lg bg-teal-500 px-5 py-2.5 font-semibold text-white hover:bg-teal-600">+ Duyuru ekle</Link>
        <Link href="/admin/icerikler/yeni?bolum=PUBLICATION" className="rounded-lg bg-navy-700 px-5 py-2.5 font-semibold text-white hover:bg-navy-800">+ Yayın ekle</Link>
        <Link href="/admin/icerikler/yeni?bolum=RECENT" className="rounded-lg bg-white px-5 py-2.5 font-semibold text-navy-800 ring-1 ring-line hover:ring-teal-500">+ Kitap ekle</Link>
      </div>
    </>
  );
}
