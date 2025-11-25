import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "./change-password-form";

export const metadata = {
  title: "Ganti Password | Store Manager",
  description: "Perbarui password akun Store Manager Anda.",
};

export default async function ChangePasswordPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ganti Password</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Pastikan password baru Anda aman dan mudah diingat.</p>
      </div>

      <ChangePasswordForm />
    </div>
  );
}


