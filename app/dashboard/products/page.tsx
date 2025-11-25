import { getAllProducts } from "@/lib/db/products";
import { getAllCategories } from "@/lib/db/categories";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductsTable } from "./products-table";
import { ProductDialog } from "./product-dialog";

function serializeProducts(products: Awaited<ReturnType<typeof getAllProducts>>) {
  return products.map((product) => ({
    ...product,
    price: Number(product.price),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
        }
      : null,
  }));
}

export default async function ProductsPage() {
  const [productData, categories] = await Promise.all([getAllProducts(), getAllCategories()]);
  const products = serializeProducts(productData);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Barang</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Kelola data barang dan stok</p>
        </div>
        <ProductDialog categories={categories}>
          <Button type="button">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Barang
          </Button>
        </ProductDialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ProductsTable products={products} categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}

