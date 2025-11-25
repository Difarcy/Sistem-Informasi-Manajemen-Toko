"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { deleteTransactionAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { TransactionRow } from "@/types";

type TransactionTableProps = {
  transactions: TransactionRow[];
  allowActions?: boolean;
};

export function TransactionTable({ transactions, allowActions = true }: TransactionTableProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const hasTransactions = transactions.length > 0;

  function handleDelete(id: number) {
    setError("");
    setSelectedId(id);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", String(id));
      const result = await deleteTransactionAction(formData);
      if (!result.success) {
        setError(result.message || "Gagal menghapus transaksi");
      } else {
        setSelectedId(null);
      }
    });
  }

  if (!hasTransactions) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        Belum ada transaksi tercatat.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Tanggal</TableHead>
              <TableHead>Referensi</TableHead>
              <TableHead>Barang</TableHead>
              <TableHead className="text-right">Total</TableHead>
              {allowActions && <TableHead className="text-right">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className="align-top">
                <TableCell>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold">{format(new Date(transaction.createdAt), "dd MMM yyyy", { locale: id })}</p>
                    <p className="text-xs text-zinc-500">{format(new Date(transaction.createdAt), "HH:mm", { locale: id })}</p>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        transaction.type === "MASUK"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200",
                      )}
                    >
                      {transaction.type === "MASUK" ? "MASUK" : "KELUAR"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">{transaction.reference || "-"}</p>
                    {transaction.notes && <p className="text-sm text-zinc-500">{transaction.notes}</p>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2 text-sm">
                    {transaction.items.map((item) => (
                      <div key={item.id} className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-900/50">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-xs text-zinc-500">
                          {item.quantity} {item.unit} ×{" "}
                          {item.price.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
                        </p>
                        <p className="text-xs font-semibold">
                          {item.subtotal.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
                        </p>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {transaction.totalAmount.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
                </TableCell>
                {allowActions && (
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(transaction.id)}
                      disabled={isPending && selectedId === transaction.id}
                    >
                      {isPending && selectedId === transaction.id ? "Menghapus..." : "Hapus"}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


