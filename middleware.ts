/**
 * Next.js Middleware
 * 
 * Handles authentication and role-based route protection.
 * 
 * Features:
 * - Public route whitelist
 * - Session validation
 * - Role-based access control
 * - Automatic redirects
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRouteAccess, parseSessionFromCookie } from "@/lib/middleware/role-guard";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/reset-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const accessCheck = checkRouteAccess(request, pathname);
    if (accessCheck) {
      return accessCheck; // Redirect or error response
    }
  }

  // Allow API routes to handle their own authentication
  // (API routes should use requireRole() helper)

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

