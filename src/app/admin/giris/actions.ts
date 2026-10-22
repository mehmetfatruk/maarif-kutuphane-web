"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { clearFailures, endSession, isLocked, recordFailure, startSession, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";

export async function login(_prev: { error?: string }, form: FormData): Promise<{ error?: string }> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const key = `${ip}:${email}`;

  if (isLocked(key)) return { error: "Çok fazla hatalı deneme. 15 dakika sonra tekrar deneyin." };

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    recordFailure(key);
    return { error: "E-posta veya şifre hatalı." };
  }

  clearFailures(key);
  await startSession(user.id);
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/giris");
}
