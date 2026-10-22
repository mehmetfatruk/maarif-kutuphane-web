import { CatalogSearch } from "@/components/site/CatalogSearch";
import { StaticPage } from "@/components/site/StaticPage";
import { KOHA_OPAC_URL, kohaSearchUrl } from "@/lib/config";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kütüphane Kataloğu" };

export default function Page() {
  return (
    <StaticPage pageKey="kutuphane-katalogu" section="Kaynaklar">
      <div className="mb-12 border-b border-line pb-10">
        <CatalogSearch action={kohaSearchUrl} homeUrl={`${KOHA_OPAC_URL}/`} />
      </div>
    </StaticPage>
  );
}
