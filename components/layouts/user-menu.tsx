"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, KeyRound, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  name: string;
  email?: string;
  showEmail?: boolean;
  compact?: boolean;
  logoutRedirect?: "landing" | "login"; // Add prop to control logout redirect
}

export function UserMenu({ name, email, showEmail = true, compact = false, logoutRedirect = "login" }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={containerRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className={cn(
          "flex items-center rounded-full border border-zinc-200 bg-white text-left shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700",
          compact ? "gap-0 p-1" : "gap-3 p-1 pr-3"
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          {initials || "SM"}
        </div>
        {!compact && (
          <div className="hidden min-w-[140px] text-sm leading-tight lg:block">
            <p className="font-semibold text-zinc-900 dark:text-white">{name}</p>
            {showEmail && email && <p className="text-xs text-zinc-500 dark:text-zinc-400">{email}</p>}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[100] mt-2 w-56 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
          <div className="p-1">
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
              onClick={() => setOpen(false)}
            >
              <User className="h-4 w-4" />
              Profil
            </Link>
            <Link
              href="/dashboard/change-password"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
              onClick={() => setOpen(false)}
            >
              <KeyRound className="h-4 w-4" />
              Ganti Password
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
              onClick={() => setOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Pengaturan
            </Link>
            <button
              type="button"
              onClick={async () => {
                setOpen(false);
                setIsLoggingOut(true);
                
                try {
                  // Call logout API
                  const response = await fetch(`/logout?redirect=${logoutRedirect === "landing" ? "landing" : "login"}`, {
                    method: "GET",
                  });
                  
                  // Refresh the router to update server components
                  router.refresh();
                  
                  // Navigate to the redirect destination
                  if (logoutRedirect === "landing") {
                    router.push("/");
                  } else {
                    router.push("/auth/login");
                  }
                } catch (error) {
                  console.error("Logout error:", error);
                  // Fallback: just navigate
                  router.refresh();
                  if (logoutRedirect === "landing") {
                    router.push("/");
                  } else {
                    router.push("/auth/login");
                  }
                } finally {
                  setIsLoggingOut(false);
                }
              }}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Keluar..." : "Keluar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

