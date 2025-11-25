import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Kelola informasi profil dan akun Anda
        </p>
      </div>

      <ProfileForm
        initialData={{
          name: session.name,
          email: session.email,
          avatarUrl: session.avatarUrl,
        }}
      />
    </div>
  );
}

