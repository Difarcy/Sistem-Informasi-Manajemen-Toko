"use client";

/**
 * Sidebar Navigation Component
 * 
 * Renders navigation items filtered by user role.
 * Automatically highlights the active route.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  navigationSections,
  filterNavigationByRole,
  type UserRole,
} from "@/lib/config/navigation";

interface SidebarNavProps {
  role: UserRole;
  currentPath: string;
}

export function SidebarNav({ role, currentPath }: SidebarNavProps) {
  // Filter navigation items based on role
  const filteredSections = filterNavigationByRole(navigationSections, role);

  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      {filteredSections.map((section) => (
        <div key={section.title}>
          {/* Section Title */}
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            {section.title}
          </p>

          {/* Section Items */}
          <div className="mt-2 space-y-1">
            {section.items.map((item) => {
              const isDashboardRoot = item.href === "/dashboard";
              const isActive =
                isDashboardRoot
                  ? currentPath === "/dashboard"
                  : currentPath === item.href ||
                    currentPath?.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white"
                    )}
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

