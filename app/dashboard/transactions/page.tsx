import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import Link from "next/link";
import { getAllTransactions } from "@/lib/db/transactions";
import { serializeTransactionRows } from "@/lib/serializers/transactions";
import { TransactionTable } from "./transaction-table";

export default async function TransactionsPage() {
  const transactions = await getAllTransactions();
  const serialized = serializeTransactionRows(transactions);

  const totalMasuk = serialized
    .filter((transaction) => transaction.type === "MASUK")
    .reduce((sum, transaction) => sum + transaction.totalAmount, 0);
  const totalKeluar = serialized
    .filter((transaction) => transaction.type === "KELUAR")
    .reduce((sum, transaction) => sum + transaction.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transaksi</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Kelola transaksi barang masuk dan keluar</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/incoming">
            <Button variant="outline">
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              Catat Barang Masuk
            </Button>
          </Link>
          <Link href="/dashboard/outgoing">
            <Button variant="outline">
              <ArrowDownCircle className="mr-2 h-4 w-4" />
              Catat Barang Keluar
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-zinc-500">Total Barang Masuk</p>
            <p className="mt-1 text-2xl font-semibold">
              {totalMasuk.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-zinc-500">Total Barang Keluar</p>
            <p className="mt-1 text-2xl font-semibold text-rose-600 dark:text-rose-400">
              {totalKeluar.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          {serialized.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ArrowDownUp className="h-12 w-12 text-zinc-400" />
              <p className="mt-4 text-sm text-zinc-500">Belum ada transaksi. Mulai dengan membuat transaksi baru.</p>
            </div>
          ) : (
            <TransactionTable transactions={serialized} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

