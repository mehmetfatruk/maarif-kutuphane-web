"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Close, Menu, Search, User } from "./icons";
import { NAV } from "./nav";

export function SiteHeader({ memberUrl }: { memberUrl: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="bg-navy-950 text-navy-100">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <span className="label-mono hidden text-navy-100/70 sm:inline">Türkiye Maarif Vakfı · Kütüphane Ağı</span>
          <a href={memberUrl} className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-white hover:text-teal-400">
            <User /> Üye Girişi
          </a>
        </div>
      </div>

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="shrink-0" aria-label="Anasayfa">
          <Image src="/img/logo.png" alt="Türkiye Maarif Vakfı" width={174} height={60} priority className="h-12 w-auto" />
        </Link>

        <nav aria-label="Ana menü" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) =>
              item.children ? (
                <li key={item.label} className="group relative">
                  <button
                    type="button"
                    className={`flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-semibold transition-colors hover:text-teal-600 ${
                      item.children.some((c) => isActive(c.href)) ? "text-teal-600" : "text-navy-900"
                    }`}
                  >
                    {item.label}
                    <ChevronDown className="size-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                  </button>
                  <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="min-w-60 overflow-hidden rounded-lg border border-line border-t-2 border-t-teal-500 bg-white py-2 shadow-xl shadow-navy-900/10">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={`block px-4 py-2.5 text-[15px] hover:bg-navy-50 hover:text-teal-600 ${
                              isActive(child.href) ? "font-semibold text-teal-600" : "text-ink"
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.label}>
                  <Link
                    href={item.href!}
                    className={`rounded-md px-3 py-2 text-[15px] font-semibold transition-colors hover:text-teal-600 ${
                      isActive(item.href!) ? "text-teal-600" : "text-navy-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <Link
          href="/kutuphane-katalogu"
          className="hidden items-center gap-2 rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-600 xl:inline-flex"
        >
          <Search className="size-4" /> Katalogda ara
        </Link>

        <button
          type="button"
          className="rounded-md p-2 text-navy-800 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        >
          {open ? <Close /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav aria-label="Mobil menü" className="max-h-[calc(100vh-7.25rem)] overflow-y-auto border-t border-line bg-white lg:hidden">
          <ul className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            {NAV.map((item) => (
              <li key={item.label} className="border-b border-line last:border-0">
                {item.children ? (
                  <>
                    <p className="pt-3 text-xs font-semibold uppercase tracking-wider text-muted">{item.label}</p>
                    <ul className="pb-2">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} className="block py-2 font-medium text-navy-800">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link href={item.href!} className="block py-3 font-semibold text-navy-800">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
