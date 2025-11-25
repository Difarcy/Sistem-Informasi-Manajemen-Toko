"use client";

import { useEffect, useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createUserAction, updateUserAction } from "./actions";

type UserDialogProps = {
  mode: "create" | "edit";
  children: React.ReactNode;
  user?: {
    id: number;
    name: string;
    email: string;
    role: "administrator" | "user";
  };
};

export function UserDialog({ mode, children, user }: UserDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"administrator" | "user">("user");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (open && mode === "edit" && user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setPassword("");
      setError("");
    }
    if (!open && mode === "create") {
      setName("");
      setEmail("");
      setRole("user");
      setPassword("");
      setError("");
    }
  }, [open, mode, user]);

  const title = mode === "create" ? "Tambah Pengguna" : "Edit Pengguna";
  const buttonLabel = mode === "create" ? "Simpan Pengguna" : "Simpan Perubahan";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("role", role);

      if (mode === "create") {
        formData.append("password", password);
        const result = await createUserAction(formData);
        if (!result.success) {
          setError(result.message || "Gagal membuat pengguna");
          return;
        }
      } else if (mode === "edit" && user) {
        formData.append("id", String(user.id));
        if (password) {
          formData.append("password", password);
        }
        const result = await updateUserAction(formData);
        if (!result.success) {
          setError(result.message || "Gagal memperbarui pengguna");
          return;
        }
      }

      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor={`${mode}-name`}>Nama</Label>
            <Input id={`${mode}-name`} value={name} onChange={(event) => setName(event.target.value)} disabled={isPending} />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-email`}>Email</Label>
            <Input
              id={`${mode}-email`}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-role`}>Peran</Label>
            <select
              id={`${mode}-role`}
              value={role}
              onChange={(event) => setRole(event.target.value as "administrator" | "user")}
              className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950"
              disabled={isPending}
            >
              <option value="user">User</option>
              <option value="administrator">Administrator</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-password`}>{mode === "create" ? "Password" : "Password Baru (opsional)"}</Label>
            <Input
              id={`${mode}-password`}
              type="password"
              value={password}
              placeholder={mode === "edit" ? "Biarkan kosong jika tidak diubah" : "Minimal 6 karakter"}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isPending}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={isPending || (mode === "create" && password.length < 6)}>
            {isPending ? "Menyimpan..." : buttonLabel}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

