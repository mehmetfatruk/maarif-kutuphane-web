"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { sendForm } from "@/lib/mail";

export type FormState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };

const text = (max: number) => z.string().trim().max(max).default("");

const schema = z.object({
  baslik: z.string().trim().min(1, "Başlık zorunludur.").max(300),
  yazar: text(200),
  teliftarihi: text(50),
  numara: text(50),
  yayinci: text(200),
  kolleksiyon: text(200),
  yayinyeri: text(100),
  miktar: text(20),
  materyal: text(50),
  kutuphane: text(200),
  oneri: text(100),
  not: text(3000),
  adsoyad: text(120),
  eposta: z.union([z.literal(""), z.email("Geçerli bir e-posta adresi girin.")]).default(""),
});

const LABELS: Record<keyof z.infer<typeof schema>, string> = {
  baslik: "Başlık",
  yazar: "Yazar",
  teliftarihi: "Telif tarihi",
  numara: "Standart numara (ISBN/ISSN)",
  yayinci: "Yayıncı",
  kolleksiyon: "Koleksiyon başlığı",
  yayinyeri: "Yayın yeri",
  miktar: "Miktar",
  materyal: "Materyal türü",
  kutuphane: "Kütüphane",
  oneri: "Öneri nedeni",
  not: "Notlar",
  adsoyad: "Öneren",
  eposta: "E-posta",
};

// Aynı adresten kısa sürede çok sayıda gönderimi sınırlar.
const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;

export async function submitPurchase(_prev: FormState, form: FormData): Promise<FormState> {
  // Botlar için gizli alan: dolu gelirse sessizce başarılı say.
  if (form.get("website")) return { ok: true };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const times = (recent.get(ip) ?? []).filter((t) => Date.now() - t < WINDOW_MS);
  if (times.length >= LIMIT) return { error: "Çok fazla öneri gönderdiniz. Lütfen biraz sonra tekrar deneyin." };

  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { fieldErrors };
  }

  try {
    const data = parsed.data;
    await sendForm(
      `Satın Alma Önerisi: ${data.baslik}`,
      (Object.keys(LABELS) as (keyof typeof LABELS)[]).map((k) => [LABELS[k], data[k]]),
      data.eposta || undefined,
    );
  } catch (error) {
    console.error("Satın alma önerisi gönderilemedi", error);
    return { error: "Öneriniz şu an gönderilemedi. Lütfen daha sonra tekrar deneyin." };
  }

  recent.set(ip, [...times, Date.now()]);
  return { ok: true };
}
