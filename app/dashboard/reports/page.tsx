import { Card, CardContent } from "@/components/ui/card";
import { FileText, CalendarDays, CalendarClock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const reportLinks = [
  {
    title: "Laporan Harian",
    description: "Pantau transaksi harian dan detail barang.",
    href: "/dashboard/reports/harian",
    icon: CalendarDays,
  },
  {
    title: "Laporan Bulanan",
    description: "Lihat performa bulanan dan barang terlaris.",
    href: "/dashboard/reports/bulanan",
    icon: CalendarClock,
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Laporan</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Lihat laporan harian dan bulanan transaksi</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reportLinks.map((link) => (
          <Card key={link.href}>
            <CardContent className="flex flex-col gap-3 pt-6">
              <div className="flex items-center gap-3">
                <link.icon className="h-10 w-10 rounded-full bg-zinc-100 p-2 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300" />
                <div>
                  <h3 className="text-lg font-semibold">{link.title}</h3>
                  <p className="text-sm text-zinc-500">{link.description}</p>
                </div>
              </div>
              <Link href={link.href}>
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Buka {link.title}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

