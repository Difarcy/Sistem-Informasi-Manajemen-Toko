import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  XCircle,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/lib/db/categories";
import { getAllProducts } from "@/lib/db/products";
import { getDailyTransactions } from "@/lib/db/transactions";
import { getLowStockProducts, getOutOfStockProducts } from "@/lib/db/products";
import {
  getTodayFinancialStats,
  getRecentTransactions,
  getTopSellingProducts,
  getMonthlyStats,
} from "@/lib/db/dashboard-stats";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const [
    products,
    categories,
    lowStockItems,
    outOfStockItems,
    todayTransactions,
    todayFinancial,
    recentTransactions,
    topProducts,
    monthlyStats,
  ] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getLowStockProducts(),
    getOutOfStockProducts(),
    getDailyTransactions(new Date()),
    getTodayFinancialStats(),
    getRecentTransactions(5),
    getTopSellingProducts(5),
    getMonthlyStats(),
  ]);

  const stats = {
    totalProducts: products.length,
    totalCategories: categories.length,
    lowStockItems: lowStockItems.length,
    outOfStockItems: outOfStockItems.length,
    todayTransactions: todayTransactions.length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Selamat datang di Sistem Informasi Manajemen Toko
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Barang</CardTitle>
            <Package className="h-4 w-4 text-zinc-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-zinc-500">Barang terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendapatan Hari Ini</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(todayFinancial.totalKeluar)}
            </div>
            <p className="text-xs text-zinc-500">
              {todayFinancial.transactionCount} transaksi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Minim</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockItems}</div>
            <p className="text-xs text-zinc-500">Perlu restock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Barang Habis</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.outOfStockItems}
            </div>
            <p className="text-xs text-zinc-500">Stok habis</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transaksi Masuk</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(todayFinancial.totalMasuk)}</div>
            <p className="text-xs text-zinc-500">Hari ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transaksi Keluar</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(todayFinancial.totalKeluar)}
            </div>
            <p className="text-xs text-zinc-500">Hari ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bulan Ini</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(monthlyStats.netIncome)}
            </div>
            <p className="text-xs text-zinc-500">
              {monthlyStats.transactionCount} transaksi
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Stok yang Perlu Perhatian */}
        <Card>
          <CardHeader>
            <CardTitle>Stok yang Perlu Perhatian</CardTitle>
            <CardDescription>Barang dengan stok di bawah batas minimal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockItems.length === 0 ? (
              <p className="py-4 text-center text-sm text-zinc-500">
                Semua stok aman saat ini.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  {lowStockItems.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950/20"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-zinc-900 dark:text-white">
                          {item.name}
                        </p>
                        <span className="text-xs text-zinc-500">
                          {item.category?.name ?? "Tanpa kategori"}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-zinc-600 dark:text-zinc-400">
                          Stok:{" "}
                          <span className="font-semibold text-amber-600">
                            {item.stock} {item.unit}
                          </span>
                        </span>
                        <span className="text-zinc-500">
                          Min: {item.minStock} {item.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {lowStockItems.length > 5 && (
                  <Link href="/dashboard/stock">
                    <Button variant="link" className="w-full text-xs">
                      Lihat {lowStockItems.length - 5} lainnya →
                    </Button>
                  </Link>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Barang Habis */}
        <Card>
          <CardHeader>
            <CardTitle>Barang Habis</CardTitle>
            <CardDescription>Barang dengan stok 0</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {outOfStockItems.length === 0 ? (
              <p className="py-4 text-center text-sm text-zinc-500">
                Tidak ada barang yang habis.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  {outOfStockItems.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-red-200 bg-red-50/50 p-3 text-sm dark:border-red-800 dark:bg-red-950/20"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-zinc-900 dark:text-white">
                          {item.name}
                        </p>
                        <span className="text-xs text-zinc-500">
                          {item.category?.name ?? "Tanpa kategori"}
                        </span>
                      </div>
                      <div className="mt-2 text-xs">
                        <span className="font-semibold text-red-600">Stok: 0 {item.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {outOfStockItems.length > 5 && (
                  <Link href="/dashboard/products">
                    <Button variant="link" className="w-full text-xs">
                      Lihat {outOfStockItems.length - 5} lainnya →
                    </Button>
                  </Link>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Transaksi Terbaru */}
        <Card>
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
            <CardDescription>5 transaksi terakhir</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="py-4 text-center text-sm text-zinc-500">
                Belum ada transaksi.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  {recentTransactions.map((transaction) => (
                    <Link
                      key={transaction.id}
                      href={`/dashboard/transactions?id=${transaction.id}`}
                      className="block rounded-lg border border-zinc-200 p-3 text-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {transaction.type === "MASUK" ? (
                            <ArrowDownCircle className="h-4 w-4 text-blue-500" />
                          ) : (
                            <ArrowUpCircle className="h-4 w-4 text-green-500" />
                          )}
                          <div>
                            <p className="font-medium text-zinc-900 dark:text-white">
                              {transaction.reference || `Transaksi #${transaction.id}`}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {transaction.firstProduct}
                              {transaction.itemCount > 1 && ` +${transaction.itemCount - 1}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-zinc-900 dark:text-white">
                            {formatCurrency(transaction.totalAmount)}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {new Date(transaction.createdAt).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/dashboard/transactions">
                  <Button variant="link" className="w-full text-xs">
                    Lihat semua transaksi →
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Products & Monthly Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top 5 Produk Terlaris */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Produk Terlaris</CardTitle>
            <CardDescription>Produk dengan penjualan terbanyak</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="py-4 text-center text-sm text-zinc-500">
                Belum ada data penjualan.
              </p>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                          {product.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {product.category} • {product.sku}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {product.totalQuantity} terjual
                      </p>
                      <p className="text-xs text-zinc-500">
                        {formatCurrency(product.totalRevenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ringkasan Bulan Ini */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Bulan Ini</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Total Masuk
                  </span>
                </div>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {formatCurrency(monthlyStats.totalMasuk)}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Total Keluar
                  </span>
                </div>
                <span className="font-semibold text-green-600">
                  {formatCurrency(monthlyStats.totalKeluar)}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg border-2 border-purple-200 bg-purple-50/50 p-3 dark:border-purple-800 dark:bg-purple-950/20">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    Laba Bersih
                  </span>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  {formatCurrency(monthlyStats.netIncome)}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Total Transaksi
                  </span>
                </div>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {monthlyStats.transactionCount}
                </span>
              </div>
            </div>

            <Link href="/dashboard/reports">
              <Button variant="outline" className="w-full">
                Lihat Laporan Lengkap →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

