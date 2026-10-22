import type { Post } from "@prisma/client";
import Link from "next/link";
import { excerpt } from "@/lib/html";
import { mediaUrl } from "@/lib/media-url";
import { ArrowRight, Book, Calendar } from "./icons";

/** Kitap kapağı kartı; bağlantı varsa (ör. katalog kaydı) yeni sekmede açar. */
export function BookCard({ post, className = "" }: { post: Post; className?: string }) {
  const cover = post.images[0];
  const inner = (
    <>
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-navy-50 shadow-md shadow-navy-900/10 ring-1 ring-line transition-transform duration-300 group-hover:-translate-y-1">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl(cover)} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-navy-600"><Book /></div>
        )}
      </div>
      <p className="mt-3 line-clamp-2 font-semibold leading-snug text-navy-800 group-hover:text-teal-600">{post.title}</p>
      {post.subtitle && <p className="mt-1 line-clamp-1 text-sm text-muted">{post.subtitle}</p>}
    </>
  );
  return post.link ? (
    <a href={post.link} target="_blank" rel="noopener noreferrer" className={`group block ${className}`}>{inner}</a>
  ) : (
    <div className={`group ${className}`}>{inner}</div>
  );
}

export function NewsCard({ post }: { post: Post }) {
  const image = post.images[0];
  return (
    <Link
      href={`/haberler-duyurular/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-xl hover:shadow-navy-900/10"
    >
      {image && (
        <div className="aspect-[16/9] overflow-hidden bg-navy-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaUrl(image)} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        {post.date && (
          <p className="flex items-center gap-1.5 text-sm text-muted"><Calendar /> {post.date}</p>
        )}
        <h3 className="mt-2 text-lg font-semibold leading-snug text-navy-800 group-hover:text-teal-600">{post.title}</h3>
        <p className="mt-2 line-clamp-3 text-[15px] leading-6 text-muted">{post.subtitle || excerpt(post.body)}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-teal-600">
          Devamını oku <ArrowRight />
        </span>
      </div>
    </Link>
  );
}

export function SectionTitle({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <span className="block h-1 w-12 rounded-full bg-teal-500" aria-hidden />
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy-800 sm:text-3xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-navy-700">
          {linkLabel ?? "Tümü"} <ArrowRight />
        </Link>
      )}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-dashed border-line bg-navy-50 p-8 text-center text-muted">{children}</p>;
}
