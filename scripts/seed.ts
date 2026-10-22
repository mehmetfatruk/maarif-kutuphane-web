// İlk yöneticiyi oluşturur veya şifresini sıfırlar.
// Kullanım: ADMIN_EMAIL=... ADMIN_PASSWORD=... ADMIN_NAME="..." pnpm db:seed
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Yönetici";
  if (!email || !password) throw new Error("ADMIN_EMAIL ve ADMIN_PASSWORD ortam değişkenlerini verin.");
  if (password.length < 10) throw new Error("Şifre en az 10 karakter olmalı.");

  const passwordHash = await bcrypt.hash(password, 12);
  await db.user.upsert({ where: { email }, create: { email, name, passwordHash }, update: { passwordHash } });
  console.log(`Yönetici hazır: ${email}`);
}

main().finally(() => db.$disconnect());
