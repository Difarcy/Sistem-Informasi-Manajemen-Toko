import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Laporan</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Lihat laporan harian dan bulanan transaksi
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Laporan Harian</CardTitle>
            <CardDescription>
              Laporan transaksi per hari
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/reports/harian">
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Lihat Laporan Harian
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Laporan Bulanan</CardTitle>
            <CardDescription>
              Laporan transaksi per bulan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/reports/bulanan">
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Lihat Laporan Bulanan
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

