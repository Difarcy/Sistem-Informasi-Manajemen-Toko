import { prisma } from "./connection";
import { getDailyTransactions, getMonthlyTransactions } from "./transactions";
import type { StockReport, DailyReport, MonthlyReport, Transaction } from "@/types";

function serializeTransaction(transaction: Awaited<ReturnType<typeof getDailyTransactions>>[number]): Transaction {
  return {
    ...transaction,
    totalAmount: Number(transaction.totalAmount),
    reference: transaction.reference ?? null,
    notes: transaction.notes ?? null,
    items: transaction.items.map((item) => ({
      ...item,
      price: Number(item.price),
      subtotal: Number(item.subtotal),
      product: {
        ...item.product,
        description: item.product.description ?? null,
        price: Number(item.product.price),
        createdAt: item.product.createdAt,
        updatedAt: item.product.updatedAt,
        category: {
          ...item.product.category,
          description: item.product.category.description ?? null,
        },
      },
    })),
  };
}

export async function getStockReport(): Promise<StockReport[]> {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return products.map((product) => {
    let status: "AMAN" | "HABIS" | "MINIM";
    if (product.stock === 0) {
      status = "HABIS";
    } else if (product.stock <= product.minStock) {
      status = "MINIM";
    } else {
      status = "AMAN";
    }

    return {
      productId: product.id,
      productName: product.name,
      categoryName: product.category.name,
      currentStock: product.stock,
      minStock: product.minStock,
      unit: product.unit,
      status,
    };
  });
}

export async function getDailyReport(date: Date): Promise<DailyReport> {
  const transactionsRaw = await getDailyTransactions(date);
  const transactions = transactionsRaw.map(serializeTransaction);

  const totalMasuk = transactions
    .filter((t) => t.type === "MASUK")
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  const totalKeluar = transactions
    .filter((t) => t.type === "KELUAR")
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  return {
    date,
    totalMasuk,
    totalKeluar,
    totalTransactions: transactions.length,
    transactions,
  };
}

export async function getMonthlyReport(year: number, month: number): Promise<MonthlyReport> {
  const transactionsRaw = await getMonthlyTransactions(year, month);
  const transactions = transactionsRaw.map(serializeTransaction);

  const totalMasuk = transactions
    .filter((t) => t.type === "MASUK")
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  const totalKeluar = transactions
    .filter((t) => t.type === "KELUAR")
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  // Calculate top products
  const productMap = new Map<number, { productId: number; productName: string; totalQuantity: number }>();

  transactions.forEach((transaction) => {
    transaction.items.forEach((item) => {
      const existing = productMap.get(item.productId);
      if (existing) {
        existing.totalQuantity += item.quantity;
      } else {
        productMap.set(item.productId, {
          productId: item.productId,
          productName: item.product.name,
          totalQuantity: item.quantity,
        });
      }
    });
  });

  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 10);

  return {
    month,
    year,
    totalMasuk,
    totalKeluar,
    totalTransactions: transactions.length,
    topProducts,
  };
}

