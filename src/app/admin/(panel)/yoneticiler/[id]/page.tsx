import { notFound } from "next/navigation";
import { UserForm } from "@/components/admin/UserForm";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const user = Number.isInteger(id)
    ? await db.user.findUnique({ where: { id }, select: { id: true, name: true, email: true } })
    : null;
  if (!user) notFound();
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-navy-800">Yöneticiyi düzenle</h1>
      <UserForm user={user} />
    </>
  );
}
