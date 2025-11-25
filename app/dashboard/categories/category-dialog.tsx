"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCategoryAction, updateCategoryAction } from "./actions";
import type { Category } from "@/types";

const categoryFormSchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi").max(100, "Nama kategori maksimal 100 karakter"),
  description: z.string().max(500, "Deskripsi maksimal 500 karakter").optional(),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface CategoryDialogProps {
  children: React.ReactNode;
  category?: Category;
}

export function CategoryDialog({ children, category }: CategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    setError("");
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.description) {
        formData.append("description", data.description);
      }

      const result = category
        ? await updateCategoryAction(category.id, formData)
        : await createCategoryAction(formData);

      if (result.success) {
        setOpen(false);
        reset();
        router.refresh();
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Kategori" : "Tambah Kategori Baru"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Ubah informasi kategori di bawah ini."
              : "Isi form di bawah untuk menambahkan kategori baru."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kategori *</Label>
              <Input
                id="name"
                placeholder="Contoh: Alat Tulis"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Deskripsi kategori (opsional)"
                rows={3}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Menyimpan..."
                : category
                ? "Perbarui"
                : "Tambah"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

