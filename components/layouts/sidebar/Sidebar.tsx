"use client";

/**
 * Sidebar Component
 * 
 * A role-based sidebar that automatically filters menu items
 * based on the user's role. Supports SSR and CSR.
 * 
 * Features:
 * - Role-based menu filtering
 * - Active route highlighting
 * - Loading state support
 * - Responsive design
 * - Dark mode support
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNav } from "./SidebarNav";
import { SidebarFooter } from "./SidebarFooter";
import type { UserRole } from "@/lib/config/navigation";

interface SidebarProps {
  role: UserRole;
  isLoading?: boolean;
  userName?: string;
  userEmail?: string;
}

export function Sidebar({
  role,
  isLoading = false,
  userName,
  userEmail,
}: SidebarProps) {
  const pathname = usePathname();

  // Show loading skeleton
  if (isLoading) {
    return (
      <aside className="flex h-full w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex h-16 items-center gap-2 border-b border-zinc-200 px-6 dark:border-zinc-800">
          <div className="h-5 w-5 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-5 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="flex-1 space-y-6 px-3 py-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-1">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-9 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <SidebarHeader />
      <SidebarNav role={role} currentPath={pathname} />
      <SidebarFooter userName={userName} userEmail={userEmail} role={role} />
    </aside>
  );
}

