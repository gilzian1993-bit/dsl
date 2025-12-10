import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { dsl_admin } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(dsl_admin)
      .where(eq(dsl_admin.email, email))
      .limit(1);

    if (existingAdmin.length > 0) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const [newAdmin] = await db
      .insert(dsl_admin)
      .values({
        name,
        email,
        password: hashedPassword,
        role: "admin",
      })
      .returning();

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = newAdmin;

    return NextResponse.json(
      {
        success: true,
        message: "Admin created successfully",
        admin: adminWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

