import type { Prisma } from "@prisma/client";
import type { TransactionFormProduct, TransactionRow, Transaction } from "@/types";

type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

type TransactionWithItems = Prisma.TransactionGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

export function serializeProductsForTransaction(products: ProductWithCategory[]): TransactionFormProduct[] {
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    unit: product.unit,
    price: Number(product.price),
    stock: product.stock,
  }));
}

export function serializeTransactionRows(transactions: TransactionWithItems[]): TransactionRow[] {
  return transactions.map((transaction) => ({
    id: transaction.id,
    type: transaction.type,
    reference: transaction.reference ?? null,
    notes: transaction.notes ?? null,
    totalAmount: Number(transaction.totalAmount),
    createdAt: transaction.createdAt.toISOString(),
    items: transaction.items.map((item) => ({
      id: item.id,
      productName: item.product.name,
      quantity: item.quantity,
      unit: item.product.unit,
      price: Number(item.price),
      subtotal: Number(item.subtotal),
    })),
  }));
}

export function serializeReportTransactions(transactions: Transaction[]): TransactionRow[] {
  return transactions.map((transaction) => ({
    id: transaction.id,
    type: transaction.type,
    reference: transaction.reference ?? null,
    notes: transaction.notes ?? null,
    totalAmount: Number(transaction.totalAmount),
    createdAt: transaction.createdAt.toISOString(),
    items: transaction.items.map((item) => ({
      id: item.id,
      productName: item.product.name,
      quantity: item.quantity,
      unit: item.product.unit,
      price: Number(item.price),
      subtotal: Number(item.subtotal),
    })),
  }));
}


