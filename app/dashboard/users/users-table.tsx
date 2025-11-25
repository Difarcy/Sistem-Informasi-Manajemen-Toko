"use client";

import { useState, useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { deleteUserAction } from "./actions";
import { UserDialog } from "./user-dialog";

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: "administrator" | "user";
  createdAt: string;
};

type UsersTableProps = {
  users: UserRow[];
  currentUserId?: number;
};

export function UsersTable({ users, currentUserId }: UsersTableProps) {
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus pengguna ini?")) return;
    setError("");
    setPendingId(id);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", String(id));
      const result = await deleteUserAction(formData);
      if (!result.success) {
        setError(result.message || "Gagal menghapus pengguna");
      } else {
        setPendingId(null);
      }
    });
  }

  if (users.length === 0) {
    return <p className="text-sm text-zinc-500">Belum ada pengguna lain.</p>;
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Peran</TableHead>
              <TableHead>Tanggal Dibuat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <p className="font-semibold">{user.name}</p>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span
                    className={
                      user.role === "administrator"
                        ? "rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-100"
                        : "rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    }
                  >
                    {user.role === "administrator" ? "Administrator" : "User"}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-zinc-500">
                  {format(new Date(user.createdAt), "dd MMM yyyy", { locale: id })}
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  <UserDialog
                    mode="edit"
                    user={{
                      id: user.id,
                      name: user.name,
                      email: user.email,
                      role: user.role,
                    }}
                  >
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </UserDialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isPending || user.id === currentUserId}
                    onClick={() => handleDelete(user.id)}
                  >
                    {isPending && pendingId === user.id ? "Menghapus..." : "Hapus"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


