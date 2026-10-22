// Yayındaki eski siteden (kutuphane.turkiyemaarif.org) sabit sayfaları, haberleri ve yayınları aktarır.
// Veritabanı yedeği olmadığında kullanılır; görseller ve PDF'ler de indirilir. Tekrar çalıştırılabilir.
//
// Kullanım: pnpm import:site            (adres: LEGACY_SITE_URL, varsayılan kutuphane.turkiyemaarif.org)
import { PrismaClient } from "@prisma/client";
import * as cheerio from "cheerio";
import { download, fetchText } from "./lib";
import { cleanHtml } from "../src/lib/html";
import { toSlug } from "../src/lib/slug-base";

const db = new PrismaClient();
const SITE = (process.env.LEGACY_SITE_URL ?? "https://kutuphane.turkiyemaarif.org").replace(/\/$/, "");
const PAGES = ["hakkimizda", "kutuphane-kurallari", "kutuphane-katalogu", "acik-erisim", "hizmetlerimiz"];

const abs = (href: string) => new URL(href, SITE + "/").toString();

/** Gövdedeki görselleri indirip yeni adreslerine çevirir, HTML'i temizler. */
async function localizeHtml(html: string): Promise<string> {
  const $ = cheerio.load(html, null, false);
  for (const img of $("img").toArray()) {
    const src = $(img).attr("src");
    const saved = src ? await download(abs(src), "images", 500) : null;
    if (saved) $(img).attr("src", `/media/${saved}`);
    else $(img).remove();
  }
  // Boş paragrafları at.
  $("p").each((_, p) => {
    if (!$(p).text().trim() && !$(p).find("img").length) $(p).remove();
  });
  return cleanHtml($.html());
}

async function importPages() {
  for (const key of PAGES) {
    try {
      const $ = cheerio.load(await fetchText(`${SITE}/${key}`));
      const box = $(".container .row.pt-5").first();
      box.find("h3.detail-title, hr, script, style").remove();
      const body = await localizeHtml(box.html() ?? "");
      await db.page.upsert({ where: { key }, create: { key, body }, update: { body } });
      console.log(`✓ sayfa: ${key} (${body.length} karakter)`);
    } catch (error) {
      console.warn(`✗ sayfa: ${key}: ${(error as Error).message}`);
    }
  }
}

async function importNews() {
  const $ = cheerio.load(await fetchText(`${SITE}/haberler-duyurular`));
  const links = [...new Set($("a.list-group-item").map((_, a) => $(a).attr("href")).get().filter(Boolean))];
  // Eski sitede en yeni haber en üstte; aynı sırayı korumak için en eskiden başlayarak ekle.
  for (const href of links.reverse()) {
    const url = abs(href);
    try {
      const page = cheerio.load(await fetchText(url));
      const col = page(".col-lg-8").first();
      const title = col.find("h3.detail-title").first().text().replace(/\s+/g, " ").trim();
      if (!title) throw new Error("başlık yok");
      const images: string[] = [];
      for (const img of col.find(".row img").toArray()) {
        const src = page(img).attr("src");
        const saved = src ? await download(abs(src), "images", 500) : null;
        if (saved) images.push(saved);
      }
      col.find("h3.detail-title, .row, script").remove();
      const body = await localizeHtml(col.html() ?? "");
      const slug = decodeURIComponent(new URL(url).pathname.split("/").pop() || toSlug(title));
      const data = { title, body, images, sections: ["NEWS" as const] };
      await db.post.upsert({ where: { slug }, create: { ...data, slug }, update: data });
      console.log(`✓ haber: ${title} (${images.length} görsel)`);
    } catch (error) {
      console.warn(`✗ haber: ${url}: ${(error as Error).message}`);
    }
  }
}

async function importPublications() {
  const $ = cheerio.load(await fetchText(`${SITE}/maarif-yayinlari`));
  const links = [
    ...new Set(
      $("a[href*='maarif-yayinlari/']")
        .map((_, a) => $(a).attr("href"))
        .get()
        .filter(Boolean),
    ),
  ];
  for (const href of links.reverse()) {
    const url = abs(href);
    try {
      const page = cheerio.load(await fetchText(url));
      const col = page(".col-lg-7").last();
      const title = col.find("h3.detail-title").first().text().replace(/\s+/g, " ").trim();
      if (!title) throw new Error("başlık yok");
      const docHref = col.find("a[href*='uploads/']").attr("href");
      const document = docHref ? await download(abs(docHref), "documents", 1000) : null;
      const imgSrc = col.find("img").attr("src");
      const cover = imgSrc ? await download(abs(imgSrc), "images", 500) : null;
      const date = col.find(".fa-calendar").parent().text().replace(/\s+/g, " ").trim() || null;
      const body = await localizeHtml(col.find("figcaption strong, figcaption > span").first().html() ?? "");
      const slug = decodeURIComponent(new URL(url).pathname.split("/").pop() || toSlug(title));
      const data = { title, body, date, document, images: cover ? [cover] : [], sections: ["PUBLICATION" as const] };
      await db.post.upsert({ where: { slug }, create: { ...data, slug }, update: data });
      console.log(`✓ yayın: ${title}${document ? "" : " (PDF bulunamadı)"}`);
    } catch (error) {
      console.warn(`✗ yayın: ${url}: ${(error as Error).message}`);
    }
  }
}

async function main() {
  await importPages();
  await importNews();
  await importPublications();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
