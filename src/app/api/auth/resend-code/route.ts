// src/app/api/auth/resend-code/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendVerificationCode } from "@/lib/email";

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (user.status === "ACTIVE" && user.emailVerified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 400 }
      );
    }

    // Generate new code
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new code
    await prisma.user.update({
      where: { email },
      data: {
        emailVerificationCode: verificationCode,
        emailVerificationExpires: verificationExpires,
      },
    });

    // Send new code
    await sendVerificationCode(user.email, user.name || "User", verificationCode);

    return NextResponse.json(
      {
        message: "Verification code resent successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resending code:", error);
    return NextResponse.json(
      { message: "Failed to resend verification code" },
      { status: 500 }
    );
  }
}