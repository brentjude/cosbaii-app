// Update: src/app/api/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const userSchema = z.object({
  fullname: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  username: z
    .string()
    .min(3, "Username is required")
    .transform((val) => val.toLowerCase().trim()), // ✅ Ensure lowercase
  password: z.string().min(8, "Password must be at least 8 characters"),
  emailUpdates: z.boolean().optional(),
  privacyConsent: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = userSchema.parse(body);

    // ✅ Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // ✅ Check if username exists (case-insensitive)
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: validatedData.username,
          mode: 'insensitive',
        },
      },
    });

    if (existingUsername) {
      return NextResponse.json(
        { message: "Username already taken" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // ✅ Create user with lowercase username
    await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.fullname,
        username: validatedData.username, // ✅ Already lowercase from transform
        password: hashedPassword,
        profile: {
          create: {
            displayName: validatedData.fullname,
            receiveEmailUpdates: validatedData.emailUpdates || false,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "User created successfully. Please check your email to verify your account." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    
    // ✅ Fix: Use proper Zod error handling
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: "Validation error", 
          errors: error.flatten().fieldErrors // ✅ Use flatten() method
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}