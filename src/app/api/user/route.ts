// src/app/api/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import { sendVerificationCode } from "@/lib/email";

const userSchema = z.object({
  fullname: z.string().min(2).max(50),
  email: z.string().email(),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  emailUpdates: z.boolean().optional(),
  termsAccepted: z.boolean(),
});

// ✅ Generate 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = userSchema.parse(body);

    // Check if email exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // Check if username exists
    const existingUsername = await prisma.user.findUnique({
      where: { username: validatedData.username.toLowerCase() },
    });

    if (existingUsername) {
      return NextResponse.json(
        { message: "Username already taken" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // ✅ Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user with INACTIVE status
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.fullname,
        username: validatedData.username.toLowerCase(),
        password: hashedPassword,
        status: "INACTIVE", // ✅ User starts as INACTIVE
        emailVerificationCode: verificationCode,
        emailVerificationExpires: verificationExpires,
        profile: {
          create: {
            displayName: validatedData.fullname,
            receiveEmailUpdates: validatedData.emailUpdates || false,
          },
        },
      },
    });

    // ✅ Send verification code email
    await sendVerificationCode(user.email, user.name || "User", verificationCode);

    return NextResponse.json(
      {
        message: "Account created successfully. Please check your email for verification code.",
        userId: user.id,
        email: user.email,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating user:", error);

    if (error instanceof z.ZodError) {
      const details = error.issues.map((i) => i.message).join("; ");
      return NextResponse.json(
        {
          message: details || "Validation failed",
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create account" },
      { status: 500 }
    );
  }
}