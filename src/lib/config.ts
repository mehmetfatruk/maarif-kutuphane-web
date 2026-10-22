import path from "node:path";

/** Koha OPAC adresi; katalog araması ve üye girişi bu adrese yönlendirilir. */
export const KOHA_OPAC_URL = (process.env.KOHA_OPAC_URL ?? "https://katalog.turkiyemaarif.org").replace(/\/$/, "");

export const kohaSearchUrl = `${KOHA_OPAC_URL}/cgi-bin/koha/opac-search.pl`;
export const kohaMemberUrl = `${KOHA_OPAC_URL}/cgi-bin/koha/opac-user.pl`;

/** Yönetim panelinden yüklenen görsel ve belgelerin saklandığı klasör. */
export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? "uploads");
