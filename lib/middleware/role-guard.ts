/**
 * Role Guard Utilities
 * 
 * Helper functions for role-based access control in middleware and API routes.
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { UserRole } from "@/lib/config/navigation";
import { isRouteAccessible } from "@/lib/config/navigation";

/**
 * Parse session from cookie (for middleware)
 */
export function parseSessionFromCookie(request: NextRequest): {
  role: UserRole;
  userId?: number;
} | null {
  const sessionCookie = request.cookies.get("session");

  if (!sessionCookie) {
    return null;
  }

  try {
    const sessionData = JSON.parse(sessionCookie.value);
    return {
      role: sessionData.role || "user",
      userId: sessionData.userId,
    };
  } catch {
    return null;
  }
}

/**
 * Check if user has required role
 */
export function hasRole(
  userRole: UserRole | undefined,
  requiredRole: UserRole | UserRole[]
): boolean {
  if (!userRole) return false;

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }

  // Administrator has access to everything
  if (userRole === "administrator") {
    return true;
  }

  return userRole === requiredRole;
}

/**
 * Create unauthorized response
 */
export function createUnauthorizedResponse(
  request: NextRequest,
  message = "Unauthorized"
): NextResponse {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Create forbidden response
 */
export function createForbiddenResponse(
  request: NextRequest,
  message = "Forbidden: Insufficient permissions"
): NextResponse {
  return NextResponse.json({ error: message }, { status: 403 });
}

/**
 * Check route access and redirect if needed
 */
export function checkRouteAccess(
  request: NextRequest,
  pathname: string
): NextResponse | null {
  const session = parseSessionFromCookie(request);

  if (!session) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if route is accessible for user's role
  if (!isRouteAccessible(pathname, session.role)) {
    // Redirect to dashboard if user doesn't have access
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return null; // Access granted
}

