import type { Post } from "@prisma/client";
import Link from "next/link";
import { excerpt } from "@/lib/html";
import { mediaUrl } from "@/lib/media-url";
import { BookSlider } from "./BookSlider";
import { ArrowRight, Book } from "./icons";

/** Kitap kapağı: sırtta ince gölge ile basılı kitap görünümü. */
export function Cover({ src, title, className = "" }: { src?: string; title: string; className?: string }) {
  return (
    <div className={`relative aspect-[2/3] w-full overflow-hidden rounded-r-[4px] bg-navy-100 shadow-[0_18px_28px_-16px_rgb(14_24_34/0.6)] ring-1 ring-navy-950/10 ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={mediaUrl(src)} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-full flex-col justify-between bg-spine-forest p-3 text-white">
          <Book className="size-6 text-spine-ochre" />
          <span className="font-display text-sm font-bold leading-tight">{title}</span>
        </div>
      )}
      <span aria-hidden className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/30 via-white/10 to-transparent" />
    </div>
  );
}

/** Kapak ve künye; bağlantı varsa (ör. katalog kaydı) yeni sekmede açar. */
export function BookCard({ post, className = "" }: { post: Post; className?: string }) {
  const inner = (
    <>
      <div className="transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:-rotate-1">
        <Cover src={post.images[0]} title={post.title} />
      </div>
      <p className="mt-4 line-clamp-2 font-display text-[17px] font-bold leading-snug tracking-tight text-navy-900 group-hover:text-teal-600">{post.title}</p>
      {post.subtitle && <p className="mt-1 line-clamp-1 text-sm text-muted">{post.subtitle}</p>}
    </>
  );
  const wrap = `group block ${className}`;
  return post.link ? (
    <a href={post.link} target="_blank" rel="noopener noreferrer" className={wrap}>{inner}</a>
  ) : (
    <div className={wrap}>{inner}</div>
  );
}

/** Kapak kaydırıcısı: oklarla ya da parmakla kaydırılır. */
export function CoverRow({ posts, label }: { posts: Post[]; label: string }) {
  return (
    <BookSlider label={label}>
      {posts.map((post) => (
        <li key={post.id} className="w-40 shrink-0 snap-start sm:w-44">
          <BookCard post={post} />
        </li>
      ))}
    </BookSlider>
  );
}

export function NewsCard({ post }: { post: Post }) {
  const image = post.images[0];
  return (
    <Link href={`/haberler-duyurular/${post.slug}`} className="group flex flex-col">
      <div className="aspect-[4/3] overflow-hidden bg-paper">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl(image)} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" loading="lazy" />
        ) : (
          <div className="flex h-full items-end bg-spine-ochre p-5">
            <span className="display-tight text-4xl text-navy-950">Duyuru</span>
          </div>
        )}
      </div>
      {post.date && <p className="label-mono mt-5 text-teal-600">{post.date}</p>}
      <h3 className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight text-navy-900 group-hover:text-teal-600">{post.title}</h3>
      <p className="mt-2 line-clamp-3 text-[15px] leading-6 text-muted">{post.subtitle || excerpt(post.body)}</p>
    </Link>
  );
}

/** Duyuru satırı: solda tarih, sağda başlık. */
export function NewsRow({ post }: { post: Post }) {
  return (
    <Link href={`/haberler-duyurular/${post.slug}`} className="group flex items-start gap-5 border-t border-line py-5">
      <div className="min-w-0 flex-1">
        <p className="label-mono text-teal-600">{post.date ?? "Duyuru"}</p>
        <h3 className="mt-1.5 font-display text-xl font-bold leading-snug tracking-tight text-navy-900 group-hover:text-teal-600">{post.title}</h3>
      </div>
      <ArrowRight className="mt-6 size-5 shrink-0 text-navy-900 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

/** Bölüm başlığı; isteğe bağlı raf etiketi (sınıf numarası) üstte durur. */
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
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        {callNumber && <p className={`label-mono ${light ? "text-spine-ochre" : "text-teal-600"}`}>{callNumber}</p>}
        <h2 className={`display-tight mt-3 text-5xl sm:text-6xl ${light ? "text-white" : "text-navy-900"}`}>{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className={`inline-flex shrink-0 items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
            light ? "border-white/30 text-white hover:border-white" : "border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white"
          }`}
        >
          {linkLabel ?? "Tümü"} <ArrowRight />
        </Link>
      )}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="border-2 border-dashed border-line p-8 text-center text-muted">{children}</p>;
}
