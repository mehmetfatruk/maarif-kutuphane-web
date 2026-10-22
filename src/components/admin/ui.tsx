"use client";

export const inputClass =
  "mt-1.5 h-11 w-full rounded-lg border border-line bg-white px-3 text-[15px] focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30";

export function SubmitButton({
  children,
  pending,
  pendingLabel = "Kaydediliyor…",
}: {
  children: React.ReactNode;
  pending: boolean;
  pendingLabel?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center rounded-lg bg-navy-700 px-6 font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

/** Silme gibi geri alınamaz işlemler için onay isteyen form. */
export function ConfirmForm({
  action,
  id,
  message,
  children,
}: {
  action: (form: FormData) => Promise<void>;
  id: number;
  message: string;
  children: React.ReactNode;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm font-semibold text-red-600 hover:text-red-800">
        {children}
      </button>
    </form>
  );
}

export function Notice({ kind = "ok", children }: { kind?: "ok" | "error"; children: React.ReactNode }) {
  return (
    <p className={`rounded-lg p-3 text-sm ${kind === "ok" ? "bg-teal-100 text-navy-800" : "bg-red-50 text-red-700"}`}>
      {children}
    </p>
  );
}
