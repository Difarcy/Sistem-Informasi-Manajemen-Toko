import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";

export const metadata = {
  title: "Pengaturan | Store Manager",
  description: "Kelola pengaturan dashboard Store Manager Anda.",
};

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Sesuaikan preferensi sistem sesuai kebutuhan operasional Anda.
        </p>
      </div>

      <SettingsForm />
    </div>
  );
}


