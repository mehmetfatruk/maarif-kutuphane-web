import Image from "next/image";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Yönetim Paneli Girişi", robots: { index: false } };

export default async function Page() {
  if (await currentUser()) redirect("/admin");
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl shadow-navy-900/10 ring-1 ring-line">
        <Image src="/img/logo.png" alt="Türkiye Maarif Vakfı" width={174} height={60} className="mx-auto h-12 w-auto" priority />
        <h1 className="mb-6 mt-6 text-center text-lg font-semibold text-navy-800">Kütüphane Yönetim Paneli</h1>
        <LoginForm />
      </div>
    </main>
  );
}
