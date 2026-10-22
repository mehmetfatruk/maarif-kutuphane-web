"use client";

import { useState } from "react";
import { LIBRARIES } from "@/data/libraries";
import { ExternalLink, Search } from "./icons";

const FIELDS = [
  { value: "", label: "Tüm alanlar" },
  { value: "ti", label: "Başlık" },
  { value: "au", label: "Yazar" },
  { value: "su", label: "Konu" },
  { value: "nb", label: "ISBN" },
  { value: "ns", label: "ISSN" },
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
  const empty = [...event.currentTarget.querySelectorAll("select")].filter((s) => !s.value && !s.disabled);
  empty.forEach((s) => (s.disabled = true));
  setTimeout(() => empty.forEach((s) => (s.disabled = false)));
}

/**
 * Koha OPAC katalog taraması: alan seçimi + arama kutusu, isteğe bağlı kütüphane ve materyal süzgeci.
 * Arama yeni sekmede canlı katalogda açılır. Gelişmiş alanlar her zaman sayfada durur, kapalıyken
 * gizli ve devre dışıdır (statik önizleme de aynı işaretlemeyle sekmeleri açıp kapatabilsin diye).
 */
export function CatalogSearch({ action, homeUrl }: { action: string; homeUrl: string }) {
  const [advanced, setAdvanced] = useState(false);

  return (
    <div data-catalog-search>
      <div role="tablist" className="flex gap-6 text-sm font-semibold">
        {[
          { key: false, label: "Katalog tarama" },
          { key: true, label: "Gelişmiş tarama" },
        ].map((tab) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            data-advanced={tab.key ? "1" : "0"}
            aria-selected={advanced === tab.key}
            onClick={() => setAdvanced(tab.key)}
            className="group text-muted transition-colors hover:text-navy-900 aria-selected:text-navy-900"
          >
            <span className="border-b-2 border-transparent pb-0.5 group-aria-selected:border-spine-ochre">{tab.label}</span>
          </button>
        ))}
      </div>

      <form action={action} method="get" target="_blank" onSubmit={dropEmptyFilters} className="mt-4">
        <div className="flex items-stretch rounded-full border-2 border-navy-900 bg-white p-1.5 focus-within:border-teal-500">
          <label className="sr-only" htmlFor="catalog-idx">Arama alanı</label>
          <select
            id="catalog-idx"
            name="idx"
            defaultValue=""
            className="w-24 shrink-0 rounded-full bg-paper px-2 text-sm font-semibold text-navy-900 focus:outline-none sm:w-auto sm:px-4"
          >
            {FIELDS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="catalog-q">Arama</label>
          <Search className="ml-3 hidden size-5 shrink-0 self-center text-navy-900 sm:ml-4 sm:block" />
          <input
            id="catalog-q"
            name="q"
            type="text"
            placeholder="Kitap, yazar, konu, ISBN…"
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-lg font-medium text-navy-900 placeholder:text-muted focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-navy-900 px-4 font-semibold sm:px-6 text-white transition-colors hover:bg-teal-500 hover:text-navy-950"
          >
            Ara
          </button>
        </div>

        <div data-advanced-fields hidden={!advanced} className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="sr-only">Kütüphane</span>
            <select name="limit" disabled={!advanced} className={selectClass} defaultValue="">
              <option value="">Tüm kütüphaneler</option>
              {LIBRARIES.map((lib) => (
                <option key={lib.code} value={`branch:${lib.code}`}>{lib.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Materyal türü</span>
            <select name="limit" disabled={!advanced} className={selectClass} defaultValue="">
              {MATERIALS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </label>
        </div>
      </form>

      <a
        href={homeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 underline-offset-4 hover:underline"
      >
        Katalog Tarama Anasayfa <ExternalLink />
      </a>
    </div>
  );
}
