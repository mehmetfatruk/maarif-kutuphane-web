import { CatalogSearch } from "@/components/site/CatalogSearch";
import { StaticPage } from "@/components/site/StaticPage";
import { kohaSearchUrl } from "@/lib/config";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kütüphane Kataloğu" };

export default function Page() {
  return (
    <StaticPage pageKey="kutuphane-katalogu" section="Kaynaklar">
      <div className="mb-10 rounded-2xl bg-navy-800 p-2">
        <CatalogSearch action={kohaSearchUrl} />
      </div>
    </StaticPage>
  );
}
