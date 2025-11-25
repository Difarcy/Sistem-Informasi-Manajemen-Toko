"use server";

import { createUser, getUserByEmail } from "@/lib/db/users";
import { hashPassword } from "@/lib/auth/auth";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter").max(100, "Nama maksimal 100 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export async function registerAction(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const validatedData = registerSchema.parse(rawData);

    // Check if user already exists
    const existingUser = await getUserByEmail(validatedData.email);
    if (existingUser) {
      return {
        success: false,
        message: "Email sudah terdaftar",
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    await createUser({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      role: "user",
    });

    return {
      success: true,
      message: "Registrasi berhasil. Silakan login dengan akun Anda.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0]?.message || "Validasi gagal",
      };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal melakukan registrasi",
    };
  }
}

