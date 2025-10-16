import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface ReorderCredential {
  id: number;
  order: number;
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { credentials } = body as { credentials: ReorderCredential[] };

    if (!Array.isArray(credentials) || credentials.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials array" },
        { status: 400 }
      );
    }

    const userId = parseInt(session.user.id);

    // Verify all credentials belong to the user
    const credentialIds = credentials.map(c => c.id);
    const existingCredentials = await prisma.competitionParticipant.findMany({
      where: {
        id: { in: credentialIds },
        userId: userId,
      },
    });

    if (existingCredentials.length !== credentials.length) {
      return NextResponse.json(
        { error: "Some credentials do not belong to you" },
        { status: 403 }
      );
    }

    // Update the order for each credential using a transaction
    await prisma.$transaction(
      credentials.map((credential) =>
        prisma.competitionParticipant.update({
          where: { id: credential.id },
          data: { order: credential.order },
        })
      )
    );

    return NextResponse.json(
      { 
        message: "Credentials reordered successfully",
        updatedCount: credentials.length 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error reordering credentials:", error);
    return NextResponse.json(
      { 
        error: "Failed to reorder credentials",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}