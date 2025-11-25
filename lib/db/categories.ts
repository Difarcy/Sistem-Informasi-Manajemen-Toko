import { prisma } from "./connection";

export async function getAllCategories() {
  return await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function getCategoryById(id: number) {
  return await prisma.category.findUnique({
    where: { id },
    include: {
      products: true,
    },
  });
}

export async function createCategory(data: {
  name: string;
  description?: string;
}) {
  return await prisma.category.create({
    data,
  });
}

export async function updateCategory(
  id: number,
  data: {
    name?: string;
    description?: string;
  }
) {
  return await prisma.category.update({
    where: { id },
    data,
  });
}

export async function deleteCategory(id: number) {
  return await prisma.category.delete({
    where: { id },
  });
}

