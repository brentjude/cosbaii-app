import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const credentialId = parseInt(id);

    if (isNaN(credentialId)) {
      return NextResponse.json(
        { error: "Invalid credential ID" },
        { status: 400 }
      );
    }

    // Find the competition participant (credential) and verify ownership
    const credential = await prisma.competitionParticipant.findUnique({
      where: { id: credentialId },
    });

    if (!credential) {
      return NextResponse.json(
        { error: "Credential not found" },
        { status: 404 }
      );
    }

    // Verify that the credential belongs to the current user
    if (credential.userId !== parseInt(session.user.id)) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own credentials" },
        { status: 403 }
      );
    }

    // Delete the credential
    await prisma.competitionParticipant.delete({
      where: { id: credentialId },
    });

    return NextResponse.json(
      { 
        message: "Credential deleted successfully",
        deletedId: credentialId 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting credential:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete credential",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch single credential
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const credentialId = parseInt(id);

    if (isNaN(credentialId)) {
      return NextResponse.json(
        { error: "Invalid credential ID" },
        { status: 400 }
      );
    }

    const credential = await prisma.competitionParticipant.findUnique({
      where: { id: credentialId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        competition: true,
        awards: true,
      },
    });

    if (!credential) {
      return NextResponse.json(
        { error: "Credential not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (credential.userId !== parseInt(session.user.id)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({ credential }, { status: 200 });

  } catch (error) {
    console.error("Error fetching credential:", error);
    return NextResponse.json(
      { error: "Failed to fetch credential" },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update credential order or status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const credentialId = parseInt(id);

    if (isNaN(credentialId)) {
      return NextResponse.json(
        { error: "Invalid credential ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { order, status } = body;

    // Find the credential and verify ownership
    const credential = await prisma.competitionParticipant.findUnique({
      where: { id: credentialId },
    });

    if (!credential) {
      return NextResponse.json(
        { error: "Credential not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (credential.userId !== parseInt(session.user.id)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Update the credential with proper typing
    const updateData: {
      order?: number;
      status?: string;
    } = {};
    
    if (order !== undefined) updateData.order = order;
    if (status !== undefined) updateData.status = status;

    const updatedCredential = await prisma.competitionParticipant.update({
      where: { id: credentialId },
      data: updateData,
    });

    return NextResponse.json(
      { 
        message: "Credential updated successfully",
        credential: updatedCredential 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating credential:", error);
    return NextResponse.json(
      { 
        error: "Failed to update credential",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}