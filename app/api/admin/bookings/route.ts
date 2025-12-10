import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { desc, sql, or, ilike } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const offset = (page - 1) * limit;

    // Build where condition
    let whereCondition = undefined;
    if (search) {
      const searchPattern = `%${search}%`;
      whereCondition = or(
        ilike(bookings.name, searchPattern),
        ilike(bookings.email, searchPattern),
        ilike(bookings.from_location, searchPattern),
        ilike(bookings.to_location, searchPattern)
      );
    }

    // Get total count with search filter
    const totalCountResult = whereCondition
      ? await db
          .select({ count: sql<number>`count(*)` })
          .from(bookings)
          .where(whereCondition)
      : await db.select({ count: sql<number>`count(*)` }).from(bookings);
    const totalCount = Number(totalCountResult[0]?.count || 0);

    // Get bookings with pagination and search
    const query = db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.created_at))
      .limit(limit)
      .offset(offset);

    const allBookings = whereCondition
      ? await query.where(whereCondition)
      : await query;

    return NextResponse.json({
      bookings: allBookings,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

