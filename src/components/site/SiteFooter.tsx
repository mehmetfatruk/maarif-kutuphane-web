import Image from "next/image";
import Link from "next/link";
import { NAV, SOCIAL } from "./nav";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-navy-900 text-navy-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <a href="https://www.turkiyemaarif.org/" className="inline-block rounded-lg bg-white p-3">
            <Image src="/img/logo.png" alt="Türkiye Maarif Vakfı" width={174} height={60} className="h-10 w-auto" />
          </a>
          <p className="mt-5 text-sm leading-6 text-navy-100/80">
            Altunizade Mah. Ord. Prof. Dr. Fahrettin Kerim Gökay Cad. Erdem Sok. No: 5, Üsküdar / İstanbul
          </p>
          <a href="mailto:kutuphane@turkiyemaarif.org" className="mt-2 inline-block text-sm font-medium text-white hover:text-teal-400">
            kutuphane@turkiyemaarif.org
          </a>
        </div>

        {NAV.filter((n) => n.children).map((group) => (
          <div key={group.label}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">{group.label}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {group.children!.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-teal-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Türkiye Maarif Vakfı. Tüm hakları saklıdır.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {SOCIAL.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
