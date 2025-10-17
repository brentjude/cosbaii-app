// Update: src/app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch all stats in parallel
    const [
      totalUsers,
      activeUsers,
      bannedUsers,
      reviewedUsers, // ✅ NEW
      unreviewedUsers, // ✅ NEW
      totalCompetitions,
      pendingCompetitions,
      totalBlogs,
      publishedBlogs,
      totalFeedback,
      pendingFeedback,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({ where: { status: "BANNED" } }),
      prisma.user.count({ where: { reviewed: true } }), // ✅ NEW
      prisma.user.count({ where: { reviewed: false } }), // ✅ NEW
      prisma.competition.count(),
      prisma.competition.count({ where: { status: "SUBMITTED" } }),
      prisma.blog.count(),
      prisma.blog.count({ where: { published: true } }),
      prisma.feedback.count(),
      prisma.feedback.count({ where: { status: "PENDING" } }),
    ]);

    return NextResponse.json({
      totalUsers,
      activeUsers,
      bannedUsers,
      reviewedUsers, // ✅ NEW
      unreviewedUsers, // ✅ NEW
      totalCompetitions,
      pendingCompetitions,
      totalBlogs,
      publishedBlogs,
      totalFeedback,
      pendingFeedback,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { message: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}