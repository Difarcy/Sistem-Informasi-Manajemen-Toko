import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Daftar | Store Manager",
  description: "Daftar akun baru Store Manager untuk mulai mengelola toko Anda.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}

