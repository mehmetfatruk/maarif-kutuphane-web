"use client";

import { LIBRARIES } from "@/data/libraries";
import { useFormAction } from "@/lib/use-form-action";
import { submitPurchase, type FormState } from "./actions";

const input =
  "mt-1.5 h-11 w-full rounded-lg border border-line bg-white px-3 text-[15px] focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30";

function Field({ name, label, error, children, wide }: { name: string; label: string; error?: string; children?: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-sm font-semibold text-navy-800">{label}</span>
      {children ?? <input name={name} className={input} />}
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
}

export function PurchaseForm() {
  const [state, onSubmit, pending] = useFormAction<FormState>(submitPurchase, {});

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-teal-500/40 bg-teal-100 p-8 text-center">
        <h2 className="text-xl font-semibold text-navy-800">Öneriniz alındı, teşekkür ederiz.</h2>
        <p className="mt-2 text-muted">En kısa sürede değerlendireceğiz.</p>
      </div>
    );
  }

  const err = state.fieldErrors ?? {};
  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-lg font-semibold text-navy-800">Kaynak bilgileri</legend>
        <Field name="baslik" label="Başlık *" error={err.baslik} wide>
          <input name="baslik" required className={input} />
        </Field>
        <Field name="yazar" label="Yazar" />
        <Field name="yayinci" label="Yayıncı" />
        <Field name="numara" label="Standart numara (ISBN/ISSN)" />
        <Field name="teliftarihi" label="Telif tarihi" />
        <Field name="yayinyeri" label="Yayın yeri" />
        <Field name="kolleksiyon" label="Koleksiyon başlığı" />
        <Field name="materyal" label="Materyal türü">
          <select name="materyal" className={input} defaultValue="">
            <option value="">Seçiniz</option>
            {["Kitap", "CD / DVD", "Dergi", "E-Kitap"].map((m) => <option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field name="miktar" label="Miktar">
          <input name="miktar" type="number" min={1} className={input} />
        </Field>
        <Field name="kutuphane" label="Kütüphane" wide>
          <select name="kutuphane" className={input} defaultValue="">
            <option value="">Seçiniz</option>
            {LIBRARIES.map((lib) => <option key={lib.code}>{lib.name}</option>)}
          </select>
        </Field>
        <Field name="oneri" label="Öneri nedeni" wide>
          <select name="oneri" className={input} defaultValue="">
            <option value="">Seçiniz</option>
            {["Popüler kitap olması", "Ders kaynağı olması", "Kütüphanedeki kitabın yıpranmış olması", "Diğer"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field name="not" label="Notlar" wide>
          <textarea name="not" rows={5} className={`${input} h-auto py-2`} />
        </Field>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-1 text-lg font-semibold text-navy-800">İletişim bilgileriniz</legend>
        <p className="text-sm text-muted sm:col-span-2">İsteğe bağlı; size geri dönüş yapabilmemiz için.</p>
        <Field name="adsoyad" label="Ad soyad" />
        <Field name="eposta" label="E-posta" error={err.eposta}>
          <input name="eposta" type="email" className={input} />
        </Field>
      </fieldset>

      {/* Bot tuzağı: kullanıcılar görmez. */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      {state.error && <p className="rounded-lg bg-red-50 p-4 text-red-700">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center rounded-lg bg-teal-500 px-8 font-semibold text-white hover:bg-teal-600 disabled:opacity-60"
      >
        {pending ? "Gönderiliyor…" : "Öneriyi gönder"}
      </button>
    </form>
  );
}
