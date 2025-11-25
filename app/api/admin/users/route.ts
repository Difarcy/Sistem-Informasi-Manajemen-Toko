/**
 * Protected API Route Example
 * 
 * This route demonstrates role-based API protection.
 * Only administrators can access this endpoint.
 * 
 * Usage:
 * GET /api/admin/users - Get all users (admin only)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession, requireAdministrator } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/connection";

/**
 * GET /api/admin/users
 * 
 * Get all users (administrator only)
 */
export async function GET(request: NextRequest) {
  try {
    // Check if user is administrator
    const roleCheck = await requireAdministrator();

    if (!roleCheck.success) {
      return NextResponse.json(
        { error: roleCheck.message },
        { status: 403 }
      );
    }

    // Fetch all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 * 
 * Create a new user (administrator only)
 */
export async function POST(request: NextRequest) {
  try {
    // Check if user is administrator
    const roleCheck = await requireAdministrator();

    if (!roleCheck.success) {
      return NextResponse.json(
        { error: roleCheck.message },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password, role } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create user (you should hash the password in production)
    // This is just an example
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // Should be hashed!
        role: role || "user",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        data: user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

