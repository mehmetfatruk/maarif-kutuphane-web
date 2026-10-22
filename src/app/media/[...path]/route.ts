import { readFile } from "node:fs/promises";
import path from "node:path";
import { CONTENT_TYPES, resolveMedia } from "@/lib/media";

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  const full = resolveMedia(parts.join("/"));
  const type = full && CONTENT_TYPES[path.extname(full).toLowerCase()];
  if (!full || !type) return new Response("Bulunamadı", { status: 404 });
  try {
    const data = await readFile(full);
    return new Response(data, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Bulunamadı", { status: 404 });
  }
}
