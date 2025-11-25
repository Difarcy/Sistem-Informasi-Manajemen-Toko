"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { CategoryDialog } from "./category-dialog";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import type { Category } from "@/types";
import { formatDate } from "@/lib/utils";

interface CategoriesTableProps {
  categories: Category[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Kategori</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="max-w-md truncate">
                {category.description || "-"}
              </TableCell>
              <TableCell>{formatDate(category.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <CategoryDialog category={category}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </CategoryDialog>
                  <DeleteCategoryDialog categoryId={category.id} categoryName={category.name}>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </DeleteCategoryDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

