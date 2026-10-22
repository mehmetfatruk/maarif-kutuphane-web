import Link from "next/link";
import { Container } from "@/components/site/PageHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { kohaMemberUrl } from "@/lib/config";

export default function NotFound() {
  return (
    <>
      <SiteHeader memberUrl={kohaMemberUrl} />
      <main>
        <Container className="py-24 text-center">
          <p className="text-6xl font-bold text-teal-500">404</p>
          <h1 className="mt-4 text-2xl font-semibold text-navy-800">Aradığınız sayfa bulunamadı</h1>
          <Link href="/" className="mt-8 inline-block rounded-lg bg-navy-700 px-6 py-3 font-semibold text-white hover:bg-navy-800">
            Anasayfaya dön
          </Link>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
