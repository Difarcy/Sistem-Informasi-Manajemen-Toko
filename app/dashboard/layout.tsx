import type { Metadata } from "next";
import Sidebar from "@/components/layouts/sidebar";
import { getSession } from "@/lib/auth/auth";
import { UserMenu } from "@/components/layouts/user-menu";

export const metadata: Metadata = {
  title: "Store Manager",
  description: "Dashboard Store Manager",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  // Ensure role is properly set, default to user if missing
  const userRole = (session?.role === "administrator" || session?.role === "user") 
    ? session.role 
    : "user";

  // Debug: Log role to console (remove in production)
  if (process.env.NODE_ENV === "development") {
    console.log("[Dashboard Layout] Session:", {
      userId: session?.userId,
      email: session?.email,
      name: session?.name,
      role: session?.role,
      roleType: typeof session?.role,
      roleValue: JSON.stringify(session?.role),
      userRole: userRole,
      userRoleType: typeof userRole,
      userRoleValue: JSON.stringify(userRole),
      isAdmin: session?.role === "administrator",
      isUser: session?.role === "user",
    });
    console.log("[Dashboard Layout] Passing to Sidebar - role:", userRole);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={userRole} />
      <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-900">
        <div className="space-y-6 pb-6">
          <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-blue-500">Store</p>
                  <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">Panel Kontrol</h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden text-sm font-medium text-zinc-700 dark:text-zinc-200 md:block">
                  {session?.name ?? "Administrator"}
                </div>
                <div className="scale-90">
                  <UserMenu
                    name={session?.name ?? "Administrator"}
                    showEmail={false}
                    compact
                  />
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-6xl px-6">{children}</div>
        </div>
      </main>
    </div>
  );
}

