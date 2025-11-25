/**
 * Dashboard Layout Component
 * 
 * Main layout wrapper for dashboard pages.
 * Handles session retrieval and role-based sidebar rendering.
 * 
 * This component works with custom session (not next-auth).
 * For next-auth version, see DashboardLayoutWithNextAuth.tsx
 */

import type { ReactNode } from "react";
import { getSession } from "@/lib/auth/auth";
import Sidebar from "@/components/layouts/sidebar";
import { UserMenu } from "@/components/layouts/user-menu";
import { GlobalSearch } from "@/components/dashboard/global-search";

interface DashboardLayoutProps {
  children: ReactNode;
}

export async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Get session from custom auth system
  const session = await getSession();

  // Determine user role, default to "user" if not found
  const userRole =
    session?.role === "administrator" || session?.role === "user"
      ? session.role
      : "user";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar role={userRole} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-900">
        <div className="space-y-6 pb-6">
          {/* Header */}
          <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-5 py-2">
              <div className="flex flex-1 flex-wrap items-center gap-3 text-sm">
                <div className="min-w-[100px]">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-blue-500">
                    Store
                  </p>
                  <h1 className="text-base font-semibold text-zinc-900 dark:text-white">
                    Panel Kontrol
                  </h1>
                </div>
                <div className="w-full max-w-sm">
                  <GlobalSearch />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden text-sm font-medium text-zinc-700 dark:text-zinc-200 md:block">
                  {session?.name ?? "User"}
                </div>
                <div className="scale-90">
                  <UserMenu
                    name={session?.name ?? "User"}
                    showEmail={false}
                    compact
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="mx-auto max-w-6xl px-6">{children}</div>
        </div>
      </main>
    </div>
  );
}

