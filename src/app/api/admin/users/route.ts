import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { hash } from "bcrypt";
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(1).max(100).optional().nullable(),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  role: z.enum(["USER", "ADMIN", "MODERATOR"]).default("USER"),
  status: z.enum(["ACTIVE", "INACTIVE", "BANNED"]).default("INACTIVE"),
});

type UserWhereClause = {
  status?: "INACTIVE" | "ACTIVE" | "BANNED";
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ 
        error: "Unauthorized. Admin or Moderator access required." 
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const whereClause: UserWhereClause = {};
    if (status && status !== "ALL" && ["INACTIVE", "ACTIVE", "BANNED"].includes(status)) {
      whereClause.status = status as "INACTIVE" | "ACTIVE" | "BANNED";
    }

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

    // ✅ Normalize reviewedBy to ensure it's never undefined
    const normalizedUsers = users.map(user => ({
      ...user,
      reviewedBy: user.reviewedBy ?? null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));

    const stats = {
      total: await prisma.user.count(),
      active: await prisma.user.count({ where: { status: "ACTIVE" } }),
      inactive: await prisma.user.count({ where: { status: "INACTIVE" } }),
      banned: await prisma.user.count({ where: { status: "BANNED" } }),
    };

    return NextResponse.json({ 
      users: normalizedUsers,
      stats,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({
      error: "Failed to fetch users",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ 
        error: "Unauthorized. Admin access required." 
      }, { status: 401 });
    }

    const body = await request.json();

    const validationResult = createUserSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0] || "Validation failed";
      
      return NextResponse.json({
        error: firstError,
        errors: errors
      }, { status: 400 });
    }

    const { name, email, username, password, role, status } = validationResult.data;

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUserByEmail) {
      return NextResponse.json({ 
        error: "Email is already taken." 
      }, { status: 409 });
    }

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
        error: "Username is already taken." 
      }, { status: 409 });
    }

    const hashedPassword = await hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        username,
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

    // ✅ Normalize the response
    return NextResponse.json({
      user: {
        ...newUser,
        reviewedBy: newUser.reviewedBy ?? null,
        createdAt: newUser.createdAt.toISOString(),
        updatedAt: newUser.updatedAt.toISOString(),
      },
      message: "User created successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("User creation error:", error);
    return NextResponse.json({
      error: "Failed to create user",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}