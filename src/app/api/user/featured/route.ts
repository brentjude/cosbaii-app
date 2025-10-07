// src/app/api/user/featured/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch user's featured items
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
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({ 
      success: true, 
      featured: featuredItems 
    });

  } catch (error) {
    console.error("Error fetching featured items:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured items" },
      { status: 500 }
    );
  }
}

// PUT - Update user's featured items
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const { featured } = await request.json();

    if (!Array.isArray(featured) || featured.length !== 3) {
      return NextResponse.json(
        { error: "Featured items must be an array of exactly 3 items" },
        { status: 400 }
      );
    }

    // Delete existing featured items for this user
    await prisma.featuredItem.deleteMany({
      where: { userId }
    });

    // Create new featured items
    const featuredItemsData = featured.map((item, index) => ({
      userId,
      title: item.title || "",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      character: item.character || null,
      series: item.series || null,
      type: item.type || "cosplay",
      competitionId: item.competitionId || null,
      position: item.position || null,
      award: item.award || null,
      order: index,
    }));

    // Only create items that have content (at least a title or image)
    const validItems = featuredItemsData.filter(
      item => item.title.trim() || item.imageUrl.trim()
    );

    if (validItems.length > 0) {
      await prisma.featuredItem.createMany({
        data: validItems
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Featured items updated successfully" 
    });

  } catch (error) {
    console.error("Error updating featured items:", error);
    return NextResponse.json(
      { error: "Failed to update featured items" },
      { status: 500 }
    );
  }
}