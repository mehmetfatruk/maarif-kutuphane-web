import Link from "next/link";

type Crumb = { label: string; href?: string };

export function PageHeader({ title, crumbs = [], lead }: { title: string; crumbs?: Crumb[]; lead?: string }) {
  return (
    <div className="relative overflow-hidden bg-navy-800 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url(/img/bg2.jpg)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <nav aria-label="Konum" className="text-sm text-navy-100">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-teal-400">Anasayfa</Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-2">
                <span aria-hidden>/</span>
                {c.href ? <Link href={c.href} className="hover:text-teal-400">{c.label}</Link> : <span>{c.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {lead && <p className="mt-3 max-w-3xl text-lg text-navy-100">{lead}</p>}
      </div>
    </div>
  );
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 ${className}`}>{children}</div>;
}
