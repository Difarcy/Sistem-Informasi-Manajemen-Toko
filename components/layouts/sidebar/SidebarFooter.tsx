"use client";

/**
 * Sidebar Footer Component
 * 
 * Displays user information and optional actions at the bottom of the sidebar.
 */

import { UserRole } from "@/lib/config/navigation";
import { cn } from "@/lib/utils";

interface SidebarFooterProps {
  userName?: string;
  userEmail?: string;
  role: UserRole;
}

export function SidebarFooter({
  userName,
  userEmail,
  role,
}: SidebarFooterProps) {
  return (
    <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
      {userName && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-900 dark:text-white">
            {userName}
          </p>
          {userEmail && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {userEmail}
            </p>
          )}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                role === "administrator"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              )}
            >
              {role === "administrator" ? "Administrator" : "User"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

