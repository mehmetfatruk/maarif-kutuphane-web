import Link from "next/link";
import { deleteUser } from "@/app/admin/actions";
import { ConfirmForm, Notice } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ kaydedildi?: string; silindi?: string; hata?: string }> };

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const me = await requireUser();
  const users = await db.user.findMany({ orderBy: { name: "asc" } });
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-navy-800">Yöneticiler</h1>
        <Link href="/admin/yoneticiler/yeni" className="rounded-lg bg-teal-500 px-5 py-2.5 font-semibold text-white hover:bg-teal-600">+ Yönetici ekle</Link>
      </div>
      <div className="mt-4 space-y-3">
        {params.kaydedildi && <Notice>Yönetici kaydedildi.</Notice>}
        {params.silindi && <Notice>Yönetici silindi.</Notice>}
        {params.hata && <Notice kind="error">Kendi hesabınızı silemezsiniz.</Notice>}
      </div>
      <ul className="mt-6 divide-y divide-line rounded-2xl bg-white ring-1 ring-line">
        {users.map((u) => (
          <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <p className="font-semibold text-navy-800">{u.name}{u.id === me.id && <span className="ml-2 text-xs font-normal text-muted">(siz)</span>}</p>
              <p className="text-sm text-muted">{u.email}</p>
            </div>
            <div className="flex gap-4">
              <Link href={`/admin/yoneticiler/${u.id}`} className="text-sm font-semibold text-teal-600">Düzenle</Link>
              {u.id !== me.id && (
                <ConfirmForm action={deleteUser} id={u.id} message={`${u.name} silinsin mi?`}>Sil</ConfirmForm>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
