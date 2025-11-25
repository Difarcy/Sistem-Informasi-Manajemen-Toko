"use client";

/**
 * Sidebar Header Component
 * 
 * Displays the application logo and name at the top of the sidebar.
 */

import Link from "next/link";
import { Store } from "lucide-react";

export function SidebarHeader() {
  return (
    <Link
      href="/"
      className="flex h-16 items-center gap-2 border-b border-zinc-200 px-6 text-lg font-semibold transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900"
    >
      <Store className="h-5 w-5" />
      <span>Store Manager</span>
    </Link>
  );
}

