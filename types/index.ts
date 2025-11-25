// Type definitions untuk aplikasi

export type TransactionType = "MASUK" | "KELUAR";

export interface Category {
  id: number;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string | null;
  categoryId: number;
  category: Category;
  price: number;
  stock: number;
  minStock: number;
  unit: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: number;
  type: TransactionType;
  reference?: string | null;
  notes?: string | null;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  items: TransactionItem[];
}

export interface TransactionItem {
  id: number;
  transactionId: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
  createdAt: Date;
}

export interface StockReport {
  productId: number;
  productName: string;
  categoryName: string;
  currentStock: number;
  minStock: number;
  unit: string;
  status: "AMAN" | "HABIS" | "MINIM";
}

export interface DailyReport {
  date: Date;
  totalMasuk: number;
  totalKeluar: number;
  totalTransactions: number;
  transactions: Transaction[];
}

export interface MonthlyReport {
  month: number;
  year: number;
  totalMasuk: number;
  totalKeluar: number;
  totalTransactions: number;
  topProducts: {
    productId: number;
    productName: string;
    totalQuantity: number;
  }[];
}

