import { StaticPage } from "@/components/site/StaticPage";

export const dynamic = "force-dynamic";
export const metadata = { title: "Hakkımızda" };

export default function Page() {
  return <StaticPage pageKey="hakkimizda" section="Kütüphane" />;
}
