"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createTransaction, deleteTransaction } from "@/lib/db/transactions";
import { requireRole } from "@/lib/auth/auth";

const transactionItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
});

const transactionSchema = z.object({
  type: z.enum(["MASUK", "KELUAR"]),
  reference: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  items: z.array(transactionItemSchema).min(1, "Minimal 1 barang"),
});

function revalidateTransactionPaths() {
  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard/incoming");
  revalidatePath("/dashboard/outgoing");
  revalidatePath("/dashboard/stock");
  revalidatePath("/dashboard");
}

export async function createTransactionAction(formData: FormData) {
  const roleCheck = await requireRole("user");
  if (!roleCheck.success) {
    return { success: false, message: roleCheck.message };
  }

  try {
    const rawItems = formData.get("items");

    const parsed = transactionSchema.parse({
      type: formData.get("type"),
      reference: (formData.get("reference") as string | null) ?? undefined,
      notes: (formData.get("notes") as string | null) ?? undefined,
      items: rawItems ? JSON.parse(rawItems as string) : [],
    });

    await createTransaction({
      type: parsed.type,
      reference: parsed.reference || undefined,
      notes: parsed.notes || undefined,
      items: parsed.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    revalidateTransactionPaths();

    return { success: true };
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? error.errors[0]?.message || "Data transaksi tidak valid"
        : error instanceof Error
          ? error.message
          : "Gagal membuat transaksi";

    return { success: false, message };
  }
}

export async function deleteTransactionAction(formData: FormData) {
  const roleCheck = await requireRole("user");
  if (!roleCheck.success) {
    return { success: false, message: roleCheck.message };
  }

  try {
    const id = Number(formData.get("id"));

    if (!id || Number.isNaN(id)) {
      throw new Error("ID transaksi tidak valid");
    }

    await deleteTransaction(id);

    revalidateTransactionPaths();

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menghapus transaksi",
    };
  }
}


