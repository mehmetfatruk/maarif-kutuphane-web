// Eski Laravel sitesinin MySQL veritabanındaki içerikleri, yöneticileri ve yüklenen dosyaları aktarır.
// Tekrar çalıştırılabilir: aynı eski kayıt (legacyId) güncellenir, kopya oluşmaz.
//
// Kullanım:
//   LEGACY_DATABASE_URL="mysql://kullanici:sifre@sunucu:3306/veritabani" \
//   LEGACY_PUBLIC_DIR="/yol/MaarifL/public" \
//   pnpm import:legacy
import { copyFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { PrismaClient, type Section } from "@prisma/client";
import mysql, { type RowDataPacket } from "mysql2/promise";
import { cleanHtml } from "../src/lib/html";
import { toSlug } from "../src/lib/slug-base";

const db = new PrismaClient();
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? "uploads");

// Eski "cat" değerleri: 1-5 içerik bölümleri, 6-10 sabit sayfalar.
const SECTION_BY_CAT: Record<string, Section> = { "1": "FEATURED", "2": "POPULAR", "3": "RECENT", "4": "NEWS", "5": "PUBLICATION" };
const PAGE_BY_CAT: Record<string, string> = {
  "6": "hakkimizda",
  "7": "kutuphane-kurallari",
  "8": "kutuphane-katalogu",
  "9": "acik-erisim",
  "10": "hizmetlerimiz",
};

type LegacyRow = RowDataPacket & {
  id: number;
  cat: string | null;
  img: string | null;
  dokuman: string | null;
  date: string | null;
  title: string | null;
  subtitle: string | null;
  desc: string | null;
  link: string | null;
  slug: string | null;
  created_at: Date | null;
};

async function copyAsset(publicDir: string | undefined, from: string, to: string): Promise<string | null> {
  if (!publicDir) return null;
  const source = path.join(publicDir, from);
  if (!existsSync(source)) {
    console.warn(`  ! dosya bulunamadı: ${source}`);
    return null;
  }
  await mkdir(path.dirname(path.join(UPLOAD_DIR, to)), { recursive: true });
  await copyFile(source, path.join(UPLOAD_DIR, to));
  return to;
}

function parseImages(img: string | null): string[] {
  if (!img) return [];
  try {
    const list = JSON.parse(img);
    return Array.isArray(list) ? list.map(String) : [];
  } catch {
    return [];
  }
}

async function main() {
  const url = process.env.LEGACY_DATABASE_URL;
  if (!url) throw new Error("LEGACY_DATABASE_URL verin (ör. mysql://kullanici:sifre@sunucu/veritabani).");
  const publicDir = process.env.LEGACY_PUBLIC_DIR;
  if (!publicDir) console.warn("LEGACY_PUBLIC_DIR verilmedi; görseller ve PDF'ler kopyalanmayacak.");

  const legacy = await mysql.createConnection(url);
  const [rows] = await legacy.query<LegacyRow[]>("SELECT * FROM icerik ORDER BY id");
  const usedSlugs = new Set((await db.post.findMany({ select: { slug: true, legacyId: true } })).filter((p) => !p.legacyId).map((p) => p.slug));

  let posts = 0;
  let pages = 0;
  for (const row of rows) {
    const cats = (row.cat ?? "").split(",").map((c) => c.trim()).filter(Boolean);
    const pageKey = cats.length === 1 ? PAGE_BY_CAT[cats[0]] : undefined;
    if (pageKey) {
      const body = cleanHtml(row.desc ?? "");
      await db.page.upsert({ where: { key: pageKey }, create: { key: pageKey, body }, update: { body } });
      pages++;
      continue;
    }

    const sections = [...new Set(cats.map((c) => SECTION_BY_CAT[c]).filter(Boolean))];
    if (!sections.length || !row.title) {
      console.warn(`  - atlandı #${row.id} (bölüm veya başlık yok)`);
      continue;
    }

    const images: string[] = [];
    for (const name of parseImages(row.img)) {
      const copied = await copyAsset(publicDir, `images/${name}`, `images/${name}`);
      if (copied) images.push(copied);
    }
    const document = row.dokuman ? await copyAsset(publicDir, `uploads/${row.dokuman}`, `documents/${row.dokuman}`) : null;

    // Eski adresler korunur; çakışma olursa sonuna kayıt numarası eklenir.
    let slug = row.slug || toSlug(row.title);
    if (usedSlugs.has(slug)) slug = `${slug}-${row.id}`;
    usedSlugs.add(slug);

    const data = {
      sections,
      title: row.title.trim(),
      subtitle: row.subtitle?.trim() || null,
      body: cleanHtml(row.desc ?? ""),
      link: row.link?.trim() || null,
      date: row.date?.trim() || null,
      images,
      document,
      slug,
    };
    await db.post.upsert({
      where: { legacyId: row.id },
      create: { ...data, legacyId: row.id, createdAt: row.created_at ?? undefined },
      update: data,
    });
    posts++;
  }

  const [users] = await legacy.query<RowDataPacket[]>("SELECT name, email, password FROM users");
  for (const u of users) {
    const email = String(u.email).trim().toLowerCase();
    await db.user.upsert({
      where: { email },
      create: { email, name: String(u.name), passwordHash: String(u.password) },
      update: {},
    });
  }

  await legacy.end();
  console.log(`Aktarıldı: ${posts} içerik, ${pages} sabit sayfa, ${users.length} yönetici.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
