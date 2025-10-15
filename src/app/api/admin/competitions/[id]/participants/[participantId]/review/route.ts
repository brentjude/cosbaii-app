import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { PARTICIPANT_REVIEW_ACTIONS } from "@/types/competition";

// ✅ Use enum values from types
const participantReviewSchema = z.object({
  action: z.enum([
    PARTICIPANT_REVIEW_ACTIONS.APPROVE,
    PARTICIPANT_REVIEW_ACTIONS.REJECT,
  ]),
});

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string; participantId: string }> }
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
    const participantId = parseInt(params.participantId);

    if (isNaN(competitionId) || isNaN(participantId)) {
      return NextResponse.json(
        { error: "Invalid ID provided" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validationResult = participantReviewSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid action. Must be APPROVE or REJECT",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { action } = validationResult.data;

    // Check if participant exists and belongs to the competition
    const participant = await prisma.competitionParticipant.findFirst({
      where: {
        id: participantId,
        competitionId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        competition: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found in this competition" },
        { status: 404 }
      );
    }

    if (participant.status !== "PENDING") {
      return NextResponse.json(
        { error: `Participant already ${participant.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    // ✅ Use enum for status determination
    const newStatus =
      action === PARTICIPANT_REVIEW_ACTIONS.APPROVE ? "APPROVED" : "REJECTED";

    const updatedParticipant = await prisma.competitionParticipant.update({
      where: { id: participantId },
      data: {
        status: newStatus,
        reviewedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            profile: {
              select: {
                displayName: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    // Optional: Create notification for participant
    await prisma.notification.create({
      data: {
        userId: participant.userId,
        type:
          action === PARTICIPANT_REVIEW_ACTIONS.APPROVE
            ? "PARTICIPANT_APPROVED"
            : "PARTICIPANT_REJECTED",
        title: `Participation ${action.toLowerCase()}d`,
        message:
          action === PARTICIPANT_REVIEW_ACTIONS.APPROVE
            ? `Your participation in "${participant.competition.name}" has been approved!`
            : `Your participation in "${participant.competition.name}" was rejected.`,
        relatedId: competitionId,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Participant ${action.toLowerCase()}d successfully`,
      participant: updatedParticipant,
      action,
    });
  } catch (error) {
    console.error("Error reviewing participant:", error);
    return NextResponse.json(
      { error: "Failed to review participant" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";