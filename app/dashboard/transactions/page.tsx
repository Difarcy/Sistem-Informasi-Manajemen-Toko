import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import Link from "next/link";
import { getAllTransactions } from "@/lib/db/transactions";

export default async function TransactionsPage() {
  const transactions = await getAllTransactions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transaksi</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Kelola transaksi barang masuk dan keluar
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/transactions/masuk">
            <Button variant="outline">
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              Transaksi Masuk
            </Button>
          </Link>
          <Link href="/dashboard/transactions/keluar">
            <Button variant="outline">
              <ArrowDownCircle className="mr-2 h-4 w-4" />
              Transaksi Keluar
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi</CardTitle>
          <CardDescription>
            Riwayat semua transaksi masuk dan keluar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ArrowDownUp className="h-12 w-12 text-zinc-400" />
              <p className="mt-4 text-sm text-zinc-500">
                Belum ada transaksi. Mulai dengan membuat transaksi baru.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Total: {transactions.length} transaksi
              </p>
              {/* TODO: Tambahkan table untuk menampilkan transactions */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

