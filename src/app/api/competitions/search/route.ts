import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ competitions: [] });
    }

    const competitions = await prisma.competition.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                name: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                location: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                organizer: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          },
        ],
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
        orderBy: [
            // Prioritize ACCEPTED competitions first
            { status: 'desc' },
            { eventDate: 'desc' },
        ],
        take: 20,
    });

    return NextResponse.json({ competitions });
  } catch (error) {
    console.error("Error searching competitions:", error);
    return NextResponse.json(
      { message: "Failed to search competitions" },
      { status: 500 }
    );
  }
}