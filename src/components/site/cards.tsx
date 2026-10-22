import type { Post } from "@prisma/client";
import Link from "next/link";
import { excerpt } from "@/lib/html";
import { mediaUrl } from "@/lib/media-url";
import { ArrowRight, Book } from "./icons";

/** Kitap kapağı: sırtta ince bir gölge ile basılı kitap görünümü. */
function Cover({ src, title }: { src?: string; title: string }) {
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-r-[3px] rounded-l-[1px] bg-navy-100 shadow-[0_12px_20px_-10px_rgb(11_32_54/0.55)] ring-1 ring-navy-950/10">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={mediaUrl(src)} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-full flex-col justify-between bg-navy-800 p-3 text-white">
          <Book className="size-6 text-teal-400" />
          <span className="font-display text-sm leading-tight">{title}</span>
        </div>
      )}
      <span aria-hidden className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/25 to-transparent" />
    </div>
  );
}

/** Raf üzerindeki kitap; bağlantı varsa (ör. katalog kaydı) yeni sekmede açar. */
export function BookCard({ post, className = "" }: { post: Post; className?: string }) {
  const inner = (
    <>
      <div className="transition-transform duration-300 group-hover:-translate-y-2">
        <Cover src={post.images[0]} title={post.title} />
      </div>
    </>
  );
  const wrap = `group block ${className}`;
  return post.link ? (
    <a href={post.link} target="_blank" rel="noopener noreferrer" className={wrap} title={post.title}>{inner}</a>
  ) : (
    <div className={wrap} title={post.title}>{inner}</div>
  );
}

/** Rafın altındaki künye: başlık ve yazar. */
export function BookCaption({ post }: { post: Post }) {
  return (
    <div className="mt-5">
      <p className="line-clamp-2 font-display font-semibold leading-snug text-navy-900">{post.title}</p>
      {post.subtitle && <p className="mt-1 line-clamp-1 text-sm text-muted">{post.subtitle}</p>}
    </div>
  );
}

/** Kitapları bir raf üzerinde yan yana dizer; dar ekranda yatay kaydırılır. */
export function Shelf({ posts }: { posts: Post[] }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
      <ul className="shelf flex min-w-max gap-6 px-6 pb-[14px] pt-4 sm:gap-8">
        {posts.map((post) => (
          <li key={post.id} className="w-32 shrink-0 sm:w-36">
            <BookCard post={post} />
          </li>
        ))}
      </ul>
      <ul className="flex min-w-max gap-6 px-6 sm:gap-8">
        {posts.map((post) => (
          <li key={post.id} className="w-32 shrink-0 sm:w-36">
            <BookCaption post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NewsCard({ post }: { post: Post }) {
  const image = post.images[0];
  return (
    <Link href={`/haberler-duyurular/${post.slug}`} className="group flex flex-col">
      <div className="aspect-[16/10] overflow-hidden rounded bg-paper ring-1 ring-line">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl(image)} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
        ) : (
          <div className="pattern-knot flex h-full items-end bg-navy-800 p-5">
            <span className="label-mono text-teal-400">Duyuru</span>
          </div>
        )}
      </div>
      {post.date && <p className="label-mono mt-5 text-teal-600">{post.date}</p>}
      <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-navy-900 group-hover:text-teal-600">{post.title}</h3>
      <p className="mt-2 line-clamp-3 text-[15px] leading-6 text-muted">{post.subtitle || excerpt(post.body)}</p>
    </Link>
  );
}

/** Duyuru panosu satırı: solda tarih, sağda başlık ve özet. */
export function NewsRow({ post }: { post: Post }) {
  return (
    <Link href={`/haberler-duyurular/${post.slug}`} className="group grid gap-2 border-t border-line py-6 sm:grid-cols-[9rem_1fr] sm:gap-6">
      <p className="label-mono pt-1.5 text-teal-600">{post.date ?? "Duyuru"}</p>
      <div>
        <h3 className="font-display text-xl font-semibold leading-snug text-navy-900 group-hover:text-teal-600">{post.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-[15px] leading-6 text-muted">{post.subtitle || excerpt(post.body)}</p>
      </div>
    </Link>
  );
}

/** Bölüm başlığı; isteğe bağlı Dewey sınıf numarası künye olarak üstte durur. */
export function SectionTitle({
  title,
  callNumber,
  href,
  linkLabel,
  light,
}: {
  title: string;
  callNumber?: string;
  href?: string;
  linkLabel?: string;
  light?: boolean;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {callNumber && <p className={`label-mono ${light ? "text-teal-400" : "text-teal-600"}`}>{callNumber}</p>}
        <h2 className={`mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl ${light ? "text-white" : "text-navy-900"}`}>{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className={`inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold ${light ? "text-teal-400 hover:text-white" : "text-teal-600 hover:text-navy-900"}`}
        >
          {linkLabel ?? "Tümü"} <ArrowRight />
        </Link>
      )}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded border border-dashed border-line bg-paper p-8 text-center text-muted">{children}</p>;
}
