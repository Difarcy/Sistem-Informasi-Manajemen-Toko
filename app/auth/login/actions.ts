"use server";

import { getUserByIdentifier } from "@/lib/db/users";
import { verifyPassword, createSession } from "@/lib/auth/auth";
import { z } from "zod";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email atau username wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export async function loginAction(formData: FormData) {
  try {
    const rawData = {
      identifier: formData.get("identifier") as string,
      password: formData.get("password") as string,
    };

    const validatedData = loginSchema.parse(rawData);

    // Find user by email or username
    const user = await getUserByIdentifier(validatedData.identifier);

    if (!user) {
      return {
        success: false,
        message: "Email atau password salah",
      };
    }

    // Debug: Log user data (development only)
    if (process.env.NODE_ENV === "development") {
      console.log("[loginAction] User found:", {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        roleType: typeof user.role,
        roleValue: JSON.stringify(user.role),
        hasRole: "role" in user,
        userKeys: Object.keys(user),
      });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Email atau password salah",
      };
    }

    // Ensure role is set, default to "user" if missing
    const userRole = (user.role === "administrator" || user.role === "user")
      ? user.role
      : "user";

    // Debug: Log session creation (development only)
    if (process.env.NODE_ENV === "development") {
      console.log("[loginAction] Creating session with role:", userRole);
    }

    // Create session
    await createSession(user.id, user.email, user.name, userRole);

    return {
      success: true,
      message: "Login berhasil",
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
      message: error instanceof Error ? error.message : "Gagal melakukan login",
    };
  }
}

