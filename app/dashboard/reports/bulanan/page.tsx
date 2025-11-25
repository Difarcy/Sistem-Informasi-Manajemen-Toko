import { Card, CardContent } from "@/components/ui/card";
import { getMonthlyReport } from "@/lib/db/reports";
import { getMonthlyTransactions } from "@/lib/db/transactions";
import { serializeTransactionRows } from "@/lib/serializers/transactions";
import { TransactionTable } from "../../transactions/transaction-table";

type MonthlyReportPageProps = {
  searchParams?:
    | Record<string, string | string[] | undefined>
    | URLSearchParams
    | Promise<Record<string, string | string[] | undefined> | URLSearchParams>;
};

const MONTH_OPTIONS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatCurrency(value: number) {
  return value.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });
}

function getSearchParamValue(params: MonthlyReportPageProps["searchParams"], key: string) {
  if (!params) return undefined;
  if (typeof URLSearchParams !== "undefined" && params instanceof URLSearchParams) {
    return params.get(key) ?? undefined;
  }
  const value = (params as Record<string, string | string[] | undefined>)[key];
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function resolveMonthYear(params?: Record<string, string | string[] | undefined> | URLSearchParams) {
  const monthParam = getSearchParamValue(params, "month");
  const yearParam = getSearchParamValue(params, "year");
  const today = new Date();
  let year = Number(yearParam);
  if (!Number.isFinite(year) || year < 2000 || year > 2100) {
    year = today.getFullYear();
  }

  let month = Number(monthParam);
  if (!Number.isFinite(month) || month < 1 || month > 12) {
    month = today.getMonth() + 1;
  }

  return { month, year };
}

export default async function MonthlyReportPage({ searchParams }: MonthlyReportPageProps) {
  const resolvedParams =
    searchParams && typeof (searchParams as Promise<unknown>).then === "function"
      ? await searchParams
      : searchParams;

  const { month: selectedMonth, year: selectedYear } = resolveMonthYear(resolvedParams);

  const [report, monthlyTransactions] = await Promise.all([
    getMonthlyReport(selectedYear, selectedMonth),
    getMonthlyTransactions(selectedYear, selectedMonth),
  ]);
  const serializedTransactions = serializeTransactionRows(monthlyTransactions);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan Bulanan</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Statistik transaksi untuk bulan terpilih.</p>
        </div>
        <form className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <select
            name="month"
            defaultValue={selectedMonth}
            className="rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          >
            {MONTH_OPTIONS.map((label, index) => (
              <option key={label} value={index + 1}>
                {label}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="year"
            defaultValue={selectedYear}
            min={2020}
            max={2100}
            className="w-24 rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          />
          <button type="submit" className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900">
            Tampilkan
          </button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-zinc-500">Total Masuk</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(report.totalMasuk)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-zinc-500">Total Keluar</p>
            <p className="mt-1 text-2xl font-semibold text-rose-600 dark:text-rose-400">{formatCurrency(report.totalKeluar)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-zinc-500">Total Transaksi</p>
            <p className="mt-1 text-2xl font-semibold">{report.totalTransactions}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardContent className="pt-6">
            {serializedTransactions.length === 0 ? (
              <p className="text-sm text-zinc-500">Belum ada transaksi pada bulan ini.</p>
            ) : (
              <TransactionTable transactions={serializedTransactions} allowActions={false} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 pt-6">
            <div>
              <p className="text-sm font-semibold">Barang Paling Aktif</p>
              <p className="text-xs text-zinc-500">Berdasarkan total kuantitas transaksi.</p>
            </div>
            <div className="space-y-3">
              {report.topProducts?.length ? (
                report.topProducts.map((product) => (
                  <div key={product.productId} className="rounded-xl border border-zinc-200 p-3 text-sm dark:border-zinc-800">
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-xs text-zinc-500">Total: {product.totalQuantity}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">Belum ada data.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

