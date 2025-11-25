import { prisma } from "./connection";
import type { TransactionType } from "@/types";
import { updateProductStock } from "./products";

export async function getAllTransactions() {
  return await prisma.transaction.findMany({
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getTransactionById(id: number) {
  return await prisma.transaction.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });
}

export async function createTransaction(data: {
  type: TransactionType;
  reference?: string;
  notes?: string;
  items: {
    productId: number;
    quantity: number;
    price: number;
  }[];
}) {
  // Calculate total amount
  const totalAmount = data.items.reduce(
    (sum, item) => sum + item.quantity * Number(item.price),
    0
  );

  // Create transaction with items
  const transaction = await prisma.transaction.create({
    data: {
      type: data.type,
      reference: data.reference,
      notes: data.notes,
      totalAmount,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.quantity * Number(item.price),
        })),
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  // Update product stocks
  for (const item of data.items) {
    await updateProductStock(item.productId, item.quantity, data.type);
  }

  return transaction;
}

export async function deleteTransaction(id: number) {
  // Get transaction first to reverse stock changes
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  // Reverse stock changes
  const reverseType = transaction.type === "MASUK" ? "KELUAR" : "MASUK";
  for (const item of transaction.items) {
    await updateProductStock(item.productId, item.quantity, reverseType);
  }

  // Delete transaction (cascade will delete items)
  return await prisma.transaction.delete({
    where: { id },
  });
}

export async function getTransactionsByDateRange(startDate: Date, endDate: Date) {
  return await prisma.transaction.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getDailyTransactions(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await getTransactionsByDateRange(startOfDay, endOfDay);
}

export async function getMonthlyTransactions(year: number, month: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  return await getTransactionsByDateRange(startDate, endDate);
}

