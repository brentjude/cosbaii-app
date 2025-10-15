import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      );
    }

    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        pendingEmailToken: token,
        pendingEmailExpires: {
          gte: new Date(),
        },
      },
    });

    if (!user || !user.pendingEmail) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Check if the new email is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { email: user.pendingEmail },
    });

    if (existingUser && existingUser.id !== user.id) {
      return NextResponse.json(
        { message: "This email is already in use" },
        { status: 400 }
      );
    }

    // ✅ Update user's email and verification status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.pendingEmail,
        emailVerified: true, // ✅ Set to boolean true
        emailVerifiedDate: new Date(), // ✅ Set the verification date
        pendingEmail: null,
        pendingEmailToken: null,
        pendingEmailExpires: null,
      },
    });

    return NextResponse.json(
      {
        message: "Email changed successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying email change:", error);
    return NextResponse.json(
      { message: "Failed to verify email change" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: {
        pendingEmail: true,
        pendingEmailExpires: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      hasPendingEmail: !!user.pendingEmail,
      pendingEmail: user.pendingEmail,
      expiresAt: user.pendingEmailExpires,
    });
  } catch (error) {
    console.error("Error fetching pending email:", error);
    return NextResponse.json(
      { message: "Failed to fetch pending email" },
      { status: 500 }
    );
  }
}