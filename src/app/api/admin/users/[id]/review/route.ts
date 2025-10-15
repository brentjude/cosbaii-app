// Update: src/app/api/admin/users/[id]/review/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
  action: z.string().refine(
    (val) => val === "APPROVE" || val === "BAN",
    {
      message: "Action must be either APPROVE or BAN"
    }
  )
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ 
        message: "Unauthorized. Admin or Moderator access required." 
      }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID format" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const validationResult = reviewSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors
      }, { status: 400 });
    }

    const { action } = validationResult.data;
    const newStatus = action === "APPROVE" ? "ACTIVE" : "BANNED";
    const reviewedBy = session.user.name || session.user.email || "Admin";

    // ✅ Solution 1: Exclude password in the select query
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status: newStatus,
        reviewedBy,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        image: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        reviewedBy: true,
        isPremiumUser: true,
        emailVerified: true,
        // password is excluded by not selecting it
      }
    });

    return NextResponse.json({ 
      user: updatedUser,
      message: `User ${action.toLowerCase()}ed successfully`
    }, { status: 200 });

  } catch (error) {
    console.error("Error reviewing user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}