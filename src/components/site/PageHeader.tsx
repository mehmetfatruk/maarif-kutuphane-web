import Link from "next/link";

type Crumb = { label: string; href?: string };

/** Alt sayfaların başlık bandı: kâğıt zemin, künye satırı gibi konum bilgisi. */
export function PageHeader({ title, crumbs = [], lead }: { title: string; crumbs?: Crumb[]; lead?: string }) {
  return (
    <div className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <nav aria-label="Konum">
          <ol className="label-mono flex flex-wrap items-center gap-2 text-muted">
            <li>
              <Link href="/" className="hover:text-teal-600">Anasayfa</Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-2">
                <span aria-hidden className="text-teal-500">/</span>
                {c.href ? <Link href={c.href} className="hover:text-teal-600">{c.label}</Link> : <span className="line-clamp-1">{c.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-tight tracking-tight text-navy-900 sm:text-5xl">{title}</h1>
        {lead && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{lead}</p>}
      </div>
    </div>
  );
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 ${className}`}>{children}</div>;
}
