"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { loginAction } from "./actions";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    startTransition(async () => {
      const formData = new FormData();
      formData.append("identifier", data.identifier);
      formData.append("password", data.password);

      const result = await loginAction(formData);

      if (result.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(result.message || "Terjadi kesalahan. Silakan coba lagi.");
      }
    });
  };

  return (
    <div className="w-full space-y-6">
      <Card className="w-full max-w-lg border-zinc-200 dark:border-zinc-800">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Selamat Datang</CardTitle>
          <CardDescription className="text-base">
            Silakan masuk dengan email dan password Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-sm space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="identifier">Email atau Username</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Email atau username"
                  className="pl-10"
                  {...register("identifier")}
                />
              </div>
              {errors.identifier && <p className="text-sm text-red-500">{errors.identifier.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/reset-password" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="pl-10 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Memproses..." : "Masuk"}
              {!isPending && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">Belum punya akun? </span>
        <Link href="/auth/register" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
          Daftar sekarang
        </Link>
      </div>
    </div>
  );
}

