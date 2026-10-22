import { db } from "./db";
import { toSlug } from "./slug-base";

/** Başlıktan benzersiz bir adres üretir; çakışmada sonuna -2, -3 ... ekler. */
export async function uniqueSlug(title: string, exceptId?: number): Promise<string> {
  const base = toSlug(title);
  for (let n = 1; ; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    const existing = await db.post.findUnique({ where: { slug }, select: { id: true } });
    if (!existing || existing.id === exceptId) return slug;
  }
}
