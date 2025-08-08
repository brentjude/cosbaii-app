import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Define the update schema here since it's used in this file
const updateCompetitionSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(200, "Name must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .nullable()
    .optional(),
  eventDate: z
    .string()
    .transform((date) => new Date(date))
    .refine((date) => !isNaN(date.getTime()), "Event date must be a valid date")
    .optional(),
  location: z
    .string()
    .max(200, "Location must be less than 200 characters")
    .nullable()
    .optional(),
  organizer: z
    .string()
    .max(200, "Organizer must be less than 200 characters")
    .nullable()
    .optional(),
  competitionType: z.enum(["GENERAL", "ARMOR", "CLOTH", "SINGING"]).optional(),
  rivalryType: z.enum(["SOLO", "DUO", "GROUP"]).optional(),
  level: z.enum(["BARANGAY", "LOCAL", "REGIONAL", "NATIONAL", "WORLDWIDE"]).optional(),
  logoUrl: z.string().url().nullable().optional(),
  eventUrl: z.string().url().nullable().optional(),
  facebookUrl: z.string().url().nullable().optional(),
  instagramUrl: z.string().url().nullable().optional(),
  referenceLinks: z.string().nullable().optional(),
});

// GET: Fetch single competition
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: idParam } = await params; // ✅ Await params
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid competition ID" },
        { status: 400 }
      );
    }

    const competition = await prisma.competition.findUnique({
      where: { id },
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

    if (!competition) {
      return NextResponse.json(
        { message: "Competition not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      competition,
      message: "Competition fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching competition:", error);
    return NextResponse.json(
      { message: "Failed to fetch competition" },
      { status: 500 }
    );
  }
}

// PUT: Update competition
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: idParam } = await params; // ✅ Await params
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid competition ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateCompetitionSchema.parse(body);

    // Check if competition exists
    const existingCompetition = await prisma.competition.findUnique({
      where: { id },
    });

    if (!existingCompetition) {
      return NextResponse.json(
        { message: "Competition not found" },
        { status: 404 }
      );
    }

    // Prepare update data - only include defined fields
    const updateData: any = {};
    
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.eventDate !== undefined) updateData.eventDate = validatedData.eventDate;
    if (validatedData.location !== undefined) updateData.location = validatedData.location;
    if (validatedData.organizer !== undefined) updateData.organizer = validatedData.organizer;
    if (validatedData.competitionType !== undefined) updateData.competitionType = validatedData.competitionType;
    if (validatedData.rivalryType !== undefined) updateData.rivalryType = validatedData.rivalryType;
    if (validatedData.level !== undefined) updateData.level = validatedData.level;
    if (validatedData.logoUrl !== undefined) updateData.logoUrl = validatedData.logoUrl;
    if (validatedData.eventUrl !== undefined) updateData.eventUrl = validatedData.eventUrl;
    if (validatedData.facebookUrl !== undefined) updateData.facebookUrl = validatedData.facebookUrl;
    if (validatedData.instagramUrl !== undefined) updateData.instagramUrl = validatedData.instagramUrl;
    if (validatedData.referenceLinks !== undefined) updateData.referenceLinks = validatedData.referenceLinks;

    const updatedCompetition = await prisma.competition.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({
      message: "Competition updated successfully",
      competition: updatedCompetition,
    });
  } catch (error) {
    console.error("Error updating competition:", error);
    
    if (error instanceof z.ZodError) {
      const details = error.issues.map((i) => i.message).join("; ");
      return NextResponse.json(
        {
          message: details || "Validation failed",
          errors: error.issues,
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: "Failed to update competition" },
      { status: 500 }
    );
  }
}

// DELETE: Delete competition
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: idParam } = await params; // ✅ Await params
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid competition ID" },
        { status: 400 }
      );
    }

    // Check if competition exists
    const existingCompetition = await prisma.competition.findUnique({
      where: { id },
    });

    if (!existingCompetition) {
      return NextResponse.json(
        { message: "Competition not found" },
        { status: 404 }
      );
    }

    await prisma.competition.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Competition deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting competition:", error);
    return NextResponse.json(
      { message: "Failed to delete competition" },
      { status: 500 }
    );
  }
}