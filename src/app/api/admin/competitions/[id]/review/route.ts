// src/app/api/admin/competitions/[id]/review/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
  action: z.enum(["ACCEPT", "REJECT"]),
  rejectionReason: z.string().optional(),
});

export async function POST(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ 
        message: "Unauthorized. Admin access required." 
      }, { status: 401 });
    }

    const { id } = await params;
    const competitionId = parseInt(id);
    if (isNaN(competitionId)) {
      return NextResponse.json({ 
        message: "Invalid competition ID format" 
      }, { status: 400 });
    }

    const existingCompetition = await prisma.competition.findUnique({ 
      where: { id: competitionId },
      include: {
        submittedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    if (!existingCompetition) {
      return NextResponse.json({ 
        message: "Competition not found" 
      }, { status: 404 });
    }

    if (existingCompetition.status !== 'SUBMITTED') {
      return NextResponse.json({ 
        message: "Competition is not in submitted status" 
      }, { status: 400 });
    }

    const body = await request.json();
    const validationResult = reviewSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors
      }, { status: 400 });
    }

    const { action, rejectionReason } = validationResult.data;

    if (action === 'REJECT' && !rejectionReason?.trim()) {
      return NextResponse.json({ 
        message: "Rejection reason is required when rejecting a competition" 
      }, { status: 400 });
    }

    const newStatus = action === "ACCEPT" ? "ACCEPTED" : "REJECTED";
    const reviewedBy = parseInt(session.user.id);

    const updatedCompetition = await prisma.competition.update({
      where: { id: competitionId },
      data: {
        status: newStatus,
        reviewedById: reviewedBy,
        reviewedAt: new Date(),
        rejectionReason: action === 'REJECT' ? rejectionReason : null,
      },
      include: {
        submittedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            role: true,
          }
        },
        _count: {
          select: {
            participants: true,
            awards: true,
          }
        }
      }
    });

    // Notify the submitter about the review result
    await prisma.notification.create({
      data: {
        userId: existingCompetition.submittedById,
        type: action === 'ACCEPT' ? "COMPETITION_ACCEPTED" : "COMPETITION_REJECTED",
        title: `Competition ${action.toLowerCase()}ed`,
        message: action === 'ACCEPT' 
          ? `Your competition "${existingCompetition.name}" has been approved!`
          : `Your competition "${existingCompetition.name}" was rejected. Reason: ${rejectionReason}`,
        relatedId: competitionId,
      }
    });

    return NextResponse.json({ 
      competition: updatedCompetition,
      message: `Competition ${action.toLowerCase()}ed successfully`
    }, { status: 200 });

  } catch (error) {
    console.error("Error reviewing competition:", error);
    return NextResponse.json({ 
      message: "Failed to review competition" 
    }, { status: 500 });
  }
}