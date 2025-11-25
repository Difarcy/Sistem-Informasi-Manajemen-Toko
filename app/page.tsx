import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Store,
  Package,
  FolderTree,
  ArrowDownUp,
  BarChart3,
  FileText,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  LayoutDashboard,
} from "lucide-react";
import { getSession } from "@/lib/auth/auth";
import { UserMenu } from "@/components/layouts/user-menu";

export default async function Home() {
  const session = await getSession();
  const features = [
    {
      icon: Package,
      title: "Manajemen Barang",
      description: "Kelola data barang dengan mudah. Tambah, edit, dan hapus barang dengan sistem yang terorganisir.",
    },
    {
      icon: FolderTree,
      title: "Kategori Barang",
      description: "Organisir barang berdasarkan kategori untuk memudahkan pencarian dan pengelolaan inventori.",
    },
    {
      icon: ArrowDownUp,
      title: "Transaksi Masuk & Keluar",
      description: "Catat setiap transaksi barang masuk dan keluar dengan detail lengkap dan referensi yang jelas.",
    },
    {
      icon: BarChart3,
      title: "Monitoring Stok",
      description: "Pantau stok barang secara real-time dengan peringatan otomatis untuk stok yang habis atau minim.",
    },
    {
      icon: FileText,
      title: "Laporan Lengkap",
      description: "Generate laporan harian dan bulanan untuk analisis penjualan dan pengelolaan inventori.",
    },
    {
      icon: TrendingUp,
      title: "Perhitungan Otomatis",
      description: "Sistem menghitung stok secara otomatis setiap ada transaksi, mengurangi kesalahan manual.",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Cepat & Efisien",
      description: "Proses pengelolaan inventori menjadi lebih cepat dan efisien.",
    },
    {
      icon: Shield,
      title: "Akurat & Terpercaya",
      description: "Data terjamin akurat dengan sistem perhitungan otomatis.",
    },
    {
      icon: TrendingUp,
      title: "Analisis Data",
      description: "Dapatkan insight dari laporan untuk pengambilan keputusan yang lebih baik.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="relative z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6 text-foreground" />
            <span className="text-xl font-bold leading-none">Store Manager</span>
          </div>
          <div className="relative flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <a href="#features" className="rounded-md px-3 py-2 transition hover:text-foreground">
              Fitur
            </a>
            <a href="#tech" className="rounded-md px-3 py-2 transition hover:text-foreground">
              Teknologi
            </a>
            <a href="#about-detail" className="rounded-md px-3 py-2 transition hover:text-foreground">
              Tentang
            </a>
            <a href="#contact" className="rounded-md px-3 py-2 transition hover:text-foreground">
              Kontak
            </a>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-md px-3 py-2 transition hover:text-foreground"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="relative scale-90" style={{ zIndex: 1000 }}>
                  <UserMenu
                    name={session.name}
                    email={session.email}
                    showEmail={false}
                    compact
                    logoutRedirect="landing"
                  />
                </div>
              </>
            ) : (
              <Link href="/auth/login">
                <Button size="sm">Masuk</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
        <div className="container mx-auto px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900">
              <Package className="h-4 w-4" />
              <span>Sistem Manajemen Modern</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight lg:text-6xl">
              <span className="text-foreground">Sistem Informasi </span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Manajemen Toko
              </span>
            </h1>
            <p className="mb-8 text-xl text-zinc-600 dark:text-zinc-400">
              Kelola inventori toko Anda dengan mudah, cepat, dan akurat.
              Sistem terintegrasi untuk manajemen barang, transaksi, dan laporan.
            </p>
            <div className="flex flex-col items-center justify-center">
              <Link href="/auth/login">
                <Button size="lg" className="group">
                  Mulai Sekarang
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-zinc-200 bg-white py-24 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-5xl px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">
              Fitur-Fitur Unggulan
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Semua yang Anda butuhkan untuk mengelola toko dalam satu platform
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="tech" className="border-t border-zinc-200 bg-zinc-50 py-24 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="container mx-auto px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">
              Teknologi yang Kami Gunakan
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Solusi terbaik untuk manajemen toko Anda
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <benefit.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{benefit.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="about-detail" className="border-t border-zinc-200 bg-white py-24 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">Tentang Store Manager</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Store Manager adalah platform manajemen toko yang dirancang untuk membantu pemilik usaha memantau stok,
              mengelola produk, dan mencatat transaksi tanpa biaya langganan. Semua fitur dapat diakses bebas dengan antarmuka yang sederhana.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="border-t border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="container mx-auto px-6">
          <div className="mb-10 max-w-2xl text-center mx-auto space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Kontak Kami</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Hubungi kami kapan saja untuk bertanya mengenai Store Manager.
            </p>
          </div>
          <div className="grid gap-10 text-center text-zinc-600 dark:text-zinc-400 lg:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Alamat</p>
              <p>Jl. Kemang Raya No. 12, Jakarta Selatan</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Email</p>
              <p>support@storemanager.com</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Telepon</p>
              <p>+62 812-3456-7890</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-gradient-to-r from-blue-600 to-purple-600 py-24 dark:border-zinc-800">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white lg:text-4xl">
              Siap Memulai?
            </h2>
            <p className="mb-8 text-lg text-blue-100">
              Mulai kelola toko Anda dengan sistem yang modern dan terpercaya
            </p>
            <Link href="/auth/login">
              <Button size="lg" className="group bg-white text-blue-600 hover:bg-zinc-100 hover:text-blue-700">
                Mulai Kelola Toko
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl space-y-5 px-6">
          <div className="grid gap-10 text-sm text-zinc-600 dark:text-zinc-400 md:grid-cols-3">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Store className="h-5 w-5" />
                <span>Store Manager</span>
              </div>
              <p className="leading-relaxed">
                Platform manajemen toko untuk memantau stok, kategori, transaksi, dan laporan dengan mudah.
              </p>
              <div className="flex items-center gap-3 text-zinc-500">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="rounded-full border border-zinc-200 p-2 hover:text-foreground dark:border-zinc-700">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded-full border border-zinc-200 p-2 hover:text-foreground dark:border-zinc-700">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="rounded-full border border-zinc-200 p-2 hover:text-foreground dark:border-zinc-700">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="rounded-full border border-zinc-200 p-2 hover:text-foreground dark:border-zinc-700">
                  <Github className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="space-y-2 text-center md:text-left md:mx-auto md:max-w-xs">
              <p className="text-sm font-semibold text-foreground">Akses Cepat</p>
              <ul className="space-y-1">
                <li><a href="#features" className="hover:text-foreground">Fitur</a></li>
                <li><a href="#tech" className="hover:text-foreground">Teknologi</a></li>
                <li><a href="#about-detail" className="hover:text-foreground">Tentang</a></li>
                <li><a href="#contact" className="hover:text-foreground">Kontak</a></li>
              </ul>
            </div>
            <div className="space-y-2 text-center md:text-left md:pl-8">
              <p className="text-sm font-semibold text-foreground">Kontak</p>
              <ul className="space-y-1">
                <li>Email: support@storemanager.com</li>
                <li>Telepon: +62 812-3456-7890</li>
                <li>Lokasi: Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-200 pt-3 pb-2 text-center text-xs font-medium text-zinc-500 dark:border-zinc-800">
            © {new Date().getFullYear()} Store Manager. Solusi manajemen toko modern.
          </div>
        </div>
      </footer>
    </div>
  );
}
