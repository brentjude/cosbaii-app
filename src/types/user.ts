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
  reviewed: boolean; // ✅ NEW: Reviewed status
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

export interface NewUserData {
  email: string;
  username: string;
  password: string;
  name?: string;
  reviewed?: boolean; // ✅ NEW: Optional for user creation
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  premiumUsers: number;
  reviewedUsers: number; // ✅ NEW
  unreviewedUsers: number; // ✅ NEW
}

export type { UserRole, UserStatus };