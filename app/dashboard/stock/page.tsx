import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3 } from "lucide-react";
import { getStockReport } from "@/lib/db/reports";

function getStatusColor(status: "AMAN" | "HABIS" | "MINIM") {
  switch (status) {
    case "HABIS":
      return "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200";
    case "MINIM":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200";
    default:
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200";
  }
}

export default async function StockPage() {
  const stockReport = await getStockReport();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Monitoring Stok</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Pantau stok barang dan peringatan stok minim</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          {stockReport.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BarChart3 className="h-12 w-12 text-zinc-400" />
              <p className="mt-4 text-sm text-zinc-500">Data stok akan ditampilkan di sini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Barang</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">Stok Saat Ini</TableHead>
                    <TableHead className="text-right">Batas Minimum</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockReport.map((row) => (
                    <TableRow key={row.productId}>
                      <TableCell>
                        <p className="font-medium">{row.productName}</p>
                        <p className="text-xs text-zinc-500">{row.unit}</p>
                      </TableCell>
                      <TableCell>{row.categoryName}</TableCell>
                      <TableCell className="text-right font-semibold">{row.currentStock}</TableCell>
                      <TableCell className="text-right text-sm text-zinc-500">{row.minStock}</TableCell>
                      <TableCell className="text-right">
                        <span className={`inline-flex rounded-full px-3 py-0.5 text-xs font-semibold ${getStatusColor(row.status)}`}>{row.status}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

