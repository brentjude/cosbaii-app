// 📁 c:\Website Projects\cosbaii-app\src\app\api\admin\users\stats\route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ 
        message: "Unauthorized. Admin or Moderator access required." 
      }, { status: 401 });
    }

    const [total, inactive, active, banned] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "INACTIVE" } }),
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({ where: { status: "BANNED" } }),
    ]);

    const stats = { total, inactive, active, banned };

    return NextResponse.json({ 
      stats,
      message: "User statistics fetched successfully" 
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json({
      message: "Internal server error"
    }, { status: 500 });
  }
}