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
  "h-12 w-full rounded-lg border border-line bg-white px-3 text-[15px] text-ink focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30";

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
    <div className="rounded-2xl bg-white p-5 shadow-2xl shadow-navy-950/20 sm:p-6">
      <div role="tablist" className="mb-4 inline-flex rounded-lg bg-navy-50 p-1 text-sm font-semibold">
        {[
          { key: false, label: "Bütünleşik Arama" },
          { key: true, label: "Gelişmiş Arama" },
        ].map((tab) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={advanced === tab.key}
            onClick={() => setAdvanced(tab.key)}
            className={`rounded-md px-4 py-2 transition-colors ${
              advanced === tab.key ? "bg-white text-navy-800 shadow-sm" : "text-muted hover:text-navy-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form action={action} method="get" onSubmit={dropEmptyFilters} className="grid gap-3 sm:grid-cols-[1fr_auto]">
        {advanced && <input type="hidden" name="advsearch" value="1" />}
        <label className="sr-only" htmlFor="catalog-q">Anahtar kelime</label>
        <input
          id="catalog-q"
          name="q"
          required
          placeholder="Kitap adı, yazar, konu veya ISBN"
          className="h-12 w-full rounded-lg border border-line px-4 text-[15px] focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
        />
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-teal-500 px-6 font-semibold text-white transition-colors hover:bg-teal-600"
        >
          <Search /> Ara
        </button>

        {advanced && (
          <div className="grid gap-3 sm:col-span-2 sm:grid-cols-3">
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
