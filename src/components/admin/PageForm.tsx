"use client";

import { savePage, type ActionState } from "@/app/admin/actions";
import { useFormAction } from "@/lib/use-form-action";
import { RichEditor } from "./RichEditor";
import { Notice, SubmitButton } from "./ui";

export function PageForm({ pageKey, body }: { pageKey: string; body: string }) {
  const [state, onSubmit, pending] = useFormAction<ActionState>(savePage, {});
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input type="hidden" name="key" value={pageKey} />
      <RichEditor name="body" initialHtml={body} />
      {state.error && <Notice kind="error">{state.error}</Notice>}
      {state.ok && <Notice>{state.ok}</Notice>}
      <SubmitButton pending={pending}>Kaydet</SubmitButton>
    </form>
  );
}
