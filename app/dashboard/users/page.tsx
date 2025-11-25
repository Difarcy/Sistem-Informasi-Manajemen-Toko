import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/auth";
import { getAllUsers } from "@/lib/db/users";
import { UserDialog } from "./user-dialog";
import { UsersTable } from "./users-table";

export default async function UsersPage() {
  const session = await getSession();

  if (!session || session.role !== "administrator") {
    return (
      <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-6 text-sm text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
        Halaman ini hanya bisa diakses oleh administrator.
      </div>
    );
  }

  const users = await getAllUsers();
  const safeUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Atur peran dan akses pengguna sistem.</p>
        </div>
        <UserDialog mode="create">
          <Button>Tambah Pengguna</Button>
        </UserDialog>
      </div>

      <UsersTable users={safeUsers} currentUserId={session.userId} />
    </div>
  );
}

