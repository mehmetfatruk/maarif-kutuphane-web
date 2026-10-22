import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR } from "./config";

const KINDS = {
  image: { dir: "images", maxBytes: 8 * 1024 * 1024, ext: [".jpg", ".jpeg", ".png", ".webp", ".gif"] },
  document: { dir: "documents", maxBytes: 50 * 1024 * 1024, ext: [".pdf"] },
} as const;

export type MediaKind = keyof typeof KINDS;

export const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
};

export class UploadError extends Error {}

/** Dosyayı doğrular, rastgele adla kaydeder ve /media altındaki yolunu döndürür. */
export async function saveUpload(file: File, kind: MediaKind): Promise<string> {
  const rule = KINDS[kind];
  const ext = path.extname(file.name).toLowerCase();
  if (!(rule.ext as readonly string[]).includes(ext)) {
    throw new UploadError(`${file.name}: izin verilen türler ${rule.ext.join(", ")}`);
  }
  if (file.size > rule.maxBytes) {
    throw new UploadError(`${file.name}: en fazla ${rule.maxBytes / 1024 / 1024} MB olabilir`);
  }
  const base = path
    .basename(file.name, ext)
    .normalize("NFKD")
    .replace(/[^\w-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const name = `${base ? `${base}-` : ""}${randomBytes(6).toString("hex")}${ext}`;
  await mkdir(path.join(UPLOAD_DIR, rule.dir), { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, rule.dir, name), Buffer.from(await file.arrayBuffer()));
  return `${rule.dir}/${name}`;
}

/** /media altındaki bir yolu güvenli biçimde mutlak dosya yoluna çevirir; klasör dışına çıkışı engeller. */
export function resolveMedia(relative: string): string | null {
  const full = path.resolve(UPLOAD_DIR, relative);
  return full.startsWith(UPLOAD_DIR + path.sep) ? full : null;
}

export async function deleteMedia(relative: string | null | undefined) {
  if (!relative) return;
  const full = resolveMedia(relative);
  if (full) await unlink(full).catch(() => undefined);
}

/** Formdaki boş olmayan dosyaları döndürür (tarayıcı boş alan için 0 baytlık dosya gönderir). */
export function filesFrom(form: FormData, field: string): File[] {
  return form.getAll(field).filter((f): f is File => f instanceof File && f.size > 0);
}
