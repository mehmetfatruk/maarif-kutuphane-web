"use client";

import { useState } from "react";
import { LIBRARIES } from "@/data/libraries";
import { Search } from "./icons";

const FIELDS = [
  { value: "", label: "Tüm alanlar" },
  { value: "ti", label: "Eser adı" },
  { value: "au", label: "Yazar" },
  { value: "su", label: "Konu" },
  { value: "nb", label: "ISBN" },
  { value: "se", label: "Diziler" },
  { value: "callnum", label: "Yer numarası" },
];

const MATERIALS = [
  { value: "", label: "Tüm materyaller" },
  { value: "mc-itype,phr:BK", label: "Kitap" },
  { value: "mc-itype,phr:RF", label: "Ansiklopedi" },
  { value: "mc-itype,phr:SR", label: "Süreli yayın" },
  { value: "mc-itype,phr:EBK", label: "e-Kitap" },
];

const selectClass =
  "h-12 w-full rounded-full border border-line bg-white px-4 text-[15px] text-ink focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30";

// Boş seçimler Koha'ya "limit=" olarak gitmesin diye gönderimden hemen önce devre dışı bırakılır.
function dropEmptyFilters(event: React.FormEvent<HTMLFormElement>) {
  const empty = [...event.currentTarget.querySelectorAll("select")].filter((s) => !s.value);
  empty.forEach((s) => (s.disabled = true));
  setTimeout(() => empty.forEach((s) => (s.disabled = false)));
}

/** Koha OPAC'a yönlendiren katalog arama kutusu (basit ve gelişmiş). */
export function CatalogSearch({ action }: { action: string }) {
  const [advanced, setAdvanced] = useState(false);

  return (
    <div>
      <div role="tablist" className="flex gap-6 text-sm font-semibold">
        {[
          { key: false, label: "Tüm katalogda" },
          { key: true, label: "Gelişmiş arama" },
        ].map((tab) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={advanced === tab.key}
            onClick={() => setAdvanced(tab.key)}
            className={`transition-colors ${advanced === tab.key ? "text-navy-900" : "text-muted hover:text-navy-900"}`}
          >
            <span className={advanced === tab.key ? "border-b-2 border-spine-ochre pb-0.5" : ""}>{tab.label}</span>
          </button>
        ))}
      </div>

      <form action={action} method="get" onSubmit={dropEmptyFilters} className="mt-4">
        {advanced && <input type="hidden" name="advsearch" value="1" />}
        <div className="flex items-center gap-3 border-b-[3px] border-navy-900 pb-2 focus-within:border-teal-500">
          <label className="sr-only" htmlFor="catalog-q">Anahtar kelime</label>
          <Search className="size-7 shrink-0 text-navy-900" />
          <input
            id="catalog-q"
            name="q"
            required
            placeholder="Kitap, yazar, konu, ISBN…"
            className="min-w-0 flex-1 bg-transparent py-2 text-xl font-semibold tracking-tight text-navy-900 placeholder:text-navy-900/35 focus:outline-none sm:text-2xl"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-navy-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-teal-500 hover:text-navy-950"
          >
            Ara
          </button>
        </div>

        {advanced && (
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="sr-only">Arama alanı</span>
              <select name="idx" className={selectClass} defaultValue="">
                {FIELDS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="sr-only">Kütüphane</span>
              <select name="limit" className={selectClass} defaultValue="">
                <option value="">Tüm kütüphaneler</option>
                {LIBRARIES.map((lib) => (
                  <option key={lib.code} value={`branch:${lib.code}`}>{lib.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="sr-only">Materyal türü</span>
              <select name="limit" className={selectClass} defaultValue="">
                {MATERIALS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </label>
          </div>
        )}
      </form>
    </div>
  );
}
