// src/app/api/user/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const feedbackSchema = z.object({
  type: z.enum(["BUG", "FEATURE_REQUEST", "IMPROVEMENT"]),
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        success: false,
        message: "Unauthorized" 
      }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = feedbackSchema.parse(body);
    
    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return NextResponse.json({ 
        success: false,
        message: "Invalid user ID" 
      }, { status: 400 });
    }

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        userId,
        type: validatedData.type,
        title: validatedData.title,
        description: validatedData.description,
        status: "PENDING",
        priority: "NORMAL",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
          }
        }
      }
    });

    // Create notifications for all admin users
    const adminUsers = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true }
    });

    if (adminUsers.length > 0) {
      const notifications = adminUsers.map(admin => ({
        userId: admin.id,
        type: "FEEDBACK",
        title: `New ${validatedData.type.toLowerCase().replace('_', ' ')} feedback`,
        message: `${session.user.name || session.user.email} submitted: "${validatedData.title}"`,
        relatedId: feedback.id,
      }));

      await prisma.notification.createMany({
        data: notifications
      });
    }

    return NextResponse.json({
      success: true,
      feedback,
      message: "Feedback submitted successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating feedback:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false,
        message: "Validation failed",
        errors: error.issues
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false,
      message: "Failed to submit feedback" 
    }, { status: 500 });
  }
}

// GET: Fetch user's feedback (optional)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        success: false,
        message: "Unauthorized" 
      }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return NextResponse.json({ 
        success: false,
        message: "Invalid user ID" 
      }, { status: 400 });
    }

    const feedback = await prisma.feedback.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      feedback,
      message: "Feedback retrieved successfully"
    });

  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json({ 
      success: false,
      message: "Failed to fetch feedback" 
    }, { status: 500 });
  }
}