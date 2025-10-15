import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    const featuredItems = await prisma.featuredItem.findMany({
      where: { userId },
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
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({
      success: true,
      featured: featuredItems,
    });
  } catch (error) {
    console.error("Error fetching featured items:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured items" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();
    
    const { featured } = body;

    if (!Array.isArray(featured)) {
      return NextResponse.json(
        { error: "Featured must be an array" },
        { status: 400 }
      );
    }

    if (featured.length > 3) {
      return NextResponse.json(
        { error: "Maximum 3 featured items allowed" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.featuredItem.deleteMany({
        where: { userId }
      });

      const validItems = featured
        .map((item, index) => ({
          userId,
          title: item.title?.trim() || "",
          description: item.description?.trim() || "",
          imageUrl: item.imageUrl?.trim() || "",
          character: item.character?.trim() || null,
          series: item.series?.trim() || null,
          type: item.type || "cosplay",
          competitionId: item.competitionId ? parseInt(String(item.competitionId)) : null,
          position: item.position?.trim() || null,
          award: item.award?.trim() || null,
          order: index,
        }))
        .filter(item => !!(item.imageUrl || item.title));

      if (validItems.length > 0) {
        await tx.featuredItem.createMany({
          data: validItems
        });
      }

      return await tx.featuredItem.findMany({
        where: { userId },
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
            }
          }
        },
        orderBy: { order: 'asc' }
      });
    });

    return NextResponse.json({ 
      success: true, 
      message: "Featured items updated successfully",
      featured: result,
    });
  } catch (error) {
    console.error("Error updating featured items:", error);
    return NextResponse.json(
      { 
        error: "Failed to update featured items", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}