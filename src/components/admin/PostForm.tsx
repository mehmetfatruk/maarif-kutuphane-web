"use client";

import type { Post, Section } from "@prisma/client";
import Link from "next/link";
import { savePost, type ActionState } from "@/app/admin/actions";
import { mediaUrl } from "@/lib/media-url";
import { useFormAction } from "@/lib/use-form-action";
import { SECTION_LABELS } from "@/lib/sections";
import { RichEditor } from "./RichEditor";
import { inputClass, Notice, SubmitButton } from "./ui";

const SECTION_HELP: Record<Section, string> = {
  FEATURED: "Anasayfada büyük kapakla",
  POPULAR: "Anasayfa kitap şeridi",
  RECENT: "Anasayfa kitap şeridi",
  NEWS: "Haberler sayfası ve anasayfa",
  PUBLICATION: "Maarif Yayınları sayfası",
};

export function PostForm({ post, defaultSection }: { post?: Post; defaultSection?: Section }) {
  const [state, onSubmit, pending] = useFormAction<ActionState>(savePost, {});
  const sections = post?.sections ?? (defaultSection ? [defaultSection] : []);

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {post && <input type="hidden" name="id" value={post.id} />}

      <section className="rounded-2xl bg-white p-6 ring-1 ring-line">
        <h2 className="font-semibold text-navy-800">Nerede görünsün? *</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {(Object.keys(SECTION_LABELS) as Section[]).map((s) => (
            <label key={s} className="flex cursor-pointer gap-3 rounded-lg border border-line p-3 has-[:checked]:border-teal-500 has-[:checked]:bg-teal-100/50">
              <input type="checkbox" name="sections" value={s} defaultChecked={sections.includes(s)} className="mt-1 accent-teal-600" />
              <span>
                <span className="block text-sm font-semibold text-navy-800">{SECTION_LABELS[s]}</span>
                <span className="block text-xs text-muted">{SECTION_HELP[s]}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-5 rounded-2xl bg-white p-6 ring-1 ring-line sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-navy-800">Başlık *</span>
          <input name="title" required defaultValue={post?.title} className={inputClass} />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-navy-800">Alt başlık / yazar</span>
          <input name="subtitle" defaultValue={post?.subtitle ?? ""} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-navy-800">Tarih</span>
          <input name="date" placeholder="ör. 15 Haziran 2026" defaultValue={post?.date ?? ""} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-navy-800">Bağlantı</span>
          <input name="link" type="url" placeholder="https://katalog.turkiyemaarif.org/…" defaultValue={post?.link ?? ""} className={inputClass} />
          <span className="mt-1 block text-xs text-muted">Kitap kartına tıklanınca açılır (ör. katalog kaydı).</span>
        </label>
        <div className="sm:col-span-2">
          <span className="text-sm font-semibold text-navy-800">Metin</span>
          <div className="mt-1.5">
            <RichEditor name="body" initialHtml={post?.body ?? ""} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 rounded-2xl bg-white p-6 ring-1 ring-line lg:grid-cols-2">
        <div>
          <h2 className="font-semibold text-navy-800">Görseller</h2>
          <p className="text-sm text-muted">İlk görsel kapak olarak kullanılır. JPG, PNG, WEBP; en fazla 8 MB.</p>
          {post && post.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {post.images.map((img) => (
                <label key={img} className="group relative block cursor-pointer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mediaUrl(img)} alt="" className="aspect-[3/4] w-full rounded-lg object-cover ring-1 ring-line group-has-[:checked]:opacity-30" />
                  <span className="mt-1 flex items-center gap-1.5 text-xs text-red-700">
                    <input type="checkbox" name="removeImages" value={img} className="accent-red-600" /> Sil
                  </span>
                </label>
              ))}
            </div>
          )}
          <input name="images" type="file" multiple accept=".jpg,.jpeg,.png,.webp,.gif" className="mt-4 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-navy-100 file:px-4 file:py-2 file:font-semibold file:text-navy-800" />
        </div>
        <div>
          <h2 className="font-semibold text-navy-800">Belge (PDF)</h2>
          <p className="text-sm text-muted">Yayınlar için dergi/kitap dosyası; en fazla 50 MB.</p>
          {post?.document && (
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              <a href={mediaUrl(post.document)} target="_blank" className="font-medium text-teal-600 underline">
                {post.document.split("/").pop()}
              </a>
              <label className="flex items-center gap-1.5 text-red-700">
                <input type="checkbox" name="removeDocument" className="accent-red-600" /> Belgeyi sil
              </label>
            </div>
          )}
          <input name="document" type="file" accept=".pdf" className="mt-4 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-navy-100 file:px-4 file:py-2 file:font-semibold file:text-navy-800" />
        </div>
      </section>

      {state.error && <Notice kind="error">{state.error}</Notice>}

      <div className="flex items-center gap-4">
        <SubmitButton pending={pending}>{post ? "Değişiklikleri kaydet" : "İçeriği yayınla"}</SubmitButton>
        <Link href="/admin/icerikler" className="font-semibold text-muted hover:text-navy-800">Vazgeç</Link>
      </div>
    </form>
  );
}
