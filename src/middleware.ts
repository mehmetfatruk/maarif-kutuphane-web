import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

// İlk savunma hattı: oturumsuz istekleri giriş sayfasına yollar.
// Asıl yetki kontrolü her sayfa ve işlemde requireUser() ile yapılır.
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/giris") return NextResponse.next();
  const userId = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  if (userId === null) return NextResponse.redirect(new URL("/admin/giris", request.url));
  return NextResponse.next();
}

// Node çalışma ortamı: SESSION_SECRET gibi ortam değişkenleri çalışma anında okunur.
export const config = { matcher: ["/admin/:path*"], runtime: "nodejs" };
