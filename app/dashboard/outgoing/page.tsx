import { getAllProducts } from "@/lib/db/products";
import { getAllTransactions } from "@/lib/db/transactions";
import { serializeProductsForTransaction, serializeTransactionRows } from "@/lib/serializers/transactions";
import { TransactionForm } from "../transactions/transaction-form";
import { TransactionTable } from "../transactions/transaction-table";

export default async function OutgoingPage() {
  const [products, allTransactions] = await Promise.all([getAllProducts(), getAllTransactions()]);
  const outgoingTransactions = serializeTransactionRows(allTransactions.filter((transaction) => transaction.type === "KELUAR"));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Barang Keluar</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Kelola dan pantau barang yang keluar dari gudang.</p>
      </div>

      <TransactionForm type="KELUAR" products={serializeProductsForTransaction(products)} />

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold">Riwayat Barang Keluar</h2>
        <p className="text-sm text-zinc-500">Daftar transaksi barang keluar terbaru.</p>
        <div className="mt-4">
          <TransactionTable transactions={outgoingTransactions} />
        </div>
      </div>
    </div>
  );
}

