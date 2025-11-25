"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCategoryAction } from "./actions";

interface DeleteCategoryDialogProps {
  children: React.ReactNode;
  categoryId: number;
  categoryName: string;
}

export function DeleteCategoryDialog({
  children,
  categoryId,
  categoryName,
}: DeleteCategoryDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleDelete = () => {
    setError("");
    startTransition(async () => {
      const result = await deleteCategoryAction(categoryId);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
          <AlertDialogDescription>
            {error && (
              <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}
            Apakah Anda yakin ingin menghapus kategori <strong>{categoryName}</strong>?
            Tindakan ini tidak dapat dibatalkan dan akan menghapus kategori dari sistem.
            {categoryId && (
              <span className="block mt-2 text-amber-600 dark:text-amber-400">
                Catatan: Jika kategori ini memiliki barang, penghapusan mungkin akan gagal.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-500 hover:bg-red-600"
          >
            {isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

