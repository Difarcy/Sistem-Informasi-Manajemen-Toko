"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { changePasswordAction } from "./actions";
import { Eye, EyeOff, Lock, Shield, ShieldCheck, ShieldX } from "lucide-react";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Password minimal 6 karakter"),
    newPassword: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Password minimal 6 karakter"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "Password baru tidak boleh sama dengan password lama",
    path: ["newPassword"],
  });

type FormValues = z.infer<typeof passwordSchema>;

export function ChangePasswordForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    startTransition(async () => {
      const payload = new FormData();
      payload.append("currentPassword", values.currentPassword);
      payload.append("newPassword", values.newPassword);
      payload.append("confirmPassword", values.confirmPassword);

      const result = await changePasswordAction(payload);
      if (result.success) {
        form.reset();
        setMessage({ type: "success", text: result.message });
        setIsEditing(false);
      } else {
        setMessage({ type: "error", text: result.message });
      }
    });
  };

  const handleCancel = () => {
    form.reset();
    setMessage(null);
    setIsEditing(false);
  };

  const renderPasswordField = (
    field: keyof FormValues,
    label: string,
    placeholder: string,
    icon?: React.ReactNode
  ) => (
    <div className="space-y-2">
      <Label htmlFor={field}>{label}</Label>
      <div className="relative">
        {icon}
        <Input
          id={field}
          type={showPassword[field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm"] ? "text" : "password"}
          placeholder={placeholder}
          className={`pl-10 pr-10 ${form.formState.errors[field] ? "border-red-500" : ""}`}
          disabled={isPending}
          {...form.register(field)}
        />
        <button
          type="button"
          onClick={() =>
            setShowPassword((prev) => ({
              ...prev,
              [field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm"]: !prev[
                field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm"
              ],
            }))
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
        >
          {showPassword[field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm"] ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {form.formState.errors[field] && (
        <p className="text-sm text-red-600 dark:text-red-400">{form.formState.errors[field]?.message}</p>
      )}
    </div>
  );

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">
            {isEditing ? <ShieldCheck className="h-6 w-6" /> : <Shield className="h-6 w-6" />}
          </div>
          <div>
            <h2 className="text-lg font-semibold">Keamanan Password</h2>
            <p className="text-sm text-zinc-500">Pastikan password baru berbeda dengan password sebelumnya.</p>
          </div>
        </div>

        {message && (
          <div
            className={`rounded-lg border p-3 text-sm ${
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        {!isEditing ? (
          <div className="space-y-4">
            <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-500">
              <li>Minimal 6 karakter</li>
              <li>Disarankan kombinasi huruf, angka, dan simbol</li>
              <li>Password baru tidak boleh sama dengan password lama</li>
            </ul>
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              Ganti Password
            </Button>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {renderPasswordField(
              "currentPassword",
              "Password Saat Ini",
              "Masukkan password lama",
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            )}
            {renderPasswordField(
              "newPassword",
              "Password Baru",
              "Masukkan password baru",
              <ShieldX className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            )}
            {renderPasswordField(
              "confirmPassword",
              "Konfirmasi Password Baru",
              "Ulangi password baru",
              <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            )}

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isPending} className="gap-2">
                {isPending ? "Menyimpan..." : "Simpan Password"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
                Batal
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}


