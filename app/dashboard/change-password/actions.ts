"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession, verifyPassword, hashPassword } from "@/lib/auth/auth";
import { getUserById, updateUser } from "@/lib/db/users";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Password saat ini minimal 6 karakter"),
    newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "Password baru tidak boleh sama dengan password lama",
    path: ["newPassword"],
  });

export async function changePasswordAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, message: "Anda belum login" };
    }

    const payload = changePasswordSchema.parse({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const user = await getUserById(session.userId);
    if (!user) {
      return { success: false, message: "Pengguna tidak ditemukan" };
    }

    const isValid = await verifyPassword(payload.currentPassword, user.password);
    if (!isValid) {
      return { success: false, message: "Password saat ini salah" };
    }

    const hashedPassword = await hashPassword(payload.newPassword);
    await updateUser(user.id, { password: hashedPassword });
    revalidatePath("/dashboard/change-password");

    return { success: true, message: "Password berhasil diperbarui" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0]?.message ?? "Data tidak valid",
      };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengganti password",
    };
  }
}


