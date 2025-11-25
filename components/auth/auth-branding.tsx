"use client";

import Link from "next/link";
import { Store as StoreIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export function AuthBranding() {
  const pathname = usePathname();

  const loginContent = {
    description:
      "Masuk untuk melanjutkan kontrol stok, barang, dan transaksi toko Anda dalam satu sistem yang praktis.",
  };

  const registerContent = {
    description:
      "Buat akun baru dan mulai kelola stok, barang, serta transaksi toko secara terorganisir dan efisien.",
  };

  const resetPasswordContent = {
    description:
      "Atur ulang password Anda agar kembali bisa mengawasi stok, barang, dan transaksi toko kapan saja.",
  };

  const content = pathname?.includes("/register")
    ? registerContent
    : pathname?.includes("/reset-password")
    ? resetPasswordContent
    : loginContent;

  return (
    <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-12 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      <div className="relative z-10 w-full max-w-md space-y-6 text-center">
        <Link
          href="/"
          className="inline-flex flex-col items-center space-y-4 text-white"
        >
          <StoreIcon className="h-16 w-16" />
          <h1 className="text-4xl font-bold leading-tight">Store Manager</h1>
        </Link>
        <p className="text-lg text-blue-100/90 leading-relaxed">
          {content.description}
        </p>
      </div>
    </div>
  );
}

