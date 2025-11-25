"use client";

import { useTransition, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { updateProfileAction } from "./actions";
import { Edit2, Save, X } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(100, "Nama maksimal 100 karakter"),
  email: z.string().email("Email tidak valid").max(100, "Email maksimal 100 karakter"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [avatarPreview, setAvatarPreview] = useState<string>(initialData.avatarUrl ?? "");
  const [avatarData, setAvatarData] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasAvatarChanges = Boolean(avatarData);
  const showSaveCancel = isEditing || hasAvatarChanges;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData.name,
      email: initialData.email,
    },
  });

  // Reset form when initialData changes or when canceling edit
  useEffect(() => {
    form.reset({
      name: initialData.name,
      email: initialData.email,
    });
    setAvatarPreview(initialData.avatarUrl ?? "");
    setAvatarData(null);
  }, [initialData, form]);

  const onSubmit = (values: ProfileFormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    if (avatarData) {
      formData.append("avatar", avatarData);
    }

    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (result.success) {
        form.reset(values);
        setAvatarData(null);
        setMessage({ type: "success", text: result.message });
        setIsEditing(false);
        router.refresh();
      } else {
        setMessage({ type: "error", text: result.message });
      }
    });
  };

  const handleCancel = () => {
    form.reset({
      name: initialData.name,
      email: initialData.email,
    });
    setAvatarPreview(initialData.avatarUrl ?? "");
    setAvatarData(null);
    setIsEditing(false);
    setMessage(null);
  };

  const nameValue = form.watch("name");
  const initials = (nameValue || initialData.name)
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleAvatarClick();
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Format file tidak didukung. Gunakan gambar PNG, JPG, atau WebP." });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "Ukuran gambar maksimal 2MB." });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
      setAvatarData(result);
      setMessage(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div
            role="button"
            tabIndex={0}
            title="Klik untuk unggah foto baru"
            onClick={handleAvatarClick}
            onKeyDown={handleAvatarKeyDown}
            className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-2xl font-semibold text-white transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Foto Profil" className="h-full w-full rounded-full object-cover" />
            ) : (
              initials || "SM"
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Foto Profil</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              Unggah gambar baru untuk mengganti foto profil Anda.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <p className="mt-1 text-xs text-zinc-500">Maksimal 2MB.</p>
          </div>
        </div>

        {/* Message */}
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

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama / Username</Label>
            {isEditing ? (
              <>
                <Input
                  id="name"
                  {...form.register("name")}
                  disabled={isPending}
                  className={form.formState.errors.name ? "border-red-500" : ""}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </>
            ) : (
              <div className="flex h-10 items-center rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                {form.watch("name") || initialData.name}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            {isEditing ? (
              <>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  disabled={isPending}
                  className={form.formState.errors.email ? "border-red-500" : ""}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </>
            ) : (
              <div className="flex h-10 items-center rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                {form.watch("email") || initialData.email}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-4">
            {showSaveCancel && (
              <>
                <Button type="submit" disabled={isPending} className="gap-2">
                  <Save className="h-4 w-4" />
                  {isPending ? "Menyimpan..." : "Simpan"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isPending}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Batal
                </Button>
              </>
            )}
            {!isEditing && (
              <Button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  setMessage(null);
                }}
                className="gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Ubah
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

