import { Card, CardContent } from "@/components/ui/card";
import { getDailyReport } from "@/lib/db/reports";
import { serializeReportTransactions } from "@/lib/serializers/transactions";
import { TransactionTable } from "../../transactions/transaction-table";

type DailyReportPageProps = {
  searchParams?:
    | Record<string, string | string[] | undefined>
    | URLSearchParams
    | Promise<Record<string, string | string[] | undefined> | URLSearchParams>;
};

function formatCurrency(value: number) {
  return value.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });
}

function getSearchParamValue(params: DailyReportPageProps["searchParams"], key: string) {
  if (!params) return undefined;
  if (typeof URLSearchParams !== "undefined" && params instanceof URLSearchParams) {
    return params.get(key) ?? undefined;
  }
  const value = (params as Record<string, string | string[] | undefined>)[key];
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function resolveSelectedDate(params?: Record<string, string | string[] | undefined> | URLSearchParams) {
  const dateParam = getSearchParamValue(params, "date");
  const fallback = new Date();
  if (!dateParam) {
    return {
      date: fallback,
      input: fallback.toISOString().split("T")[0],
    };
  }

  const parsed = new Date(dateParam);
  if (Number.isNaN(parsed.getTime())) {
    return {
      date: fallback,
      input: fallback.toISOString().split("T")[0],
    };
  }

  return {
    date: parsed,
    input: parsed.toISOString().split("T")[0],
  };
}

export default async function DailyReportPage({ searchParams }: DailyReportPageProps) {
  const resolvedParams =
    searchParams && typeof (searchParams as Promise<unknown>).then === "function"
      ? await searchParams
      : searchParams;

  const { date: selectedDate, input: selectedDateInput } = resolveSelectedDate(resolvedParams);

  const report = await getDailyReport(selectedDate);
  const serializedTransactions = serializeReportTransactions(report.transactions);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan Harian</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Ringkasan transaksi pada tanggal tertentu.</p>
        </div>
        <form className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <label htmlFor="date" className="text-sm font-medium">
            Tanggal
          </label>
          <input
            type="date"
            id="date"
            name="date"
            defaultValue={selectedDateInput}
            className="rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
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

      <Card>
        <CardContent className="pt-6">
          {serializedTransactions.length === 0 ? (
            <p className="text-sm text-zinc-500">Belum ada transaksi pada tanggal ini.</p>
          ) : (
            <TransactionTable transactions={serializedTransactions} allowActions={false} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}


