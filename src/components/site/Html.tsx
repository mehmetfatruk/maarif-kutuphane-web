import { cleanHtml } from "@/lib/html";

/** Yönetim panelinden gelen HTML'i temizleyerek basar. */
export function Html({ html, className = "" }: { html: string; className?: string }) {
  return <div className={`prose-maarif ${className}`} dangerouslySetInnerHTML={{ __html: cleanHtml(html) }} />;
}
