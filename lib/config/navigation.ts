/**
 * Navigation Configuration
 * 
 * Centralized configuration for sidebar navigation items.
 * This makes it easy to add, remove, or modify menu items.
 */

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowDownUp,
  BarChart3,
  FileText,
  Users,
  Settings,
} from "lucide-react";

export type UserRole = "administrator" | "user";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[]; // Roles that can access this menu
  badge?: string; // Optional badge (e.g., "New", "Beta")
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

/**
 * Navigation sections configuration
 * 
 * Each section groups related menu items together.
 * Items are filtered based on user role.
 */
export const navigationSections: NavigationSection[] = [
  {
    title: "Data Master",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["administrator", "user"],
      },
      {
        name: "Barang",
        href: "/dashboard/products",
        icon: Package,
        roles: ["administrator", "user"],
      },
      {
        name: "Kategori",
        href: "/dashboard/categories",
        icon: FolderTree,
        roles: ["administrator"], // Admin only
      },
    ],
  },
  {
    title: "Operasional",
    items: [
      {
        name: "Barang Masuk",
        href: "/dashboard/incoming",
        icon: ArrowDownCircle,
        roles: ["administrator"], // Admin only
      },
      {
        name: "Barang Keluar",
        href: "/dashboard/outgoing",
        icon: ArrowUpCircle,
        roles: ["administrator"], // Admin only
      },
      {
        name: "Transaksi",
        href: "/dashboard/transactions",
        icon: ArrowDownUp,
        roles: ["administrator", "user"],
      },
      {
        name: "Stok",
        href: "/dashboard/stock",
        icon: BarChart3,
        roles: ["administrator", "user"],
      },
    ],
  },
  {
    title: "Analitik & Akses",
    items: [
      {
        name: "Laporan",
        href: "/dashboard/reports",
        icon: FileText,
        roles: ["administrator"], // Admin only
      },
      {
        name: "Pengguna",
        href: "/dashboard/users",
        icon: Users,
        roles: ["administrator"], // Admin only
      },
      {
        name: "Pengaturan",
        href: "/dashboard/settings",
        icon: Settings,
        roles: ["administrator", "user"],
      },
    ],
  },
];

/**
 * Helper function to filter navigation items by role
 */
export function filterNavigationByRole(
  sections: NavigationSection[],
  role: UserRole
): NavigationSection[] {
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((section) => section.items.length > 0); // Remove empty sections
}

/**
 * Get all accessible routes for a specific role
 */
export function getAccessibleRoutes(role: UserRole): string[] {
  const routes: string[] = [];
  navigationSections.forEach((section) => {
    section.items.forEach((item) => {
      if (item.roles.includes(role)) {
        routes.push(item.href);
      }
    });
  });
  return routes;
}

/**
 * Check if a route is accessible for a specific role
 */
export function isRouteAccessible(route: string, role: UserRole): boolean {
  return getAccessibleRoutes(role).some(
    (accessibleRoute) =>
      route === accessibleRoute || route.startsWith(accessibleRoute + "/")
  );
}

