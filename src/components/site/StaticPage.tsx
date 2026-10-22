import { pageBody } from "@/lib/posts";
import { PAGES, type PageKey } from "@/lib/sections";
import { Empty } from "./cards";
import { Html } from "./Html";
import { Container, PageHeader } from "./PageHeader";

/** Yönetim panelinden düzenlenen sabit sayfaların ortak görünümü. */
export async function StaticPage({ pageKey, section, children }: { pageKey: PageKey; section: string; children?: React.ReactNode }) {
  const body = await pageBody(pageKey);
  return (
    <>
      <PageHeader title={PAGES[pageKey]} crumbs={[{ label: section }, { label: PAGES[pageKey] }]} />
      <Container className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          {children}
          {body ? <Html html={body} /> : !children && <Empty>Bu sayfanın içeriği henüz eklenmedi.</Empty>}
        </div>
      </Container>
    </>
  );
}
