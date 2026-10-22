import { Container, PageHeader } from "@/components/site/PageHeader";
import { librariesByCountry, LIBRARIES } from "@/data/libraries";

export const metadata = { title: "Kütüphanelerimiz" };

export default function Page() {
  const groups = librariesByCountry();
  return (
    <>
      <PageHeader
        title="Kütüphanelerimiz"
        lead="Türkiye Maarif Vakfı okullarındaki kütüphaneler ortak bir katalog üzerinden hizmet verir."
        crumbs={[{ label: "Kütüphanelerimiz" }]}
      />
      <Container className="py-12 sm:py-16">
        <dl className="grid gap-4 sm:grid-cols-2">
          {[
            { value: LIBRARIES.length, label: "Kütüphane" },
            { value: groups.length, label: "Ülke" },
          ].map((s) => (
            <div key={s.label} className="border-l-[10px] border-spine-ochre bg-paper p-6">
              <dt className="label-mono text-muted">{s.label}</dt>
              <dd className="display-tight mt-2 text-7xl text-navy-900">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 columns-1 gap-6 md:columns-2 xl:columns-3">
          {groups.map(({ country, libraries }) => (
            <section key={country} className="mb-6 break-inside-avoid border-t-[6px] border-navy-900 bg-white pt-4">
              <h2 className="flex items-center justify-between font-display text-2xl font-bold tracking-tight text-navy-900">
                {country}
                <span className="label-mono rounded-full bg-spine-ochre px-2.5 py-1 text-navy-950">{libraries.length}</span>
              </h2>
              <ul className="mt-3 space-y-1.5 text-[15px] text-muted">
                {libraries.map((lib) => (
                  <li key={lib.code} className="flex gap-3">
                    <span className="label-mono w-12 shrink-0 pt-1 text-teal-600">{lib.code}</span>
                    <span>{lib.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
