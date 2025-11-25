"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createUser, deleteUser, getUserByEmail, getUserById, updateUser } from "@/lib/db/users";
import { hashPassword, requireAdministrator } from "@/lib/auth/auth";

const createSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  role: z.enum(["administrator", "user"]),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

const updateSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  role: z.enum(["administrator", "user"]),
  password: z.string().min(6).optional(),
});

function revalidateUsers() {
  revalidatePath("/dashboard/users");
}

export async function createUserAction(formData: FormData) {
  const adminCheck = await requireAdministrator();
  if (!adminCheck.success) {
    return { success: false, message: adminCheck.message };
  }

  try {
    const payload = createSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
      password: formData.get("password"),
    });

    const existing = await getUserByEmail(payload.email);
    if (existing) {
      return { success: false, message: "Email sudah terdaftar" };
    }

    const hashedPassword = await hashPassword(payload.password);
    await createUser({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role,
    });

    revalidateUsers();
    return { success: true };
  } catch (error) {
    const message = error instanceof z.ZodError ? error.errors[0]?.message || "Data tidak valid" : error instanceof Error ? error.message : "Gagal membuat pengguna";
    return { success: false, message };
  }
}

export async function updateUserAction(formData: FormData) {
  const adminCheck = await requireAdministrator();
  if (!adminCheck.success) {
    return { success: false, message: adminCheck.message };
  }

  try {
    const payload = updateSchema.parse({
      id: Number(formData.get("id")),
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
      password: formData.get("password") || undefined,
    });

    const user = await getUserById(payload.id);
    if (!user) {
      return { success: false, message: "Pengguna tidak ditemukan" };
    }

    if (payload.email !== user.email) {
      const existing = await getUserByEmail(payload.email);
      if (existing) {
        return { success: false, message: "Email sudah digunakan" };
      }
    }

    await updateUser(payload.id, {
      name: payload.name,
      email: payload.email,
      role: payload.role,
      ...(payload.password ? { password: await hashPassword(payload.password) } : {}),
    });

    revalidateUsers();
    return { success: true };
  } catch (error) {
    const message = error instanceof z.ZodError ? error.errors[0]?.message || "Data tidak valid" : error instanceof Error ? error.message : "Gagal mengubah pengguna";
    return { success: false, message };
  }
}

export async function deleteUserAction(formData: FormData) {
  const adminCheck = await requireAdministrator();
  if (!adminCheck.success) {
    return { success: false, message: adminCheck.message };
  }

  try {
    const id = Number(formData.get("id"));
    if (!id || Number.isNaN(id)) {
      throw new Error("ID pengguna tidak valid");
    }

    if (adminCheck.session.userId === id) {
      return { success: false, message: "Tidak dapat menghapus akun Anda sendiri" };
    }

    await deleteUser(id);
    revalidateUsers();
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Gagal menghapus pengguna" };
  }
}


