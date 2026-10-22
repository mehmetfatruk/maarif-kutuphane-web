import Image from "next/image";
import Link from "next/link";
import { NAV, SOCIAL } from "./nav";

export function SiteFooter() {
  return (
    <footer className="mt-28 bg-navy-950 text-navy-100">
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <div className="grid gap-12 pb-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <a href="https://www.turkiyemaarif.org/" className="inline-block rounded bg-white px-3 py-2">
              <Image src="/img/logo.png" alt="Türkiye Maarif Vakfı" width={174} height={60} className="h-10 w-auto" />
            </a>
            <address className="mt-6 text-sm not-italic leading-6 text-navy-100/75">
              Altunizade Mah. Ord. Prof. Dr. Fahrettin Kerim Gökay Cad.
              <br />
              Erdem Sok. No: 5, Üsküdar / İstanbul
            </address>
            <a href="mailto:kutuphane@turkiyemaarif.org" className="mt-3 inline-block text-sm font-semibold text-teal-400 hover:text-white">
              kutuphane@turkiyemaarif.org
            </a>
          </div>

          {NAV.filter((n) => n.children).map((group) => (
            <div key={group.label}>
              <h2 className="label-mono text-spine-ochre">{group.label}</h2>
              <ul className="mt-5 space-y-3 text-[15px]">
                {group.children!.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-navy-100/85 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p aria-hidden className="display-tight select-none overflow-hidden whitespace-nowrap text-[9.5vw] text-white/[0.06] xl:text-[132px]">
          Maarif Kütüphaneleri
        </p>

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-sm md:flex-row md:items-center md:justify-between">
          <p className="text-navy-100/70">© {new Date().getFullYear()} Türkiye Maarif Vakfı. Tüm hakları saklıdır.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {SOCIAL.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-navy-100/85 hover:text-teal-400">
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
