"use client";

import Link from "next/link";
import { saveUser, type ActionState } from "@/app/admin/actions";
import { useFormAction } from "@/lib/use-form-action";
import { inputClass, Notice, SubmitButton } from "./ui";

export function UserForm({ user }: { user?: { id: number; name: string; email: string } }) {
  const [state, onSubmit, pending] = useFormAction<ActionState>(saveUser, {});
  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-5 rounded-2xl bg-white p-6 ring-1 ring-line">
      {user && <input type="hidden" name="id" value={user.id} />}
      <label className="block">
        <span className="text-sm font-semibold text-navy-800">Ad soyad</span>
        <input name="name" required defaultValue={user?.name} className={inputClass} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-navy-800">E-posta</span>
        <input name="email" type="email" required defaultValue={user?.email} autoComplete="off" className={inputClass} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-navy-800">{user ? "Yeni şifre" : "Şifre"}</span>
        <input name="password" type="password" minLength={10} required={!user} autoComplete="new-password" className={inputClass} />
        <span className="mt-1 block text-xs text-muted">
          En az 10 karakter.{user && " Değiştirmek istemiyorsanız boş bırakın."}
        </span>
      </label>
      {state.error && <Notice kind="error">{state.error}</Notice>}
      <div className="flex items-center gap-4">
        <SubmitButton pending={pending}>Kaydet</SubmitButton>
        <Link href="/admin/yoneticiler" className="font-semibold text-muted hover:text-navy-800">Vazgeç</Link>
      </div>
    </form>
  );
}
