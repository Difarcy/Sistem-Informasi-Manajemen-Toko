"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Package, FolderTree, ArrowDownUp } from "lucide-react";
import Link from "next/link";

type SearchResult = {
  products: Array<{ id: number; name: string; sku: string }>;
  categories: Array<{ id: number; name: string }>;
  transactions: Array<{ id: number; reference: string | null; type: string; createdAt: string }>;
};

const initialResults: SearchResult = {
  products: [],
  categories: [],
  transactions: [],
};

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>(initialResults);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (query.trim().length < 2) {
      setResults(initialResults);
      setErrorMessage(null);
      setOpen(false);
      return;
    }

    setLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Gagal memproses pencarian");
        }

        setResults({
          products: Array.isArray(data.products) ? data.products : [],
          categories: Array.isArray(data.categories) ? data.categories : [],
          transactions: Array.isArray(data.transactions) ? data.transactions : [],
        });
        setErrorMessage(null);
        setOpen(true);
      } catch (error) {
        console.error("Failed to search:", error);
        setErrorMessage("Gagal mengambil hasil pencarian");
        setResults(initialResults);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  const hasResults =
    (results?.products?.length ?? 0) > 0 ||
    (results?.categories?.length ?? 0) > 0 ||
    (results?.transactions?.length ?? 0) > 0;

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari barang, kategori, atau transaksi..."
          className="w-full max-w-sm rounded-full border border-zinc-200 bg-white py-1.5 pl-10 pr-4 text-sm text-zinc-700 focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
        />
      </div>

      {open && (
        <div className="absolute left-0 right-0 z-30 mt-2 max-h-80 overflow-auto rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
          {loading && (
            <div className="px-4 py-3 text-sm text-zinc-500">Mencari...</div>
          )}

          {!loading && errorMessage && (
            <div className="px-4 py-3 text-sm text-red-500">{errorMessage}</div>
          )}

          {!loading && !errorMessage && !hasResults && (
            <div className="px-4 py-3 text-sm text-zinc-500">Tidak ada hasil</div>
          )}

          {!loading && !errorMessage && results.products.length > 0 && (
            <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-900">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Barang</p>
              <div className="mt-2 space-y-2">
                {results.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/dashboard/products?highlight=${product.id}`}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-900"
                    onClick={() => setOpen(false)}
                  >
                    <Package className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-zinc-500">SKU: {product.sku}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!loading && !errorMessage && results.categories.length > 0 && (
            <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-900">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Kategori</p>
              <div className="mt-2 space-y-2">
                {results.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/dashboard/categories?highlight=${category.id}`}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-900"
                    onClick={() => setOpen(false)}
                  >
                    <FolderTree className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-zinc-500">Kategori barang</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!loading && !errorMessage && results.transactions.length > 0 && (
            <div className="px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Transaksi</p>
              <div className="mt-2 space-y-2">
                {results.transactions.map((transaction) => (
                  <Link
                    key={transaction.id}
                    href={`/dashboard/transactions?highlight=${transaction.id}`}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-900"
                    onClick={() => setOpen(false)}
                  >
                    <ArrowDownUp className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium">
                        {transaction.reference || "Transaksi tanpa referensi"}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {transaction.type} •{" "}
                        {new Date(transaction.createdAt).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

