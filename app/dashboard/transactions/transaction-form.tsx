"use client";

import { useMemo, useState, useTransition } from "react";
import { createTransactionAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { TransactionFormProduct, TransactionType } from "@/types";

type TransactionFormProps = {
  type: TransactionType;
  products: TransactionFormProduct[];
};

type ItemRow = {
  productId?: number;
  quantity: number;
  price: number;
};

const emptyItem = (): ItemRow => ({
  productId: undefined,
  quantity: 1,
  price: 0,
});

export function TransactionForm({ type, products }: TransactionFormProps) {
  const [items, setItems] = useState<ItemRow[]>([emptyItem()]);
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0), 0);
  }, [items]);

  const typeLabel = type === "MASUK" ? "Barang Masuk" : "Barang Keluar";

  function updateItem(index: number, updates: Partial<ItemRow>) {
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        const next: ItemRow = { ...item, ...updates };

        if (updates.productId) {
          const selectedProduct = products.find((product) => product.id === updates.productId);
          if (selectedProduct) {
            next.price = selectedProduct.price;
          }
        }

        return next;
      }),
    );
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }

  function removeItem(index: number) {
    setItems((prev) => (prev.length === 1 ? [emptyItem()] : prev.filter((_, idx) => idx !== index)));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const payloadItems = items
          .filter((item) => item.productId)
          .map((item) => ({
            productId: Number(item.productId),
            quantity: Number(item.quantity),
            price: Number(item.price),
          }));

        if (payloadItems.length === 0) {
          setError("Minimal pilih 1 barang.");
          return;
        }

        if (payloadItems.some((item) => !item.quantity || item.quantity <= 0)) {
          setError("Jumlah barang harus lebih dari 0.");
          return;
        }

        const formData = new FormData();
        formData.append("type", type);
        formData.append("reference", reference);
        formData.append("notes", notes);
        formData.append("items", JSON.stringify(payloadItems));

        const result = await createTransactionAction(formData);

        if (result.success) {
          setSuccess(`${typeLabel} berhasil dicatat.`);
          setItems([emptyItem()]);
          setReference("");
          setNotes("");
        } else {
          setError(result.message || "Gagal menyimpan transaksi.");
        }
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    });
  }

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-800">
        Tambahkan data barang terlebih dahulu sebelum mencatat transaksi.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Catat {typeLabel}</h3>
          <p className="text-sm text-zinc-500">Tambah barang dengan kuantitas dan harga sesuai transaksi.</p>
        </div>
        <div className="text-right text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          Total:{" "}
          <span className="text-base">
            {totalAmount.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`reference-${type}`}>Referensi (Opsional)</Label>
          <Input
            id={`reference-${type}`}
            placeholder="No. faktur atau referensi"
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`notes-${type}`}>Catatan</Label>
          <Textarea
            id={`notes-${type}`}
            placeholder="Catatan tambahan..."
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            disabled={isPending}
            className="min-h-[40px]"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Daftar Barang</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem} disabled={isPending}>
            + Tambah Barang
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => {
            const selectedProduct = products.find((product) => product.id === item.productId);

            return (
              <div
                key={`item-${index}`}
                className="grid gap-3 rounded-xl border border-zinc-200 p-3 md:grid-cols-[2fr_1fr_1fr_auto] dark:border-zinc-800"
              >
                <div className="space-y-1">
                  <Label className="text-xs uppercase text-zinc-500">Barang</Label>
                  <select
                    className={cn(
                      "h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950",
                    )}
                    value={item.productId ?? ""}
                    onChange={(event) => updateItem(index, { productId: Number(event.target.value) || undefined })}
                    disabled={isPending}
                  >
                    <option value="">Pilih barang</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.stock} {product.unit})
                      </option>
                    ))}
                  </select>
                  {selectedProduct && (
                    <p className="text-xs text-zinc-500">
                      SKU: {selectedProduct.sku} • Harga default:{" "}
                      {selectedProduct.price.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`qty-${type}-${index}`} className="text-xs uppercase text-zinc-500">
                    Jumlah
                  </Label>
                  <Input
                    id={`qty-${type}-${index}`}
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) => updateItem(index, { quantity: Number(event.target.value) })}
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`price-${type}-${index}`} className="text-xs uppercase text-zinc-500">
                    Harga Satuan
                  </Label>
                  <Input
                    id={`price-${type}-${index}`}
                    type="number"
                    min={0}
                    step="100"
                    value={item.price}
                    onChange={(event) => updateItem(index, { price: Number(event.target.value) })}
                    disabled={isPending}
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <div className="text-right text-sm font-semibold">
                    {(item.quantity * item.price || 0).toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    })}
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)} disabled={isPending || items.length === 1}>
                    Hapus
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Menyimpan..." : `Simpan ${typeLabel}`}
      </Button>
    </form>
  );
}