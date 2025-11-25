import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/connection";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({
      products: [],
      categories: [],
      transactions: [],
    });
  }

  try {
    const [products, categories, transactions] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { sku: { contains: query } },
          ],
        },
        select: {
          id: true,
          name: true,
          sku: true,
        },
        take: 5,
      }),
      prisma.category.findMany({
        where: {
          name: { contains: query },
        },
        select: {
          id: true,
          name: true,
        },
        take: 5,
      }),
      prisma.transaction.findMany({
        where: {
          OR: [
            { reference: { contains: query } },
            { notes: { contains: query } },
          ],
        },
        select: {
          id: true,
          reference: true,
          type: true,
          createdAt: true,
        },
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return NextResponse.json({
      products,
      categories,
      transactions,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat melakukan pencarian." },
      { status: 500 }
    );
  }
}

