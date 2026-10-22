import { StaticPage } from "@/components/site/StaticPage";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kütüphane Kuralları" };

export default function Page() {
  return <StaticPage pageKey="kutuphane-kurallari" section="Kütüphane" />;
}
