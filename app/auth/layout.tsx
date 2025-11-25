import type { Metadata } from "next";
import { AuthBranding } from "@/components/auth/auth-branding";

export const metadata: Metadata = {
  title: "Store Manager",
  description: "Sistem Informasi Manajemen Toko",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <AuthBranding />

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-900">
        <div className="w-full max-w-lg">{children}</div>
      </div>
    </div>
  );
}

