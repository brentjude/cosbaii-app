// src/app/api/admin/competitions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Allow any valid date (past or future)
const createCompetitionSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(200, "Name must be less than 200 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .nullable()
    .optional(),
  eventDate: z
    .string()
    .refine((date) => !isNaN(new Date(date).getTime()), "Event date must be a valid date"),
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
  competitionType: z.enum(["GENERAL", "ARMOR", "CLOTH", "SINGING"]),
  rivalryType: z.enum(["SOLO", "DUO", "GROUP"]),
  level: z.enum(["BARANGAY", "LOCAL", "REGIONAL", "NATIONAL", "WORLDWIDE"]),
});

// GET: Fetch competitions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const whereClause = status ? { status: status as any } : {};

    const [competitions, stats] = await Promise.all([
      prisma.competition.findMany({
        where: whereClause,
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
        orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      }),
      Promise.all([
        prisma.competition.count(),
        prisma.competition.count({ where: { status: "SUBMITTED" } }),
        prisma.competition.count({ where: { status: "ACCEPTED" } }),
        prisma.competition.count({ where: { status: "REJECTED" } }),
      ]).then(([total, pending, accepted, rejected]) => ({
        total,
        pending,
        accepted,
        rejected,
      })),
    ]);

    return NextResponse.json({
      competitions,
      stats,
      message: "Competitions fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching competitions:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch competitions",
      },
      { status: 500 }
    );
  }
}

// POST: Create new competition
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createCompetitionSchema.parse(body);

    const userId =
      typeof session.user.id === "string" ? parseInt(session.user.id) : (session.user.id as number);

    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const competition = await prisma.competition.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        eventDate: new Date(validatedData.eventDate),
        location: validatedData.location || null,
        organizer: validatedData.organizer || null,
        // New fields
        competitionType: validatedData.competitionType,
        rivalryType: validatedData.rivalryType,
        level: validatedData.level,
        submittedById: userId,
        status: session.user.role === "ADMIN" ? "ACCEPTED" : "SUBMITTED",
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

    if (session.user.role !== "ADMIN") {
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
    }

    return NextResponse.json(
      {
        competition,
        message: "Competition created successfully",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating competition:", error);

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

    return NextResponse.json({ message: "Failed to create competition" }, { status: 500 });
  }
}