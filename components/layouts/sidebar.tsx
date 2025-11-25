"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationSections, type UserRole } from "@/lib/config/navigation";

type SidebarProps = {
  role?: UserRole;
};

function Sidebar({ role = "user" }: SidebarProps) {
  const pathname = usePathname();

  // Debug: Log role and visible items (development only)
  if (process.env.NODE_ENV === "development") {
    const allAdminItems = navigationSections
      .flatMap((section) => section.items)
      .filter((item) => item.roles.includes("administrator"));
    console.log("[Sidebar] Role:", role);
    console.log("[Sidebar] Admin items count:", allAdminItems.length);
    console.log("[Sidebar] Admin items:", allAdminItems.map((i) => i.name));
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <Link
        href="/"
        className="flex h-16 items-center gap-2 border-b border-zinc-200 px-6 text-lg font-semibold transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900"
      >
        <Store className="h-5 w-5" />
        <span>Store Manager</span>
      </Link>

      <nav className="flex-1 space-y-6 px-3 py-4">
        {navigationSections.map((section) => {
          // Filter items based on role
          // item.roles is always defined (required in NavigationItem interface)
          const visibleItems = section.items.filter((item) => item.roles.includes(role));
          
          if (visibleItems.length === 0) {
            return null;
          }
          return (
            <div key={section.title}>
              <p className="px-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {section.title}
              </p>
              <div className="mt-2 space-y-1">
                {visibleItems.map((item) => {
                  const isDashboardRoot = item.href === "/dashboard";
                  const isActive = isDashboardRoot
                    ? pathname === "/dashboard"
                    : pathname === item.href || pathname?.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
