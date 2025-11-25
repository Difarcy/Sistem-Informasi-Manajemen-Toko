"use server";

import { revalidatePath } from "next/cache";
import { createCategory, updateCategory, deleteCategory, getAllCategories } from "@/lib/db/categories";
import { requireAdministrator } from "@/lib/auth/auth";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi").max(100, "Nama kategori maksimal 100 karakter"),
  description: z.string().max(500, "Deskripsi maksimal 500 karakter").optional(),
});

export async function createCategoryAction(formData: FormData) {
  const roleCheck = await requireAdministrator();
  if (!roleCheck.success) {
    return { success: false, message: roleCheck.message };
  }

  try {
    const rawData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string | null,
    };

    const validatedData = categorySchema.parse({
      name: rawData.name,
      description: rawData.description || undefined,
    });

    await createCategory(validatedData);
    revalidatePath("/dashboard/categories");
    
    return { success: true, message: "Kategori berhasil ditambahkan" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        message: error.errors[0]?.message || "Validasi gagal" 
      };
    }
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Gagal menambahkan kategori" 
    };
  }
}

export async function updateCategoryAction(id: number, formData: FormData) {
  const roleCheck = await requireAdministrator();
  if (!roleCheck.success) {
    return { success: false, message: roleCheck.message };
  }

  try {
    const rawData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string | null,
    };

    const validatedData = categorySchema.parse({
      name: rawData.name,
      description: rawData.description || undefined,
    });

    await updateCategory(id, validatedData);
    revalidatePath("/dashboard/categories");
    
    return { success: true, message: "Kategori berhasil diperbarui" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        message: error.errors[0]?.message || "Validasi gagal" 
      };
    }
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Gagal memperbarui kategori" 
    };
  }
}

export async function deleteCategoryAction(id: number) {
  const roleCheck = await requireAdministrator();
  if (!roleCheck.success) {
    return { success: false, message: roleCheck.message };
  }

  try {
    await deleteCategory(id);
    revalidatePath("/dashboard/categories");
    
    return { success: true, message: "Kategori berhasil dihapus" };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Gagal menghapus kategori" 
    };
  }
}

export async function getCategoriesAction() {
  try {
    const categories = await getAllCategories();
    return { success: true, data: categories };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Gagal mengambil data kategori" 
    };
  }
}

