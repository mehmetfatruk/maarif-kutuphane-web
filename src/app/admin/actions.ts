"use server";

import type { Section } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { hashPassword, requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { cleanHtml } from "@/lib/html";
import { deleteMedia, filesFrom, saveUpload, UploadError } from "@/lib/media";
import { isPageKey, SECTIONS } from "@/lib/sections";
import { uniqueSlug } from "@/lib/slug";

export type ActionState = { error?: string; ok?: string };

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\//i.test(v), "Bağlantı http:// veya https:// ile başlamalı.");

const postSchema = z.object({
  title: z.string().trim().min(1, "Başlık zorunludur.").max(300),
  subtitle: z.string().trim().max(500),
  link: optionalUrl,
  date: z.string().trim().max(50),
  body: z.string().max(200_000),
  sections: z.array(z.enum(SECTIONS as [Section, ...Section[]])).min(1, "En az bir bölüm seçin."),
});

export async function savePost(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireUser();
  const id = form.get("id") ? Number(form.get("id")) : null;

  const parsed = postSchema.safeParse({
    title: form.get("title") ?? "",
    subtitle: form.get("subtitle") ?? "",
    link: form.get("link") ?? "",
    date: form.get("date") ?? "",
    body: form.get("body") ?? "",
    sections: form.getAll("sections"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const data = parsed.data;

  const existing = id ? await db.post.findUnique({ where: { id } }) : null;
  if (id && !existing) return { error: "İçerik bulunamadı." };

  const removeImages = new Set(form.getAll("removeImages").map(String));
  const keptImages = (existing?.images ?? []).filter((img) => !removeImages.has(img));
  let document = existing?.document ?? null;
  const removedDocument = form.get("removeDocument") === "on" ? document : null;
  if (removedDocument) document = null;

  const newImages: string[] = [];
  let newDocument: string | null = null;
  try {
    for (const file of filesFrom(form, "images")) newImages.push(await saveUpload(file, "image"));
    const [doc] = filesFrom(form, "document");
    if (doc) newDocument = await saveUpload(doc, "document");
  } catch (error) {
    await Promise.all([...newImages, newDocument].map((p) => deleteMedia(p)));
    if (error instanceof UploadError) return { error: error.message };
    throw error;
  }

  const values = {
    title: data.title,
    subtitle: data.subtitle || null,
    link: data.link || null,
    date: data.date || null,
    body: cleanHtml(data.body),
    sections: data.sections,
    images: [...newImages, ...keptImages],
    document: newDocument ?? document,
  };

  if (existing) {
    const slug = existing.title === data.title ? existing.slug : await uniqueSlug(data.title, existing.id);
    await db.post.update({ where: { id: existing.id }, data: { ...values, slug } });
    // Yeni belge eskisinin yerine geçtiyse eskisini de sil.
    const replacedDocument = newDocument && existing.document !== removedDocument ? existing.document : null;
    await Promise.all([...removeImages, removedDocument, replacedDocument].map((p) => deleteMedia(p)));
  } else {
    await db.post.create({ data: { ...values, slug: await uniqueSlug(data.title) } });
  }

  revalidatePath("/", "layout");
  redirect("/admin/icerikler?kaydedildi=1");
}

export async function deletePost(form: FormData) {
  await requireUser();
  const post = await db.post.delete({ where: { id: Number(form.get("id")) } }).catch(() => null);
  if (post) await Promise.all([...post.images, post.document].map((p) => deleteMedia(p)));
  revalidatePath("/", "layout");
  redirect("/admin/icerikler?silindi=1");
}

export async function savePage(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireUser();
  const key = String(form.get("key"));
  if (!isPageKey(key)) return { error: "Geçersiz sayfa." };
  const body = cleanHtml(String(form.get("body") ?? ""));
  await db.page.upsert({ where: { key }, create: { key, body }, update: { body } });
  revalidatePath(`/${key}`);
  return { ok: "Sayfa kaydedildi." };
}

const userSchema = z.object({
  name: z.string().trim().min(1, "Ad zorunludur.").max(120),
  email: z.email("Geçerli bir e-posta girin.").transform((v) => v.toLowerCase()),
  password: z.string().max(200),
});

export async function saveUser(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireUser();
  const id = form.get("id") ? Number(form.get("id")) : null;
  const parsed = userSchema.safeParse({
    name: form.get("name") ?? "",
    email: String(form.get("email") ?? "").trim(),
    password: form.get("password") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { name, email, password } = parsed.data;

  if ((!id || password) && password.length < 10) return { error: "Şifre en az 10 karakter olmalı." };

  const clash = await db.user.findUnique({ where: { email } });
  if (clash && clash.id !== id) return { error: "Bu e-posta ile kayıtlı bir yönetici var." };

  const passwordHash = password ? await hashPassword(password) : undefined;
  if (id) {
    await db.user.update({ where: { id }, data: { name, email, ...(passwordHash && { passwordHash }) } });
  } else {
    await db.user.create({ data: { name, email, passwordHash: passwordHash! } });
  }
  redirect("/admin/yoneticiler?kaydedildi=1");
}

export async function deleteUser(form: FormData) {
  const me = await requireUser();
  const id = Number(form.get("id"));
  if (id === me.id) redirect("/admin/yoneticiler?hata=kendini-silemezsin");
  await db.user.delete({ where: { id } }).catch(() => null);
  redirect("/admin/yoneticiler?silindi=1");
}
