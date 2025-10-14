// Update: src/app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// ✅ Fix: Remove .nullable() from username since it's required in Prisma
const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional().nullable(),
  email: z.string().email().min(1).optional(),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/)
    .transform((val) => val.toLowerCase()) // ✅ Auto-convert to lowercase
    .optional(), // ✅ Removed .nullable()
  role: z.enum(["USER", "ADMIN", "MODERATOR"]).optional(),
  status: z.enum(["INACTIVE", "ACTIVE", "BANNED"]).optional(),
});

// GET: Fetch single user
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, 
        name: true, 
        email: true, 
        username: true,
        role: true, 
        status: true, 
        createdAt: true, 
        updatedAt: true, 
        reviewedBy: true,
      }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user, message: "User fetched successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PUT: Update user
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const validationResult = updateUserSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors
      }, { status: 400 });
    }

    const updateData = validationResult.data;

    // Check email uniqueness
    if (updateData.email && updateData.email !== existingUser.email) {
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email: updateData.email }
      });
      if (existingUserByEmail) {
        return NextResponse.json({ 
          message: "Email is already taken. Please use a different email."
        }, { status: 409 });
      }
    }

    // Check username uniqueness (case-insensitive)
    if (updateData.username && updateData.username !== existingUser.username) {
      const existingUserByUsername = await prisma.user.findFirst({
        where: {
          username: {
            equals: updateData.username.toLowerCase(),
            mode: 'insensitive',
          },
        },
      });
      if (existingUserByUsername) {
        return NextResponse.json({ 
          message: "Username is already taken. Please choose a different one."
        }, { status: 409 });
      }
    }

    // ✅ Fix: Filter out undefined values to avoid Prisma type errors
    const dataToUpdate: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (updateData.name !== undefined) dataToUpdate.name = updateData.name;
    if (updateData.email !== undefined) dataToUpdate.email = updateData.email;
    if (updateData.username !== undefined) dataToUpdate.username = updateData.username;
    if (updateData.role !== undefined) dataToUpdate.role = updateData.role;
    if (updateData.status !== undefined) dataToUpdate.status = updateData.status;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
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
        emailVerificationToken: true,
        emailVerificationExpires: true,
        pendingEmail: true,
        pendingEmailToken: true,
        pendingEmailExpires: true,
        // password is excluded by not selecting it
      }
    });

    return NextResponse.json({ 
      user: updatedUser,
      message: "User updated successfully" 
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE: Delete user
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ 
        message: "Unauthorized. Admin access required to delete users." 
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

    if (session.user.id === userId.toString()) {
      return NextResponse.json({ 
        message: "You cannot delete your own account" 
      }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}