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
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const params = await props.params;
    const competitionId = parseInt(params.id);

    if (isNaN(competitionId)) {
      return NextResponse.json(
        { error: "Invalid competition ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validationResult = reviewSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { action, rejectionReason } = validationResult.data;

    // Validate rejection reason if action is REJECT
    if (action === "REJECT" && !rejectionReason?.trim()) {
      return NextResponse.json(
        { error: "Rejection reason is required when rejecting a competition" },
        { status: 400 }
      );
    }

    // Check if competition exists
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
      include: {
        submittedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!competition) {
      return NextResponse.json(
        { error: "Competition not found" },
        { status: 404 }
      );
    }

    if (competition.status !== "SUBMITTED") {
      return NextResponse.json(
        { error: `Competition is already ${competition.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    const userId =
      typeof session.user.id === "string"
        ? parseInt(session.user.id)
        : (session.user.id as number);

    // Update competition status
    const updatedCompetition = await prisma.competition.update({
      where: { id: competitionId },
      data: {
        status: action === "ACCEPT" ? "ACCEPTED" : "REJECTED",
        reviewedById: userId,
        reviewedAt: new Date(),
        rejectionReason: action === "REJECT" ? rejectionReason : null,
      },
      include: {
        submittedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            role: true,
          },
        },
        _count: {
          select: {
            participants: true,
            awards: true,
          },
        },
      },
    });

    // Create notification for the submitter
    await prisma.notification.create({
      data: {
        userId: competition.submittedBy.id,
        type:
          action === "ACCEPT"
            ? "COMPETITION_ACCEPTED"
            : "COMPETITION_REJECTED",
        title:
          action === "ACCEPT"
            ? "Competition Accepted"
            : "Competition Rejected",
        message:
          action === "ACCEPT"
            ? `Your competition "${competition.name}" has been accepted and is now live!`
            : `Your competition "${competition.name}" was rejected. Reason: ${rejectionReason}`,
        relatedId: competitionId,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Competition ${action.toLowerCase()}ed successfully`,
      competition: updatedCompetition,
    });
  } catch (error) {
    console.error("Error reviewing competition:", error);
    return NextResponse.json(
      { error: "Failed to review competition" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";