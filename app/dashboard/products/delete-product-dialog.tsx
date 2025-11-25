"use client";

import { useTransition, useState } from "react";
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
import { deleteProductAction } from "./actions";

interface DeleteProductDialogProps {
  productId: number;
  productName: string;
  children: React.ReactNode;
}

export function DeleteProductDialog({ productId, productName, children }: DeleteProductDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProductAction(productId);
      if (!result.success) {
        setMessage(result.message);
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus {productName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Data barang akan dihapus permanen dari sistem.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {message && <p className="text-sm text-red-500">{message}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

