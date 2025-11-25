import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderTree, Plus } from "lucide-react";
import { getAllCategories } from "@/lib/db/categories";
import { CategoriesTable } from "./categories-table";
import { CategoryDialog } from "./category-dialog";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kategori</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Kelola kategori barang
          </p>
        </div>
        <CategoryDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Kategori
          </Button>
        </CategoryDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kategori</CardTitle>
          <CardDescription>
            Semua kategori yang terdaftar dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderTree className="h-12 w-12 text-zinc-400" />
              <p className="mt-4 text-sm text-zinc-500">
                Belum ada kategori. Mulai dengan menambahkan kategori baru.
              </p>
            </div>
          ) : (
            <CategoriesTable categories={categories} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
