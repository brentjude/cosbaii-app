// Create: src/app/api/auth/verify-email-change/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing verification token" }, { status: 400 });
  }

  try {
    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        pendingEmailToken: token,
        pendingEmailExpires: {
          gte: new Date()
        }
      }
    });

    if (!user || !user.pendingEmail) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Update user's email and clear pending fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.pendingEmail,
        emailVerified: new Date(),
        pendingEmail: null,
        pendingEmailToken: null,
        pendingEmailExpires: null,
      }
    });

    // Redirect to success page or settings
    return NextResponse.redirect(
      new URL("/settings?emailChanged=true", request.url)
    );

  } catch (error) {
    console.error("Error verifying email change:", error);
    return NextResponse.json(
      { error: "Failed to verify email change" },
      { status: 500 }
    );
  }
}