// İçe aktarma betiklerinin ortak yardımcıları.
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? "uploads");

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "application/pdf": ".pdf",
};

export async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": "MaarifKutuphane-Import/1.0" } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.text();
}

/**
 * Uzak dosyayı indirip uploads altına kaydeder, /media altındaki yolunu döndürür.
 * Görsel değilse ya da çok küçükse (Koha'nın 1x1 "kapak yok" görseli gibi) null döner.
 */
export async function download(url: string, dir: "images" | "documents", minBytes = 2000): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "MaarifKutuphane-Import/1.0" }, redirect: "follow" });
    if (!res.ok) return null;
    const type = (res.headers.get("content-type") ?? "").split(";")[0].trim();
    const ext = EXT_BY_TYPE[type];
    if (!ext || (dir === "images") !== type.startsWith("image/")) return null;
    const data = Buffer.from(await res.arrayBuffer());
    if (data.length < minBytes) return null;
    const base = decodeURIComponent(path.basename(new URL(url).pathname, path.extname(new URL(url).pathname)))
      .normalize("NFKD")
      .replace(/[^\w-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50);
    const name = `${base && !base.includes("opac-image") ? `${base}-` : ""}${randomBytes(5).toString("hex")}${ext}`;
    await mkdir(path.join(UPLOAD_DIR, dir), { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, dir, name), data);
    return `${dir}/${name}`;
  } catch {
    return null;
  }
}
