/**
 * Dashboard Statistics Helper Functions
 * 
 * Functions to get statistics and data for dashboard widgets
 */

import { prisma } from "./connection";
import { getDailyTransactions, getMonthlyTransactions } from "./transactions";

/**
 * Get today's financial statistics
 */
export async function getTodayFinancialStats() {
  const today = new Date();
  const transactions = await getDailyTransactions(today);

  const totalMasuk = transactions
    .filter((t) => t.type === "MASUK")
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  const totalKeluar = transactions
    .filter((t) => t.type === "KELUAR")
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  return {
    totalMasuk,
    totalKeluar,
    netIncome: totalKeluar - totalMasuk,
    transactionCount: transactions.length,
  };
}

/**
 * Get recent transactions (last 5)
 */
export async function getRecentTransactions(limit = 5) {
  const transactions = await prisma.transaction.findMany({
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        take: 1,
        include: {
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return transactions.map((t) => ({
    id: t.id,
    type: t.type,
    reference: t.reference,
    totalAmount: Number(t.totalAmount),
    createdAt: t.createdAt,
    itemCount: t.items.length,
    firstProduct: t.items[0]?.product.name || "Multiple items",
  }));
}

/**
 * Get top selling products (by transaction quantity)
 */
export async function getTopSellingProducts(limit = 5) {
  const transactions = await prisma.transaction.findMany({
    where: {
      type: "KELUAR", // Only count outgoing transactions (sales)
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Aggregate product quantities
  const productMap = new Map<
    number,
    {
      id: number;
      name: string;
      sku: string;
      category: string;
      totalQuantity: number;
      totalRevenue: number;
    }
  >();

  transactions.forEach((transaction) => {
    transaction.items.forEach((item) => {
      const product = item.product;
      const existing = productMap.get(product.id);

      if (existing) {
        existing.totalQuantity += item.quantity;
        existing.totalRevenue += Number(item.subtotal);
      } else {
        productMap.set(product.id, {
          id: product.id,
          name: product.name,
          sku: product.sku,
          category: product.category?.name || "Tanpa Kategori",
          totalQuantity: item.quantity,
          totalRevenue: Number(item.subtotal),
        });
      }
    });
  });

  return Array.from(productMap.values())
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, limit);
}

/**
 * Get monthly statistics
 */
export async function getMonthlyStats() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const transactions = await getMonthlyTransactions(year, month);

  const totalMasuk = transactions
    .filter((t) => t.type === "MASUK")
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  const totalKeluar = transactions
    .filter((t) => t.type === "KELUAR")
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  return {
    month,
    year,
    totalMasuk,
    totalKeluar,
    netIncome: totalKeluar - totalMasuk,
    transactionCount: transactions.length,
  };
}

/**
 * Get out of stock products
 */
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

