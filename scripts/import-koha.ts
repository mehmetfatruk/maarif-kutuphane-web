// Koha kataloğundaki kitapları (biblionumber ile) anasayfa bölümlerine ekler: ad, yazar, kapak ve katalog bağlantısı.
// Tekrar çalıştırılabilir: aynı kitap güncellenir.
//
// Kullanım:
//   pnpm import:koha --bolum POPULAR 7383 7377 7375
//   pnpm import:koha --bolum FEATURED,POPULAR 8042
// Bölümler: FEATURED (Öne Çıkanlar), POPULAR (Çok Okunanlar), RECENT (Son Eklenenler)
import { PrismaClient, type Section } from "@prisma/client";
import * as cheerio from "cheerio";
import { download, fetchText } from "./lib";
import { toSlug } from "../src/lib/slug-base";

const db = new PrismaClient();
const OPAC = (process.env.KOHA_OPAC_URL ?? "https://katalog.turkiyemaarif.org").replace(/\/$/, "");

type Book = { title: string; author?: string; isbn?: string; publisher?: string; year?: string; cover?: string };

function clean(text: string | undefined): string | undefined {
  const t = text?.replace(/\s+/g, " ").replace(/[\s/:;,.]+$/, "").trim();
  return t || undefined;
}

async function readBook(biblionumber: number): Promise<Book> {
  const $ = cheerio.load(await fetchText(`${OPAC}/cgi-bin/koha/opac-detail.pl?biblionumber=${biblionumber}`));
  const title = clean($("h1.title, h2.title, .title[property='name']").first().text());
  if (!title) throw new Error("kitap adı bulunamadı (kayıt gizli ya da silinmiş olabilir)");
  return {
    title,
    author: clean($("[property='author'] [property='name'], .author a, h5.author a").first().text()),
    isbn: clean($("[property='isbn']").first().text())?.replace(/[^\dX]/gi, ""),
    publisher: clean($("[property='publisher'] [property='name']").first().text()),
    year: clean($("[property='datePublished']").first().text()),
    cover: $("meta[property='og:image']").attr("content"),
  };
}

/** Sırayla dener: Koha'nın kendi kapağı, sayfadaki og:image, Open Library, Google Books. */
async function findCover(biblionumber: number, book: Book): Promise<string | null> {
  const candidates = [`${OPAC}/cgi-bin/koha/opac-image.pl?biblionumber=${biblionumber}`];
  if (book.cover && !book.cover.includes("logo")) candidates.push(new URL(book.cover, OPAC).toString());
  if (book.isbn) {
    candidates.push(`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`);
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}`);
      const json = (await res.json()) as { items?: { volumeInfo?: { imageLinks?: { thumbnail?: string } } }[] };
      const thumb = json.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
      if (thumb) candidates.push(thumb.replace("http://", "https://").replace("zoom=1", "zoom=2"));
    } catch {
      // Google Books erişilemezse diğer kaynaklarla devam edilir.
    }
  }
  for (const url of candidates) {
    const saved = await download(url, "images");
    if (saved) return saved;
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const flag = args.indexOf("--bolum");
  const sections = (flag >= 0 ? args.splice(flag, 2)[1] : "POPULAR").split(",") as Section[];
  const numbers = args.map(Number).filter((n) => Number.isInteger(n) && n > 0);
  if (!numbers.length) throw new Error("En az bir biblionumber verin. Örnek: pnpm import:koha --bolum POPULAR 7383 7377");

  for (const n of numbers) {
    try {
      const book = await readBook(n);
      const link = `${OPAC}/cgi-bin/koha/opac-detail.pl?biblionumber=${n}`;
      const existing = await db.post.findFirst({ where: { link } });
      const cover = existing?.images[0] ?? (await findCover(n, book));
      const subtitle = [book.author, book.publisher, book.year].filter(Boolean).join(" · ") || null;
      const data = { title: book.title, subtitle, link, images: cover ? [cover] : [] };
      if (existing) {
        const merged = [...new Set([...existing.sections, ...sections])];
        await db.post.update({ where: { id: existing.id }, data: { ...data, sections: merged } });
      } else {
        await db.post.create({ data: { ...data, sections, slug: `${toSlug(book.title)}-${n}` } });
      }
      console.log(`✓ ${n}: ${book.title}${cover ? "" : " (kapak bulunamadı)"}`);
    } catch (error) {
      console.warn(`✗ ${n}: ${(error as Error).message}`);
    }
  }
}

main().finally(() => db.$disconnect());
