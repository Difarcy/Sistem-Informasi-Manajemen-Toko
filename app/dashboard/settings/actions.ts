"use server";

import { z } from "zod";

const settingsSchema = z.object({
  emailNotifications: z.boolean(),
  lowStockAlerts: z.boolean(),
  weeklyReports: z.boolean(),
  theme: z.enum(["system", "light", "dark"]),
});

function parseBoolean(value: FormDataEntryValue | null) {
  return value === "true" || value === "on";
}

export async function updateSettingsAction(formData: FormData) {
  try {
    const payload = settingsSchema.parse({
      emailNotifications: parseBoolean(formData.get("emailNotifications")),
      lowStockAlerts: parseBoolean(formData.get("lowStockAlerts")),
      weeklyReports: parseBoolean(formData.get("weeklyReports")),
      theme: (formData.get("theme") as "system" | "light" | "dark") ?? "system",
    });

    // TODO: Persist settings to database once table is available.
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      message: "Pengaturan berhasil disimpan",
      data: payload,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0]?.message ?? "Data tidak valid",
      };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menyimpan pengaturan",
    };
  }
}


