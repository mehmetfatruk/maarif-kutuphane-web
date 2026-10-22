import Image from "next/image";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { PAGES } from "@/lib/sections";
import { logout } from "../giris/actions";

export const metadata = { title: "Yönetim Paneli", robots: { index: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const link = "block rounded-md px-3 py-2 text-[15px] text-navy-100 hover:bg-white/10 hover:text-white";
  return (
    <div className="min-h-screen bg-navy-50 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="bg-navy-900 p-5 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <Link href="/admin" className="block rounded-lg bg-white p-2">
          <Image src="/img/logo.png" alt="Türkiye Maarif Vakfı" width={174} height={60} className="mx-auto h-9 w-auto" />
        </Link>
        <nav className="mt-6 space-y-6">
          <div>
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-navy-100/60">İçerik</p>
            <Link href="/admin" className={link}>Özet</Link>
            <Link href="/admin/icerikler" className={link}>Tüm içerikler</Link>
            <Link href="/admin/icerikler/yeni" className={link}>+ Yeni içerik</Link>
          </div>
          <div>
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-navy-100/60">Sabit sayfalar</p>
            {Object.entries(PAGES).map(([key, label]) => (
              <Link key={key} href={`/admin/sayfalar/${key}`} className={link}>{label}</Link>
            ))}
          </div>
          <div>
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-navy-100/60">Hesap</p>
            <Link href="/admin/yoneticiler" className={link}>Yöneticiler</Link>
            <Link href="/" target="_blank" className={link}>Siteyi görüntüle ↗</Link>
            <form action={logout}>
              <button type="submit" className={`${link} w-full text-left`}>Çıkış yap</button>
            </form>
          </div>
        </nav>
        <p className="mt-8 px-3 text-xs text-navy-100/60">Oturum: {user.name}</p>
      </aside>
      <main className="p-5 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}
