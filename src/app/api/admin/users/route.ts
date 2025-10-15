// Update: src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { hash } from "bcrypt";
import { z } from "zod";

// ✅ Fix: Make username required and add lowercase transform
const createUserSchema = z.object({
  name: z.string().min(1).max(100).optional().nullable(),
  email: z.string().email().min(1),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .transform((val) => val.toLowerCase()), // ✅ Auto-convert to lowercase
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  role: z.enum(["USER", "ADMIN", "MODERATOR"]).default("USER"),
  status: z.enum(["ACTIVE", "INACTIVE", "BANNED"]).default("INACTIVE"),
});

// ✅ Add type for where clause
type UserWhereClause = {
  status?: "INACTIVE" | "ACTIVE" | "BANNED";
};

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ 
        message: "Unauthorized. Admin or Moderator access required." 
      }, { status: 401 });
    }

    // Get status filter
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // ✅ Build where clause with proper type
    const whereClause: UserWhereClause = {};
    if (status && status !== "ALL" && ["INACTIVE", "ACTIVE", "BANNED"].includes(status)) {
      whereClause.status = status as "INACTIVE" | "ACTIVE" | "BANNED";
    }

    // Fetch users
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        reviewedBy: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ 
      users,
      message: "Users fetched successfully" 
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ 
        message: "Unauthorized. Admin access required." 
      }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = createUserSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors
      }, { status: 400 });
    }

    const { name, email, username, password, role, status } = validationResult.data;

    // Check email uniqueness
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUserByEmail) {
      return NextResponse.json({ 
        message: "Email is already taken." 
      }, { status: 409 });
    }

    // ✅ Check username uniqueness (case-insensitive)
    const existingUserByUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username.toLowerCase(),
          mode: 'insensitive',
        },
      },
    });

    if (existingUserByUsername) {
      return NextResponse.json({ 
        message: "Username is already taken." 
      }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // ✅ Create user with required username
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        username, // ✅ Now required, already lowercase from transform
        password: hashedPassword,
        role,
        status,
        reviewedBy: status === "ACTIVE" ? (session.user.name || session.user.email || "Admin") : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        reviewedBy: true,
      }
    });

    return NextResponse.json({
      user: newUser,
      message: "User created successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("User creation error:", error);
    return NextResponse.json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}