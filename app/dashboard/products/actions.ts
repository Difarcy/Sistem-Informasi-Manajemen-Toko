"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} from "@/lib/db/products";

const productSchema = z.object({
  name: z.string().min(1, "Nama barang wajib diisi").max(200, "Nama maksimal 200 karakter"),
  sku: z.string().min(1, "SKU wajib diisi").max(50, "SKU maksimal 50 karakter"),
  description: z.string().max(500, "Deskripsi maksimal 500 karakter").optional(),
  categoryId: z.coerce.number().int().min(1, "Kategori wajib dipilih"),
  price: z.coerce.number().nonnegative("Harga tidak valid"),
  stock: z.coerce.number().nonnegative("Stok tidak valid").optional(),
  minStock: z.coerce.number().nonnegative("Stok minimal tidak valid").optional(),
  unit: z.string().min(1, "Satuan wajib diisi").max(20, "Satuan maksimal 20 karakter"),
});

export async function createProductAction(formData: FormData) {
  try {
    const validatedData = productSchema.parse({
      name: formData.get("name"),
      sku: formData.get("sku"),
      description: formData.get("description"),
      categoryId: formData.get("categoryId"),
      price: formData.get("price"),
      stock: formData.get("stock"),
      minStock: formData.get("minStock"),
      unit: formData.get("unit"),
    });

    await createProduct({
      ...validatedData,
      stock: validatedData.stock ?? 0,
      minStock: validatedData.minStock ?? 0,
    });

    revalidatePath("/dashboard/products");
    return { success: true, message: "Barang berhasil ditambahkan" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0]?.message || "Validasi gagal" };
    }
    return { success: false, message: error instanceof Error ? error.message : "Gagal menambahkan barang" };
  }
}

export async function updateProductAction(id: number, formData: FormData) {
  try {
    const validatedData = productSchema.parse({
      name: formData.get("name"),
      sku: formData.get("sku"),
      description: formData.get("description"),
      categoryId: formData.get("categoryId"),
      price: formData.get("price"),
      stock: formData.get("stock"),
      minStock: formData.get("minStock"),
      unit: formData.get("unit"),
    });

    await updateProduct(id, {
      ...validatedData,
      stock: validatedData.stock ?? undefined,
      minStock: validatedData.minStock ?? undefined,
    });

    revalidatePath("/dashboard/products");
    return { success: true, message: "Barang berhasil diperbarui" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0]?.message || "Validasi gagal" };
    }
    return { success: false, message: error instanceof Error ? error.message : "Gagal memperbarui barang" };
  }
}

export async function deleteProductAction(id: number) {
  try {
    await deleteProduct(id);
    revalidatePath("/dashboard/products");
    return { success: true, message: "Barang berhasil dihapus" };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Gagal menghapus barang" };
  }
}

export async function getProductsAction() {
  try {
    const products = await getAllProducts();
    return { success: true, data: products };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Gagal mengambil data barang" };
  }
}

