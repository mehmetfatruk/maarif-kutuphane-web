"use client";

import { useFormAction } from "@/lib/use-form-action";
import { login } from "./actions";

const input =
  "mt-1.5 h-11 w-full rounded-lg border border-line px-3 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30";

export function LoginForm() {
  const [state, onSubmit, pending] = useFormAction<{ error?: string }>(login, {});
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block">
        <span className="text-sm font-semibold text-navy-800">E-posta</span>
        <input name="email" type="email" autoComplete="username" required className={input} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-navy-800">Şifre</span>
        <input name="password" type="password" autoComplete="current-password" required className={input} />
      </label>
      {state.error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-lg bg-navy-700 font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
      >
        {pending ? "Giriş yapılıyor…" : "Giriş yap"}
      </button>
    </form>
  );
}
