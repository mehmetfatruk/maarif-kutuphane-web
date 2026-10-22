import "server-only";
import type { Section } from "@prisma/client";
import { db } from "./db";
import type { PageKey } from "./sections";

export function postsIn(section: Section, take?: number) {
  return db.post.findMany({
    where: { sections: { has: section } },
    orderBy: { id: "desc" },
    take,
  });
}

export function postBySlug(slug: string, section: Section) {
  return db.post.findFirst({ where: { slug, sections: { has: section } } });
}

export async function pageBody(key: PageKey): Promise<string> {
  const page = await db.page.findUnique({ where: { key } });
  return page?.body ?? "";
}
