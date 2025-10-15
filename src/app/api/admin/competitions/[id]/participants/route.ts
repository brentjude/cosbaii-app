import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check admin privileges
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

    // Check if competition exists
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
    });

    if (!competition) {
      return NextResponse.json(
        { error: "Competition not found" },
        { status: 404 }
      );
    }

    // Fetch participants with user and profile data
    const participants = await prisma.competitionParticipant.findMany({
      where: { competitionId },
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
      orderBy: [
        { status: "asc" }, // PENDING first
        { submittedAt: "desc" }, // Then by submission date
      ],
    });

    return NextResponse.json({
      success: true,
      participants,
      count: participants.length,
    });
  } catch (error) {
    console.error("Error fetching competition participants:", error);
    return NextResponse.json(
      { error: "Failed to fetch participants" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";