import { prisma } from "./connection";

export async function getAllProducts() {
  return await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getProductById(id: number) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
}

export async function getProductBySku(sku: string) {
  return await prisma.product.findUnique({
    where: { sku },
    include: {
      category: true,
    },
  });
}

export async function createProduct(data: {
  name: string;
  sku: string;
  description?: string;
  categoryId: number;
  price: number;
  stock?: number;
  minStock?: number;
  unit: string;
}) {
  return await prisma.product.create({
    data,
    include: {
      category: true,
    },
  });
}

export async function updateProduct(
  id: number,
  data: {
    name?: string;
    description?: string;
    categoryId?: number;
    price?: number;
    stock?: number;
    minStock?: number;
    unit?: string;
  }
) {
  return await prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });
}

export async function deleteProduct(id: number) {
  return await prisma.product.delete({
    where: { id },
  });
}

export async function updateProductStock(id: number, quantity: number, type: "MASUK" | "KELUAR") {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const newStock = type === "MASUK" ? product.stock + quantity : product.stock - quantity;

  if (newStock < 0) {
    throw new Error("Insufficient stock");
  }

  return await prisma.product.update({
    where: { id },
    data: { stock: newStock },
  });
}

export async function getLowStockProducts() {
  return await prisma.product.findMany({
    where: {
      stock: {
        lte: prisma.product.fields.minStock,
      },
    },
    include: {
      category: true,
    },
    orderBy: {
      stock: "asc",
    },
  });
}

export async function getOutOfStockProducts() {
  return await prisma.product.findMany({
    where: {
      stock: 0,
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

