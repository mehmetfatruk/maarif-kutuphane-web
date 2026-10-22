import "server-only";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import { SESSION_COOKIE, SESSION_HOURS, signSession, verifySession } from "./session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Laravel "$2y$" önekiyle üretir; bcrypt açısından "$2b$" ile aynıdır.
  return bcrypt.compare(password, hash.replace(/^\$2y\$/, "$2b$"));
}

export async function startSession(userId: number) {
  const store = await cookies();
  store.set(SESSION_COOKIE, await signSession(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Oturumdaki yöneticiyi döndürür; yoksa null. */
export async function currentUser() {
  const id = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (id === null) return null;
  return db.user.findUnique({ where: { id }, select: { id: true, name: true, email: true } });
}

/** Her yönetim sayfası ve işleminin başında çağrılır; oturum yoksa giriş sayfasına yollar. */
export async function requireUser() {
  const user = await currentUser();
  if (!user) redirect("/admin/giris");
  return user;
}

// Kaba kuvvet denemelerini yavaşlatmak için basit, süreç içi sayaç.
const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

export function isLocked(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (entry.until < Date.now()) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailure(key: string) {
  const entry = attempts.get(key);
  const fresh = !entry || entry.until < Date.now();
  attempts.set(key, { count: fresh ? 1 : entry.count + 1, until: Date.now() + LOCK_MS });
}

export function clearFailures(key: string) {
  attempts.delete(key);
}
