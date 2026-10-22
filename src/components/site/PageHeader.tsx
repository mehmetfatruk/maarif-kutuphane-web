import Link from "next/link";

type Crumb = { label: string; href?: string };

/** Alt sayfaların başlığı: büyük dar başlık ve altında raf çizgisi. */
export function PageHeader({ title, crumbs = [], lead }: { title: string; crumbs?: Crumb[]; lead?: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16">
      <nav aria-label="Konum">
        <ol className="label-mono flex flex-wrap items-center gap-2 text-muted">
          <li>
            <Link href="/" className="hover:text-teal-600">Anasayfa</Link>
          </li>
          {crumbs.map((c) => (
            <li key={c.label} className="flex items-center gap-2">
              <span aria-hidden className="text-spine-ochre">/</span>
              {c.href ? <Link href={c.href} className="hover:text-teal-600">{c.label}</Link> : <span className="line-clamp-1">{c.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <div className="border-b-[10px] border-navy-900 pb-10">
        <h1 className="display-tight mt-5 max-w-5xl text-5xl text-navy-900 sm:text-7xl">{title}</h1>
        {lead && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{lead}</p>}
      </div>
    </div>
  );
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 ${className}`}>{children}</div>;
}
