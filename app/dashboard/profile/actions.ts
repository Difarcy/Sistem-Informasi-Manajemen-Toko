"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { updateUser, getUserById, getUserByEmail, getUserByName } from "@/lib/db/users";
import { getSession, createSession } from "@/lib/auth/auth";

const profileSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(100, "Nama maksimal 100 karakter"),
  email: z.string().email("Email tidak valid").max(100, "Email maksimal 100 karakter"),
});

export async function updateProfileAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, message: "Unauthorized: No session found" };
    }

    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    };

    const validatedData = profileSchema.parse(rawData);
    const avatarInput = formData.get("avatar");
    let avatarUrl: string | undefined;

    if (typeof avatarInput === "string" && avatarInput.trim().length > 0) {
      if (!avatarInput.startsWith("data:image/")) {
        return { success: false, message: "Format gambar tidak valid" };
      }
      avatarUrl = avatarInput;
    }

    // Check if email is already taken by another user
    const existingUser = await getUserById(session.userId);
    if (!existingUser) {
      return { success: false, message: "User tidak ditemukan" };
    }

    // Check if email is changed and already exists
    if (validatedData.email !== existingUser.email) {
      const emailExists = await getUserByEmail(validatedData.email);
      if (emailExists && emailExists.id !== session.userId) {
        return { success: false, message: "Email sudah digunakan oleh user lain" };
      }
    }

    // Check if name is changed and already exists
    if (validatedData.name !== existingUser.name) {
      const nameExists = await getUserByName(validatedData.name);
      if (nameExists && nameExists.id !== session.userId) {
        return { success: false, message: "Username sudah digunakan oleh user lain" };
      }
    }

    // Update user
    await updateUser(session.userId, {
      name: validatedData.name,
      email: validatedData.email,
      ...(avatarUrl ? { avatarUrl } : {}),
    });

    // Update session with new name and email
    const updatedUser = await getUserById(session.userId);
    if (updatedUser) {
      const avatar =
        updatedUser && typeof updatedUser === "object" && "avatarUrl" in updatedUser
          ? ((updatedUser as { avatarUrl?: string | null }).avatarUrl ?? null)
          : null;

      await createSession(
        updatedUser.id,
        updatedUser.email,
        updatedUser.name,
        updatedUser.role as "administrator" | "user",
        avatar
      );
    }

    revalidatePath("/dashboard/profile");
    return { success: true, message: "Profil berhasil diperbarui" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0]?.message || "Validasi gagal" };
    }
    return { success: false, message: error instanceof Error ? error.message : "Gagal memperbarui profil" };
  }
}

