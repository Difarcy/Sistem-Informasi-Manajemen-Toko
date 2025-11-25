import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Masuk | Store Manager",
  description: "Masuk ke Store Manager untuk mengelola toko Anda.",
};

export default function LoginPage() {
  return <LoginForm />;
}
