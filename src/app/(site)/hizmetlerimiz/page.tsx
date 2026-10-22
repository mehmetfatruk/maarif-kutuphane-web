import { StaticPage } from "@/components/site/StaticPage";

export const dynamic = "force-dynamic";
export const metadata = { title: "Hizmet Detayları" };

export default function Page() {
  return <StaticPage pageKey="hizmetlerimiz" section="Hizmetlerimiz" />;
}
