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

// ✅ List of admin emails
const ADMIN_EMAILS = [
  "cosbaii.cebu@gmail.com",
  // Add more admin emails here if needed
];

// ✅ Check if email should be an admin
function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
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

    // ✅ Determine role and status based on email
    const isAdmin = isAdminEmail(validatedData.email);
    const userRole = isAdmin ? "ADMIN" : "USER";
    const userStatus = isAdmin ? "ACTIVE" : "INACTIVE"; // Admins are auto-activated

    // Create user with appropriate role and status
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.fullname,
        username: validatedData.username.toLowerCase(),
        password: hashedPassword,
        role: userRole, // ✅ Set role based on email
        status: userStatus, // ✅ Admins are ACTIVE, regular users are INACTIVE
        emailVerified: isAdmin, // ✅ Admins are pre-verified
        emailVerifiedDate: isAdmin ? new Date() : null, // ✅ Set verification date for admins
        emailVerificationCode: isAdmin ? null : verificationCode, // ✅ No code needed for admins
        emailVerificationExpires: isAdmin ? null : verificationExpires,
        reviewedBy: isAdmin ? "auto-admin" : null, // ✅ Mark as auto-approved for admins
        profile: {
          create: {
            displayName: validatedData.fullname,
            receiveEmailUpdates: validatedData.emailUpdates || false,
          },
        },
      },
    });

    // ✅ Send verification code email only for non-admin users
    if (!isAdmin) {
      await sendVerificationCode(
        user.email,
        user.name || "User",
        verificationCode
      );

      return NextResponse.json(
        {
          message:
            "Account created successfully. Please check your email for verification code.",
          userId: user.id,
          email: user.email,
        },
        { status: 201 }
      );
    }

    // ✅ Admin users get a different response
    return NextResponse.json(
      {
        message:
          "Admin account created successfully. You can login immediately.",
        userId: user.id,
        email: user.email,
        role: "ADMIN",
        isAdmin: true,
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