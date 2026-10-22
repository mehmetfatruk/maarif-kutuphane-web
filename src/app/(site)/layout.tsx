import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { kohaMemberUrl } from "@/lib/config";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader memberUrl={kohaMemberUrl} />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
