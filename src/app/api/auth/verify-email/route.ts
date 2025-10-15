import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { message: "Email and verification code are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Check if already verified using Boolean
    if (user.status === "ACTIVE" && user.emailVerified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 400 }
      );
    }

    // Check if code matches
    if (user.emailVerificationCode !== code) {
      return NextResponse.json(
        { message: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Check if code is expired
    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      return NextResponse.json(
        { message: "Verification code has expired" },
        { status: 400 }
      );
    }

    // ✅ Update user with Boolean emailVerified and set emailVerifiedDate
    await prisma.user.update({
      where: { email },
      data: {
        status: "ACTIVE",
        emailVerified: true, // ✅ Boolean
        emailVerifiedDate: new Date(), // ✅ Store verification date
        emailVerificationCode: null,
        emailVerificationExpires: null,
      },
    });

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name || "User");

    return NextResponse.json(
      {
        message: "Email verified successfully!",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { message: "Failed to verify email" },
      { status: 500 }
    );
  }
}