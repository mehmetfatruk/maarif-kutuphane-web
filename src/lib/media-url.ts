/** Yüklenen dosyanın sitedeki adresi (istemci bileşenlerinde de kullanılabilir). */
export function mediaUrl(relative: string): string {
  return `/media/${relative.split("/").map(encodeURIComponent).join("/")}`;
}
