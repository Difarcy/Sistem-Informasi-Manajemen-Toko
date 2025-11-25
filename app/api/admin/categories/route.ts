/**
 * Protected API Route Example - Categories
 * 
 * This route demonstrates role-based API protection for categories.
 * Only administrators can create, update, or delete categories.
 * 
 * Usage:
 * GET /api/admin/categories - Get all categories (public)
 * POST /api/admin/categories - Create category (admin only)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdministrator } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/connection";

/**
 * GET /api/admin/categories
 * 
 * Get all categories (public access)
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/categories
 * 
 * Create a new category (administrator only)
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
    const { name, description } = body;

    // Validate input
    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existing = await prisma.category.findFirst({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 409 }
      );
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name,
        description: description || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        data: category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

