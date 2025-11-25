import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { getStockReport } from "@/lib/db/reports";

export default async function StockPage() {
  const stockReport = await getStockReport();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Monitoring Stok</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Pantau stok barang dan peringatan stok minim
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Laporan Stok</CardTitle>
          <CardDescription>
            Informasi stok semua barang dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stockReport.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BarChart3 className="h-12 w-12 text-zinc-400" />
              <p className="mt-4 text-sm text-zinc-500">
                Data stok akan ditampilkan di sini.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Total: {stockReport.length} barang
              </p>
              {/* TODO: Tambahkan table untuk menampilkan stock report */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

