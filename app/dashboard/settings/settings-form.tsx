"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateSettingsAction } from "./actions";
import { CheckCircle2, AlertCircle, Bell, Palette } from "lucide-react";

const settingsSchema = z.object({
  emailNotifications: z.boolean(),
  lowStockAlerts: z.boolean(),
  weeklyReports: z.boolean(),
  theme: z.enum(["system", "light", "dark"]),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export function SettingsForm() {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      emailNotifications: true,
      lowStockAlerts: true,
      weeklyReports: false,
      theme: "system",
    },
  });

  const handleSubmit = (values: SettingsValues) => {
    startTransition(async () => {
      const payload = new FormData();
      payload.append("emailNotifications", values.emailNotifications ? "true" : "false");
      payload.append("lowStockAlerts", values.lowStockAlerts ? "true" : "false");
      payload.append("weeklyReports", values.weeklyReports ? "true" : "false");
      payload.append("theme", values.theme);

      const result = await updateSettingsAction(payload);
      if (result.success) {
        setMessage({ type: "success", text: result.message });
      } else {
        setMessage({ type: "error", text: result.message });
      }
    });
  };

  const handleReset = () => {
    form.reset({
      emailNotifications: true,
      lowStockAlerts: true,
      weeklyReports: false,
      theme: "system",
    });
    setMessage(null);
  };

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Pengaturan Sistem</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Kelola preferensi notifikasi dan tampilan dashboard Anda.
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {message.text}
          </div>
        )}

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-sm font-semibold">Notifikasi Email</p>
              <p className="text-xs text-zinc-500">
                Pilih notifikasi yang ingin Anda terima melalui email.
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <label className="flex items-start gap-2">
                  <Input
                    type="checkbox"
                    className="mt-1 h-4 w-4"
                    disabled={isPending}
                    {...form.register("emailNotifications")}
                  />
                  <div>
                    <span className="font-medium">Ringkasan Aktivitas Harian</span>
                    <p className="text-xs text-zinc-500">
                      Dapatkan ringkasan harian mengenai transaksi terbaru.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2">
                  <Input
                    type="checkbox"
                    className="mt-1 h-4 w-4"
                    disabled={isPending}
                    {...form.register("lowStockAlerts")}
                  />
                  <div>
                    <span className="font-medium">Peringatan Stok Minim</span>
                    <p className="text-xs text-zinc-500">
                      Terima peringatan otomatis ketika stok mendekati batas minimum.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2">
                  <Input
                    type="checkbox"
                    className="mt-1 h-4 w-4"
                    disabled={isPending}
                    {...form.register("weeklyReports")}
                  />
                  <div>
                    <span className="font-medium">Laporan Mingguan</span>
                    <p className="text-xs text-zinc-500">
                      Kirim laporan penjualan mingguan ke email Anda.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-zinc-500" />
                <p className="text-sm font-semibold">Tema Tampilan</p>
              </div>
              <p className="text-xs text-zinc-500">
                Sesuaikan tema dashboard sesuai preferensi Anda.
              </p>
              <div className="mt-4 space-y-2 text-sm">
                {["system", "light", "dark"].map((theme) => (
                  <label
                    key={theme}
                    className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 transition hover:border-zinc-200 dark:hover:border-zinc-700"
                  >
                    <input
                      type="radio"
                      value={theme}
                      className="h-4 w-4 cursor-pointer accent-blue-600"
                      disabled={isPending}
                      {...form.register("theme")}
                    />
                    <span className="capitalize">{theme === "system" ? "Ikuti Sistem" : theme}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan Pengaturan"}
            </Button>
            <Button type="button" variant="outline" disabled={isPending} onClick={handleReset}>
              Reset Default
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


