import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const submitCompetitionSchema = z.object({
  name: z.string().min(1, "Competition name is required").max(200, "Name must be less than 200 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").nullable().optional(),
  eventDate: z.string().min(1, "Event date is required"),
  location: z.string().max(200, "Location must be less than 200 characters").nullable().optional(),
  organizer: z.string().max(200, "Organizer must be less than 200 characters").nullable().optional(),
  competitionType: z.enum(["GENERAL", "ARMOR", "CLOTH", "SINGING"]),
  rivalryType: z.enum(["SOLO", "DUO", "GROUP"]),
  level: z.enum(["BARANGAY", "LOCAL", "REGIONAL", "NATIONAL", "WORLDWIDE"]),
  logoUrl: z.string().url().nullable().optional().or(z.literal("")),
  eventUrl: z.string().url().nullable().optional().or(z.literal("")),
  facebookUrl: z.string().url().nullable().optional().or(z.literal("")),
  instagramUrl: z.string().url().nullable().optional().or(z.literal("")),
  referenceLinks: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = submitCompetitionSchema.parse(body);

    // Convert user ID to number
    const userId = typeof session.user.id === "string" 
      ? parseInt(session.user.id) 
      : (session.user.id as number);

    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    // Create competition with SUBMITTED status (same structure as admin API)
    const competition = await prisma.competition.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        eventDate: new Date(validatedData.eventDate),
        location: validatedData.location || null,
        organizer: validatedData.organizer || null,
        competitionType: validatedData.competitionType,
        rivalryType: validatedData.rivalryType,
        level: validatedData.level,
        logoUrl: validatedData.logoUrl || null,
        eventUrl: validatedData.eventUrl || null,
        facebookUrl: validatedData.facebookUrl || null,
        instagramUrl: validatedData.instagramUrl || null,
        referenceLinks: validatedData.referenceLinks || null,
        submittedById: userId,
        status: "SUBMITTED", // User submissions need admin review
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

    // Create notifications for all admins (matching admin API pattern)
    const adminUsers = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    });

    if (adminUsers.length > 0) {
      const notifications = adminUsers.map((admin) => ({
        userId: admin.id,
        type: "COMPETITION_SUBMISSION",
        title: "New competition submitted for review",
        message: `${session.user.name || session.user.email} submitted: "${validatedData.name}"`,
        relatedId: competition.id,
      }));

      await prisma.notification.createMany({ data: notifications });
    }

    // Create notification for user
    await prisma.notification.create({
      data: {
        userId,
        type: "COMPETITION_SUBMITTED",
        title: "Competition Submitted Successfully",
        message: `Your competition "${competition.name}" has been submitted for review. You'll be notified once it's approved.`,
        relatedId: competition.id,
      },
    });

    return NextResponse.json({
      message: "Competition submitted successfully for review",
      competition,
    }, { status: 201 });

  } catch (error) {
    console.error("Error submitting competition:", error);

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
      { message: "Failed to submit competition" },
      { status: 500 }
    );
  }
}