// Create: src/app/api/user/check-username/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        { available: false, message: "Username is required" },
        { status: 400 }
      );
    }

    // Convert to lowercase for checking
    const lowercaseUsername = username.toLowerCase().trim();

    // Check if username exists (case-insensitive)
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: lowercaseUsername,
          mode: 'insensitive', // Case-insensitive search
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { available: false, message: "Username is already taken" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { available: true, message: "Username is available" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      { available: false, message: "Error checking username" },
      { status: 500 }
    );
  }
}