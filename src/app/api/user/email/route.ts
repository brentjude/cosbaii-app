// Update: src/app/api/user/email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcryptjs from "bcryptjs";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newEmail, password } = await request.json();
    const userId = parseInt(session.user.id);

    // Validate input
    if (!newEmail || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "User not found or no password set" },
        { status: 404 }
      );
    }

    // Verify current password
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Check if new email is different from current
    if (user.email === newEmail) {
      return NextResponse.json(
        { error: "New email must be different from current email" },
        { status: 400 }
      );
    }

    // Check if email is already in use by another user
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail }
    });

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json(
        { error: "This email address is already in use" },
        { status: 400 }
      );
    }

    // ✅ Update email directly (without verification for now)
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
        // Only update emailVerified if the field exists in your schema
        // emailVerified: new Date(), // Comment this out for now
      }
    });

    return NextResponse.json({ 
      success: true,
      message: "Email updated successfully!"
    });

  } catch (error) {
    console.error("Error changing email:", error);
    return NextResponse.json(
      { error: "Failed to change email address" },
      { status: 500 }
    );
  }
}