"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { createProductAction, updateProductAction } from "./actions";

const formSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  sku: z.string().min(1, "SKU wajib diisi"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  price: z.string().min(1, "Harga wajib diisi"),
  stock: z.string().optional(),
  minStock: z.string().optional(),
  unit: z.string().min(1, "Satuan wajib diisi"),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductDialogProps {
  categories: { id: number; name: string }[];
  product?: {
    id: number;
    name: string;
    sku: string;
    description?: string | null;
    categoryId: number;
    price: number;
    stock: number;
    minStock: number;
    unit: string;
  };
  children: React.ReactNode;
}

export function ProductDialog({ categories, product, children }: ProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name ?? "",
      sku: product?.sku ?? "",
      description: product?.description ?? "",
      categoryId: product?.categoryId ? String(product.categoryId) : "",
      price: product ? String(product.price) : "",
      stock: product ? String(product.stock) : "",
      minStock: product ? String(product.minStock) : "",
      unit: product?.unit ?? "",
    },
  });

  const onSubmit = (values: FormValues) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    startTransition(async () => {
      const actionResult = product
        ? await updateProductAction(product.id, formData)
        : await createProductAction(formData);

      if (actionResult.success) {
        setMessage({ type: "success", text: actionResult.message });
        form.reset();
        setOpen(false);
      } else {
        setMessage({ type: "error", text: actionResult.message });
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          setMessage(null);
          if (!product) {
            form.reset({
              name: "",
              sku: "",
              description: "",
              categoryId: "",
              price: "",
              stock: "",
              minStock: "",
              unit: "",
            });
          }
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Edit Barang" : "Tambah Barang"}</DialogTitle>
          <DialogDescription>
            {product ? "Perbarui informasi barang" : "Isi detail barang untuk menambah data baru"}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Barang</label>
              <Input placeholder="Contoh: Beras Premium" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">SKU</label>
              <Input placeholder="Contoh: BR-001" {...form.register("sku")} disabled={!!product} />
              {form.formState.errors.sku && (
                <p className="text-xs text-red-500">{form.formState.errors.sku.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Deskripsi</label>
            <Textarea rows={3} placeholder="Deskripsi singkat" {...form.register("description")} />
            {form.formState.errors.description && (
              <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Kategori</label>
              <select
                className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700"
                {...form.register("categoryId")}
              >
                <option value="">Pilih kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {form.formState.errors.categoryId && (
                <p className="text-xs text-red-500">{form.formState.errors.categoryId.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Harga</label>
              <Input type="number" min={0} step="100" placeholder="0" {...form.register("price")} />
              {form.formState.errors.price && (
                <p className="text-xs text-red-500">{form.formState.errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Stok</label>
              <Input type="number" min={0} step="1" placeholder="0" {...form.register("stock")} />
              {form.formState.errors.stock && (
                <p className="text-xs text-red-500">{form.formState.errors.stock.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stok Minimal</label>
              <Input type="number" min={0} step="1" placeholder="0" {...form.register("minStock")} />
              {form.formState.errors.minStock && (
                <p className="text-xs text-red-500">{form.formState.errors.minStock.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Satuan</label>
              <Input placeholder="Contoh: Kg, pcs" {...form.register("unit")} />
              {form.formState.errors.unit && (
                <p className="text-xs text-red-500">{form.formState.errors.unit.message}</p>
              )}
            </div>
          </div>

          {message && (
            <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-500"}`}>
              {message.text}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : product ? "Simpan Perubahan" : "Tambah Barang"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

