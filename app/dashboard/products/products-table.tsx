"use client";

import { useMemo, useState, useEffect } from "react";
import { Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductDialog } from "./product-dialog";
import { DeleteProductDialog } from "./delete-product-dialog";
import { formatCurrency } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type ProductRow = {
  id: number;
  name: string;
  sku: string;
  description?: string | null;
  categoryId: number;
  category:
    | {
        id: number;
        name: string;
      }
    | null;
  price: number;
  stock: number;
  minStock: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
};

interface ProductsTableProps {
  products: ProductRow[];
  categories: { id: number; name: string }[];
}

type SortKey = "name" | "sku" | "category" | "price" | "stock";

export function ProductsTable({ products, categories }: ProductsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;
  const searchParams = useSearchParams();
  const router = useRouter();
  const highlightId = Number(searchParams?.get("highlight") ?? "");

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase();
    return products.filter((product) => {
      const matchName = product.name.toLowerCase().includes(term);
      const matchSku = product.sku.toLowerCase().includes(term);
      const matchCategory = product.category?.name?.toLowerCase().includes(term);
      return matchName || matchSku || matchCategory;
    });
  }, [products, searchTerm]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      let compareA: string | number = "";
      let compareB: string | number = "";

      switch (sortKey) {
        case "name":
          compareA = a.name.toLowerCase();
          compareB = b.name.toLowerCase();
          break;
        case "sku":
          compareA = a.sku.toLowerCase();
          compareB = b.sku.toLowerCase();
          break;
        case "category":
          compareA = a.category?.name?.toLowerCase() ?? "";
          compareB = b.category?.name?.toLowerCase() ?? "";
          break;
        case "price":
          compareA = Number(a.price);
          compareB = Number(b.price);
          break;
        case "stock":
          compareA = a.stock;
          compareB = b.stock;
          break;
      }

      if (compareA < compareB) return -1 * direction;
      if (compareA > compareB) return 1 * direction;
      return 0;
    });
  }, [filteredProducts, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedProducts.slice(start, start + pageSize);
  }, [sortedProducts, currentPage, pageSize]);

  useEffect(() => {
    if (!highlightId) return;
    const targetIndex = sortedProducts.findIndex((product) => product.id === highlightId);
    if (targetIndex !== -1) {
      const newPage = Math.floor(targetIndex / pageSize) + 1;
      if (newPage !== page) {
        const timeout = setTimeout(() => {
          setPage(newPage);
        }, 50);
        return () => clearTimeout(timeout);
      }
      const timeout = setTimeout(() => {
        router.replace("/dashboard/products", { scroll: false });
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [highlightId, sortedProducts, pageSize, router, page]);

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Belum ada data barang. Tambahkan data pertama Anda.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Cari:</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Nama, kode, atau kategori"
              className="w-52 rounded-full border border-zinc-200 bg-white pl-9 pr-3 py-1 text-xs text-zinc-700 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Urutkan berdasarkan:</span>
          <select
            className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium uppercase dark:border-zinc-700 dark:bg-zinc-900"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <option value="name">Nama</option>
            <option value="sku">Kode</option>
            <option value="category">Kategori</option>
            <option value="price">Harga</option>
            <option value="stock">Stok</option>
          </select>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Urutan:</span>
          <select
            className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium uppercase dark:border-zinc-700 dark:bg-zinc-900"
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value as "asc" | "desc")}
          >
            <option value="asc">Naik (A-Z / ↑)</option>
            <option value="desc">Turun (Z-A / ↓)</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3">No</th>
            <th className="px-4 py-3">Barang</th>
            <th className="px-4 py-3">Kode Barang</th>
            <th className="px-4 py-3">Kategori</th>
            <th className="px-4 py-3">Harga</th>
            <th className="px-4 py-3">Stok</th>
            <th className="px-4 py-3">Satuan</th>
            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((product, index) => {
            const isHighlighted = product.id === highlightId;
            return (
            <tr
              key={product.id}
              className={cn(
                "border-t border-zinc-200 text-sm text-zinc-600 transition dark:border-zinc-800 dark:text-zinc-300",
                isHighlighted && "bg-blue-50/60 dark:bg-blue-950/30"
              )}
            >
              <td className="px-4 py-3 font-semibold text-zinc-500 dark:text-zinc-400">
                {(currentPage - 1) * pageSize + index + 1}
              </td>
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">{product.name}</p>
                  <p className="text-xs text-zinc-500">SKU: {product.sku}</p>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                  {product.sku}
                </span>
              </td>
              <td className="px-4 py-3">{product.category?.name ?? "-"}</td>
              <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{formatCurrency(product.price)}</td>
              <td className="px-4 py-3">
                <div className="text-sm text-zinc-900 dark:text-white">{product.stock}</div>
                <p className="text-xs text-zinc-500">Minimal: {product.minStock}</p>
              </td>
              <td className="px-4 py-3">{product.unit}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <ProductDialog categories={categories} product={product}>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </ProductDialog>
                  <DeleteProductDialog productId={product.id} productName={product.name}>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DeleteProductDialog>
                </div>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 bg-zinc-50 px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <p className="text-xs text-zinc-500">
          Menampilkan{" "}
          {sortedProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
          {Math.min(currentPage * pageSize, sortedProducts.length)} dari {sortedProducts.length} barang
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((prev) => Math.max(1, Math.min(prev, totalPages) - 1))
            }
            disabled={currentPage === 1}
          >
            Sebelumnya
          </Button>
          <span className="text-xs text-zinc-500">
            Halaman {currentPage} / {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((prev) => Math.min(totalPages, Math.min(prev, totalPages) + 1))
            }
            disabled={currentPage === totalPages}
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
}

