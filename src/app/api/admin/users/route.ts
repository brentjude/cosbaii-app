// Update: src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs"; // ✅ Import bcrypt at the top
import { Prisma } from "@/generated/prisma"; // ✅ Import Prisma types

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const reviewed = searchParams.get("reviewed");

    const skip = (page - 1) * limit;

    // ✅ Fixed: Use Prisma.UserWhereInput instead of any
    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status !== "all") {
      where.status = status.toUpperCase() as "ACTIVE" | "INACTIVE" | "BANNED";
    }

    if (reviewed === "true") {
      where.reviewed = true;
    } else if (reviewed === "false") {
      where.reviewed = false;
    }

    // ✅ Fetch users and stats in parallel
    const [users, total, activeCount, inactiveCount, bannedCount, reviewedCount, unreviewedCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          role: true,
          status: true,
          isPremiumUser: true,
          reviewed: true,
          createdAt: true,
          updatedAt: true,
          reviewedBy: true,
        },
      }),
      prisma.user.count({ where }),
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({ where: { status: "INACTIVE" } }),
      prisma.user.count({ where: { status: "BANNED" } }),
      prisma.user.count({ where: { reviewed: true } }),
      prisma.user.count({ where: { reviewed: false } }),
    ]);

    // ✅ Return proper response with stats
    return NextResponse.json({
      users,
      stats: {
        total,
        active: activeCount,
        inactive: inactiveCount,
        banned: bannedCount,
        reviewed: reviewedCount,
        unreviewed: unreviewedCount,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { 
        message: "Failed to fetch users",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// ✅ Add POST method for creating users
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, username, password, name, role, status, isPremiumUser, reviewed } = body;

    // Validate required fields
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Email, username, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 400 }
      );
    }

    // ✅ Fixed: Import bcrypt at the top instead of require
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name: name || null,
        role: role || "USER",
        status: status || "ACTIVE",
        isPremiumUser: isPremiumUser || false,
        reviewed: reviewed || false,
        reviewedBy: reviewed ? (session.user.username || session.user.email) : null,
      },
    });

    return NextResponse.json(
      { 
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          status: user.status,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { 
        error: "Failed to create user",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}