import type { Metadata } from "next";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Lupa Password | Store Manager",
  description: "Atur ulang password akun Store Manager Anda.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}

