// Update: src/types/admin.ts
import { Competition } from "./competition";
import { Blog } from "./blog";
import { Feedback } from "./feedback";

export type UserStatus = "INACTIVE" | "ACTIVE" | "BANNED";
export type UserRole = "USER" | "ADMIN" | "MODERATOR";

export interface User {
  id: number;
  name: string | null;
  email: string;
  username: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  reviewedBy: string | null | undefined;
  isPremiumUser: boolean;
}

export interface NewUserData {
  isPremiumUser: boolean;
  name: string | null;
  email: string;
  username: string | null;
  password: string;
  role: UserRole;
  status: UserStatus;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  banned: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  totalCompetitions: number;
  pendingCompetitions: number;
  totalBlogs: number;
  publishedBlogs: number;
  totalFeedback: number;
  pendingFeedback: number;
}

export interface AdminUser extends User {
  profile?: {
    displayName: string | null;
    profilePicture: string | null;
  };
  _count: {
    competitions: number;
    blogs: number;
    feedback: number;
  };
}

// ✅ Define proper types for recent items
export interface RecentCompetition extends Competition {
  _count: {
    participants: number;
    awards: number;
  };
}

export interface RecentBlog extends Blog {
  _count: {
    likes: number;
    comments: number;
  };
}

// ✅ Fixed: Add name property to user object
export interface RecentFeedback extends Feedback {
  user: {
    id: number;
    name: string | null;
    email: string;
    username: string | null;
  };
}

// ✅ Update AdminDashboardData with proper types
export interface AdminDashboardData {
  stats: AdminStats;
  recentUsers: AdminUser[];
  recentCompetitions: RecentCompetition[];
  recentBlogs: RecentBlog[];
  recentFeedback: RecentFeedback[];
}