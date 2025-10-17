// Update: src/types/user.ts
import type { UserRole, UserStatus } from "@/generated/prisma";

export interface User {
  id: number;
  email: string;
  name: string | null;
  username: string;
  image: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  isPremiumUser: boolean;
  emailVerified: boolean;
  // ✅ Add blog-related counts
  _count?: {
    blogs?: number;
    blogLikes?: number;
    blogComments?: number;
  };
}

export interface UserWithBlogStats extends User {
  blogsCount: number;
  blogLikesCount: number;
  blogCommentsCount: number;
}

// ✅ Add missing types that might be used elsewhere
export interface NewUserData {
  email: string;
  username: string;
  password: string;
  name?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  premiumUsers: number;
}

// Re-export Prisma enums for convenience
export type { UserRole, UserStatus };