"use client";

import { startTransition, useActionState } from "react";

/**
 * useActionState gibi çalışır ama formu `action` yerine onSubmit ile gönderir.
 * Böylece React 19'un gönderimden sonra formu otomatik sıfırlaması devre dışı kalır;
 * doğrulama hatasında kullanıcının yazdıkları ve seçtiği dosyalar kaybolmaz.
 */
export function useFormAction<S>(action: (state: Awaited<S>, form: FormData) => Promise<S>, initial: Awaited<S>) {
  const [state, dispatch, pending] = useActionState<S, FormData>(action, initial);
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    startTransition(() => dispatch(form));
  };
  return [state, onSubmit, pending] as const;
}
