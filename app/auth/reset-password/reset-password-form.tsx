"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations/auth";
import { Mail, ArrowRight } from "lucide-react";

export function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const { email } = data;
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSuccess(`Link reset password telah dikirim ke ${email}. Silakan cek inbox Anda.`);
      } catch (err) {
        console.error("Reset password error:", err);
        setError("Gagal mengirim link reset password. Silakan coba lagi.");
      }
    });
  };

  return (
    <div className="w-full space-y-6">
      <Card className="w-full max-w-lg border-zinc-200 dark:border-zinc-800">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Reset Password</CardTitle>
          <CardDescription className="text-base">Masukkan email Anda untuk mereset password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-sm space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
                {success}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="pl-10"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Memproses..." : "Kirim Link Reset"}
              {!isPending && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="text-center text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">Ingat password? </span>
        <Link href="/auth/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
          Masuk
        </Link>
      </div>
    </div>
  );
}

