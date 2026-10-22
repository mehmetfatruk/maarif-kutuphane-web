import { StaticPage } from "@/components/site/StaticPage";

export const dynamic = "force-dynamic";
export const metadata = { title: "Açık Erişim" };

export default function Page() {
  return <StaticPage pageKey="acik-erisim" section="Kaynaklar" />;
}
