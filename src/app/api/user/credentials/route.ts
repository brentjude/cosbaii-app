import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const createCredentialSchema = z.object({
  competitionId: z.number(),
  position: z.enum(["CHAMPION", "FIRST_PLACE", "SECOND_PLACE", "PARTICIPANT"]),
  cosplayTitle: z.string().min(1, "Cosplay title is required"),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  category: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id as string);

    const credentials = await prisma.competitionParticipant.findMany({
      where: { 
        userId,
        verified: true,
      },
      include: {
        competition: {
          select: {
            id: true,
            name: true,
            eventDate: true,
            location: true,
            competitionType: true,
            rivalryType: true,
            level: true,
            logoUrl: true,
          },
        },
      },
      orderBy: {
        competition: {
          eventDate: 'desc'
        }
      },
    });

    return NextResponse.json({
      credentials: credentials.map(credential => ({
        id: credential.id,
        competition: credential.competition,
        cosplayTitle: credential.cosplayTitle,
        position: credential.position,
        category: credential.category,
        imageUrl: credential.imageUrl,
      })),
    });
  } catch (error) {
    console.error("Error fetching credentials:", error);
    return NextResponse.json(
      { message: "Failed to fetch credentials" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id as string);
    const body = await request.json();
    const validatedData = createCredentialSchema.parse(body);

    // Check if user already has a credential for this competition
    const existingCredential = await prisma.competitionParticipant.findUnique({
      where: {
        userId_competitionId: {
          userId,
          competitionId: validatedData.competitionId,
        },
      },
    });

    if (existingCredential) {
      return NextResponse.json(
        { message: "You already have a credential for this competition" },
        { status: 400 }
      );
    }

    // Create the credential (will need admin verification)
    const credential = await prisma.competitionParticipant.create({
      data: {
        userId,
        competitionId: validatedData.competitionId,
        position: validatedData.position as any,
        cosplayTitle: validatedData.cosplayTitle,
        description: validatedData.description || null,
        imageUrl: validatedData.imageUrl || null,
        category: validatedData.category || null,
        verified: false, // Requires admin verification
      },
      include: {
        competition: true,
      },
    });

    // Create notification for admins
    await prisma.notification.create({
      data: {
        userId: 1, // Assuming admin user ID is 1, you might want to get actual admin users
        type: "CREDENTIAL_VERIFICATION",
        title: "New Credential Verification Request",
        message: `${session.user.name} has submitted a credential for ${credential.competition.name}`,
        relatedId: credential.id,
      },
    });

    return NextResponse.json({
      message: "Credential submitted successfully. It will be reviewed by admins.",
      credential,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    console.error("Error creating credential:", error);
    return NextResponse.json(
      { message: "Failed to create credential" },
      { status: 500 }
    );
  }
}