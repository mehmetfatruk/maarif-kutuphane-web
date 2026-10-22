import { Container, PageHeader } from "@/components/site/PageHeader";
import { PurchaseForm } from "./PurchaseForm";

export const metadata = { title: "Satın Alma Önerisi" };

export default function Page() {
  return (
    <>
      <PageHeader
        title="Satın Alma Önerisi"
        lead="Kütüphanemizde bulunmasını istediğiniz kaynakları bize bildirin."
        crumbs={[{ label: "Hizmetlerimiz" }, { label: "Satın Alma Önerisi" }]}
      />
      <Container className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <PurchaseForm />
        </div>
      </Container>
    </>
  );
}
